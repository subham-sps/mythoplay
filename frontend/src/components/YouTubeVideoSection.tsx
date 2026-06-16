import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FaPlay, FaChevronLeft, FaChevronRight, FaYoutube, FaStar } from 'react-icons/fa';

// Channel configuration - easy to update
export const YOUTUBE_CONFIG = {
  channelId: 'UCFSpc1EsFL3zn5VSQB-Z92g',
  channelHandle: '@NatkhatGannu-j1y',
  channelName: 'Natkhat Gannu',
  featuredVideo: {
    id: 'tOLaeM41YGo',
    title: 'A Song Every Child Must Hear in the Age of AI',
    description: 'A beautiful and meaningful song for children! 🎵',
  },
  latestVideos: [
    { id: 'YA74_C-FoVk', title: "Maha Shivratri Special - Feel Shiva's Blessings" },
    { id: 'MW_w5ennHfE', title: "Learn Krishna's Prayer with Meaning" },
    { id: 'Ua_P3hjMU34', title: 'महाशिवरात्रि शिव भजन' },
    { id: 'TYIKgAkEU4Q', title: 'Learn & Pray At The Same Time!' },
    { id: 'f2Rv_xGQl0M', title: 'Learn 1-20 Counting with Krishna' },
    { id: '_CFQTdLcmwo', title: "Little Krishna's Magical Dance" },
    { id: '8SJOIpUsREs', title: '3D Animated Navratri Songs' },
  ],
};

interface VideoCardProps {
  videoId: string;
  title: string;
  isPlaying: boolean;
  onPlay: () => void;
}

