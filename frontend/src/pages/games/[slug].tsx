import { GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';
import { FaArrowLeft, FaExpand } from 'react-icons/fa';
import SEO, { SITE_URL } from '@/components/SEO';
import { GAMES, getGame, Game } from '@/lib/games';

interface PlayPageProps {
  game: Game;
}

export default function PlayGame({ game }: PlayPageProps) {
  const gameLd = {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: game.title,
    description: game.description,
    url: `${SITE_URL}/games/${game.slug}`,
    genre: 'Educational',
    applicationCategory: 'Game',
    operatingSystem: 'Web browser',
  };

  return (
    <div className="h-[100dvh] flex flex-col bg-gray-900">
      <SEO
        title={`${game.title} — Play Free`}
        description={game.description}
        path={`/games/${game.slug}`}
        jsonLd={gameLd}
      />

      {/* Slim top bar (keeps the game itself full-bleed) */}
      <header className="shrink-0 flex items-center justify-between gap-3 px-3 py-2 bg-white/90 backdrop-blur border-b border-gray-200">
        <Link
          href="/games"
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-primary-600 px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <FaArrowLeft aria-hidden="true" /> All games
        </Link>
        <span className="font-display text-lg text-gray-800 truncate">
          <span aria-hidden="true">{game.emoji}</span> {game.title}
        </span>
        <a
          href={game.file}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-primary-600 px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Open game fullscreen in a new tab"
        >
          <FaExpand aria-hidden="true" /> <span className="hidden sm:inline">Fullscreen</span>
        </a>
      </header>

      {/* The game itself, full-bleed in an iframe */}
      <div className="flex-1 min-h-0">
        <iframe
          src={game.file}
          title={game.title}
          className="w-full h-full border-0"
          allow="autoplay; fullscreen"
        />
      </div>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: GAMES.map((g) => ({ params: { slug: g.slug } })),
  fallback: false,
});

export const getStaticProps: GetStaticProps<PlayPageProps> = async ({ params }) => {
  const game = getGame(params?.slug as string);
  if (!game) return { notFound: true };
  return { props: { game } };
};
