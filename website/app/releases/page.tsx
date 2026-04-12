import Navbar from '@/components/Navbar';
import ReleaseCard from '@/components/ReleaseCard';
import { FALLBACK_RELEASES } from '@/lib/constants';

async function getAllReleases() {
  try {
    const url = 'https://api.github.com/repos/MRuhan17/Forge/releases';
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Forge-Website-Bot'
      },
      next: { revalidate: 3600 }
    });
    if (!res.ok) {
      console.error(`GitHub API Error (${url}): ${res.status} ${res.statusText}`);
      return [];
    }
    return res.json();
  } catch (e: any) {
    console.error('Fetch Exception (getAllReleases):', e.message);
    return [];
  }
}

export default async function ReleasesPage() {
  const apiReleases = await getAllReleases();
  const releases = apiReleases.length > 0 ? apiReleases : FALLBACK_RELEASES;

  return (
    <main className="min-h-screen pt-32 pb-20 px-4">
      <Navbar />
      
      <div className="max-w-5xl mx-auto">
        <header className="mb-16 text-center">
          <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">Releases</h1>
          <p className="text-gray-400 text-lg">
            Download the latest binaries for your operating system.
          </p>
        </header>

        <div className="space-y-8">
          {releases.map((release: any) => (
            <ReleaseCard key={release.id || release.tag_name} release={release} />
          ))}
        </div>
      </div>
    </main>
  );
}
