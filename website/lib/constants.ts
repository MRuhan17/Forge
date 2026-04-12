export const FALLBACK_RELEASES = [
  {
    id: 1,
    tag_name: "v0.1-alpha",
    published_at: new Date().toISOString(),
    body: "The genesis of Forge. A distributed TUI ecosystem featuring a high-concurrency Rust engine, non-blocking Task orchestration, and an interactive React-based terminal dashboard. Designed for architects who demand zero-latency workflows.",
    html_url: "https://github.com/MRuhan17/Forge",
    assets: [
      {
        name: "forge-windows-x64.exe",
        browser_download_url: "/downloads/forge-windows.exe",
        size: 15728640 
      },
      {
        name: "forge-macos-arm64",
        browser_download_url: "/downloads/forge-macos",
        size: 12582912 
      },
      {
        name: "forge-linux-x64",
        browser_download_url: "/downloads/forge-linux",
        size: 14680064 
      }
    ]
  }
];