const VideoCard = ({ videoId, title, isPlaying, onPlay }: VideoCardProps) => {
  const [loaded, setLoaded] = useState(false);
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;

  return (
    <div className="flex-shrink-0 w-64 snap-start group">
      <div className="relative rounded-2xl overflow-hidden shadow-card border border-primary-100 group-hover:border-primary-300 group-hover:shadow-card-hover transition-all">
        {isPlaying ? (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&rel=0`}
            className="w-full aspect-video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={title}
          />
        ) : (
          <motion.button
            type="button"
            whileHover={{ y: -2 }}
            onClick={onPlay}
            aria-label={`Play video: ${title}`}
            className="relative block w-full focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-300"
          >
            {!loaded && <div className="skeleton w-full aspect-video" />}
            <img
              src={thumbnailUrl}
              alt=""
              loading="lazy"
              onLoad={() => setLoaded(true)}
              className={`w-full aspect-video object-cover transition-opacity ${loaded ? 'opacity-100' : 'opacity-0 absolute inset-0'}`}
            />
            <span className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" aria-hidden="true" />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="bg-white/90 backdrop-blur rounded-full p-3 shadow-card group-hover:scale-110 transition-transform">
                <FaPlay className="text-primary-600 text-lg ml-0.5" aria-hidden="true" />
              </span>
            </span>
          </motion.button>
        )}
      </div>
      <p className="mt-2 font-semibold text-gray-700 text-sm line-clamp-2 min-h-[2.5rem]">{title}</p>
    </div>
  );
};

export default function YouTubeVideoSection() {
  const [playingFeatured, setPlayingFeatured] = useState(false);
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
  const [featuredLoaded, setFeaturedLoaded] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = 280;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const updateScrollButtons = () => {
    const el = carouselRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    updateScrollButtons();
    const el = carouselRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateScrollButtons, { passive: true });
    window.addEventListener('resize', updateScrollButtons);
    return () => {
      el.removeEventListener('scroll', updateScrollButtons);
      window.removeEventListener('resize', updateScrollButtons);
    };
  }, []);

  const handleCarouselKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      scrollCarousel('left');
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      scrollCarousel('right');
    }
  };

  const { featuredVideo, latestVideos, channelId, channelName } = YOUTUBE_CONFIG;

  return (
    <section className="section bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
      <div className="container-app">
        {/* Section Header */}
        <div className="text-center mb-10">
          <span className="eyebrow mb-4">
            <FaYoutube className="text-red-600" /> Video of the Week
          </span>
          <h2 className="section-title mt-3">Stories, Songs & Slokas 📺</h2>
          <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
            Enjoy our fun mythology stories and learn amazing tales from Indian epics.
          </p>
        </div>

        {/* Featured Video */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <FaStar className="text-amber-500" aria-hidden="true" />
            <h3 className="text-lg font-bold text-gray-800">Featured Video</h3>
          </div>
          <div className="max-w-3xl mx-auto">
            <div className="relative rounded-3xl overflow-hidden shadow-card-hover border border-primary-200">
              {playingFeatured ? (
                <iframe
                  src={`https://www.youtube.com/embed/${featuredVideo.id}?autoplay=1&mute=1&rel=0`}
                  className="w-full aspect-video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={featuredVideo.title}
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setPlayingFeatured(true)}
                  aria-label={`Play featured video: ${featuredVideo.title}`}
                  className="relative block w-full text-left group focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-300"
                >
                  {!featuredLoaded && <div className="skeleton w-full aspect-video" />}
                  <img
                    src={`https://img.youtube.com/vi/${featuredVideo.id}/maxresdefault.jpg`}
                    alt=""
                    onLoad={() => setFeaturedLoaded(true)}
                    className={`w-full aspect-video object-cover transition-opacity ${featuredLoaded ? 'opacity-100' : 'opacity-0 absolute inset-0'}`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10 group-hover:from-black/80 transition-all" />
                  <motion.div
                    whileHover={{ scale: 1.08 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div className="bg-red-600 rounded-full p-5 md:p-6 shadow-fun">
                      <FaPlay className="text-white text-2xl md:text-3xl ml-1" aria-hidden="true" />
                    </div>
                  </motion.div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h4 className="text-white text-lg md:text-xl font-bold drop-shadow-lg">
                      {featuredVideo.title}
                    </h4>
                    <p className="text-white/90 text-sm drop-shadow mt-1">
                      {featuredVideo.description}
                    </p>
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Latest Videos Carousel */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">🎬 Latest Videos</h3>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => scrollCarousel('left')}
                disabled={!canScrollLeft}
                aria-label="Scroll videos left"
                className="p-2 rounded-full bg-white shadow-soft border border-gray-100 hover:bg-primary-50 hover:border-primary-200 transition-colors disabled:opacity-40 disabled:hover:bg-white disabled:cursor-not-allowed"
              >
                <FaChevronLeft className="text-primary-600" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => scrollCarousel('right')}
                disabled={!canScrollRight}
                aria-label="Scroll videos right"
                className="p-2 rounded-full bg-white shadow-soft border border-gray-100 hover:bg-primary-50 hover:border-primary-200 transition-colors disabled:opacity-40 disabled:hover:bg-white disabled:cursor-not-allowed"
              >
                <FaChevronRight className="text-primary-600" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div
            ref={carouselRef}
            tabIndex={0}
            role="region"
            aria-label="Latest videos carousel"
            onKeyDown={handleCarouselKey}
            className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth snap-x snap-mandatory focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-200 rounded-2xl"
          >
            {latestVideos.map((video) => (
              <VideoCard
                key={video.id}
                videoId={video.id}
                title={video.title}
                isPlaying={playingVideoId === video.id}
                onPlay={() => setPlayingVideoId(video.id)}
              />
            ))}
          </div>
        </div>

        {/* Subscribe CTA */}
        <div className="text-center">
          <div className="inline-flex flex-col items-center gap-3 px-6 py-5 bg-white rounded-3xl shadow-card border border-red-100 max-w-md">
            <p className="text-gray-700 font-medium">
              Love our videos? Subscribe for more fun stories! 🎉
            </p>
            <a
              href={`https://www.youtube.com/channel/${channelId}?sub_confirmation=1`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-full transition-all transform hover:-translate-y-0.5 shadow-card"
            >
              <FaYoutube className="text-xl" aria-hidden="true" />
              Subscribe to {channelName}
            </a>
            <p className="text-xs text-gray-500">
              Join our growing family of mythology lovers!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
