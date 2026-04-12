import { Download, Calendar, Tag, HardDrive } from 'lucide-react';

interface Asset {
  name: string;
  browser_download_url: string;
  size: number;
}

interface ReleaseCardProps {
  release: {
    tag_name: string;
    published_at: string;
    body: string;
    assets: Asset[];
    html_url: string;
  };
}

function formatBytes(bytes: number) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function getOsLabel(name: string) {
  const n = name.toLowerCase();
  if (n.includes('win') || n.endsWith('.exe')) return 'Windows';
  if (n.includes('mac') || n.includes('dmg') || n.includes('darwin')) return 'macOS';
  if (n.includes('linux')) return 'Linux';
  return 'Binary';
}

export default function ReleaseCard({ release }: ReleaseCardProps) {
  return (
    <div className="p-8 rounded-3xl glass hover:bg-white/[0.04] transition-all bg-zinc-900/20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <Tag className="w-5 h-5 text-blue-500" />
            <h2 className="text-2xl font-black">{release.tag_name}</h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-500 border border-blue-500/20 uppercase tracking-widest">
              Stable
            </span>
          </div>
          <div className="flex items-center space-x-2 text-gray-500 text-sm">
            <Calendar className="w-4 h-4" />
            <span>{new Date(release.published_at).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
          </div>
        </div>
        
        <a 
          href={release.html_url} 
          target="_blank"
          className="text-sm font-medium text-gray-400 hover:text-white underline underline-offset-4 decoration-white/10"
        >
          View on GitHub
        </a>
      </div>

      <div className="prose prose-invert prose-sm mb-12 text-gray-400 max-w-none line-clamp-3">
        {release.body || 'No description provided.'}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {release.assets.map((asset) => (
          <a
            key={asset.name}
            href={asset.browser_download_url}
            className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all group"
          >
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className="p-2 rounded-lg bg-black/40 text-gray-400 group-hover:text-blue-500 transition-colors">
                <HardDrive className="w-4 h-4" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold truncate">{getOsLabel(asset.name)}</span>
                <span className="text-[10px] text-gray-500">{formatBytes(asset.size)}</span>
              </div>
            </div>
            <Download className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" />
          </a>
        ))}
      </div>
    </div>
  );
}
