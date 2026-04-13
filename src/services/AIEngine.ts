import { EngineContext, CommandEngine } from './CommandEngine';

export interface AIResponse {
  message: string;
  suggestedCommand?: string;
  confidence: number;
  autoExecutable?: boolean;
}

export class AIEngine {
  private static MAPPINGS = [
    { pattern: /run task\s+(.+)/i, command: 'task run', hasParams: true },
    { pattern: /^run task/i, command: 'task run', hasParams: false },
    { pattern: /delete project/i, command: 'project delete', hasParams: false },
    { pattern: /create project\s+(.+)/i, command: 'project create', hasParams: true },
    { pattern: /create task\s+(.+)/i, command: 'task create', hasParams: true },
    { pattern: /^help/i, command: 'help', hasParams: false },
    // Context-Dependent Patterns
    { pattern: /^repeat|^do it again|^run again/i, command: '@context_repeat', hasParams: false },
    { pattern: /^delete (it|this project|this)/i, command: '@context_delete_project', hasParams: false }
  ];

  static translate(nl: string, context: EngineContext): AIResponse {
    const trimmed = nl.trim();

    for (const mapping of this.MAPPINGS) {
      const match = trimmed.match(mapping.pattern);
      if (match) {
        let finalCmd = mapping.command;
        let isVeryConfident = false;
        let finalMessage = "It looks like you want to run a command.";
        
        // 1. Resolve Context Variables
        if (finalCmd === '@context_repeat') {
           // history[0] is the current utterance, history[1] is the previous
           const prevCmd = context.history.find(cmd => cmd.startsWith('/') || /^[a-z_]+/i.test(cmd) && !cmd.includes('again'));
           if (prevCmd && prevCmd.startsWith('/')) {
              finalCmd = prevCmd.slice(1);
              isVeryConfident = true;
              finalMessage = `Repeating your last command.`;
           } else {
              return { message: "I couldn't find a recent command to repeat.", confidence: 0 };
           }
        } 
        else if (finalCmd === '@context_delete_project') {
           if (context.viewState.type === 'project_detail') {
              const proj = context.projects.find(p => p.id === context.viewState.projectId);
              finalCmd = `project delete`;
              if (proj) finalMessage = `You are trying to delete the active project: ${proj.name}.`;
              // Not setting very confident to ensure user must confirm visually via fallback
              isVeryConfident = false;
           } else {
              return { message: "You asked to delete 'this', but you aren't actively focused on a single project detail screen.", confidence: 0 };
           }
        }
        // 2. Resolve Normal Parameters
        else if (mapping.hasParams && match[1] && match[1].trim().length > 0) {
           finalCmd += ` ${match[1].trim()}`;
           isVeryConfident = true;
           finalMessage = "I understood exactly what you meant.";
        } else if (mapping.command === 'help') {
           isVeryConfident = true;
           finalMessage = "I will pull up the help menu.";
        }

        return {
          message: finalMessage,
          suggestedCommand: `/${finalCmd}`,
          confidence: isVeryConfident ? 0.95 : 0.75,
          autoExecutable: isVeryConfident
        };
      }
    }

    return {
      message: `I'm uncertain what you mean by "${nl}". Could you confirm or try a direct command?`,
      confidence: 0.3
    };
  }

  static async handle(nlText: string, context: EngineContext): Promise<AIResponse> {
    context.showFeedback("AI translating with context...");
    
    // Inject EngineContext cleanly into translator for state-awareness
    const response = this.translate(nlText, context);
    
    setTimeout(async () => {
      // Ignore if parsing failed out of bounds deeply
      if (response.confidence === 0) {
         context.showFeedback(`AI Context Error: ${response.message}`);
         await context.logActivity(`AI Error: ${response.message}`, 'error');
         return;
      }

      if (response.confidence >= 0.90 && response.autoExecutable && response.suggestedCommand) {
         context.showFeedback(`AI Auto-executing: ${response.suggestedCommand}`);
         await context.logActivity(`${response.suggestedCommand}`, 'command');
         const cmdRaw = response.suggestedCommand.slice(1);
         await CommandEngine.execute(cmdRaw, context);
      } 
      else if (response.confidence >= 0.70 && response.suggestedCommand) {
         context.showFeedback(`AI: ${response.message} (Try typing: ${response.suggestedCommand})`);
         await context.logActivity(`${response.suggestedCommand}`, 'ai');
      } 
      else {
         context.showFeedback(`AI: ${response.message}`);
         await context.logActivity(`${nlText}`, 'ai');
      }
    }, 600);
    
    return response;
  }
}
