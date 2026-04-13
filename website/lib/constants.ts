export const FALLBACK_RELEASES = [
  {
    id: 1,
    tag_name: "v1.0.0-stable",
    published_at: new Date().toISOString(),
    body: "Forge Production Release. Secure, low-latency infrastructure orchestration. Fully optimized for high-concurrency environments.",
    assets: [
      {
        name: "Forge Windows x64",
        browser_download_url: "/downloads/forge-windows.exe",
        size: 15728640 
      },
      {
        name: "Forge macOS ARM",
        browser_download_url: "/downloads/forge-macos",
        size: 12582912 
      },
      {
        name: "Forge Linux x64",
        browser_download_url: "/downloads/forge-linux",
        size: 14680064 
      }
    ]
  }
];
