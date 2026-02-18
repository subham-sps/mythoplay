import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaPlay, FaChevronLeft, FaChevronRight, FaYoutube, FaStar } from 'react-icons/fa';

// Channel configuration - easy to update
export const YOUTUBE_CONFIG = {
  channelId: 'UCFSpc1EsFL3zn5VSQB-Z92g',
  channelHandle: '@NatkhatGannu-j1y',
  channelName: 'Natkhat Gannu',
  // Featured/Most viewed video
  featuredVideo: {
    id: 'tOLaeM41YGo', // A Song Every Child Must Hear in the Age of AI
    title: 'A Song Every Child Must Hear in the Age of AI',
    description: 'A beautiful and meaningful song for children! 🎵',
  },
  // Latest videos for carousel
  latestVideos: [
    { id: 'YA74_C-FoVk', title: 'Maha Shivratri Special - Feel Shiva\'s Blessings' },
    { id: 'MW_w5ennHfE', title: 'Learn Krishna\'s Prayer with Meaning' },
    { id: 'Ua_P3hjMU34', title: 'महाशिवरात्रि शिव भजन' },
    { id: 'TYIKgAkEU4Q', title: 'Learn & Pray At The Same Time!' },
    { id: 'f2Rv_xGQl0M', title: 'Learn 1-20 Counting with Krishna' },
    { id: '_CFQTdLcmwo', title: 'Little Krishna\'s Magical Dance' },
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
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="flex-shrink-0 w-64 cursor-pointer"
      onClick={onPlay}
    >
      <div className="relative rounded-2xl overflow-hidden shadow-lg border-3 border-primary-200 hover:border-primary-400 transition-all">
        {isPlaying ? (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&rel=0`}
            className="w-full aspect-video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <>
            <img src={thumbnailUrl} alt={title} className="w-full aspect-video object-cover" />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <div className="bg-primary-500 rounded-full p-3">
                <FaPlay className="text-white text-xl" />
              </div>
            </div>
          </>
        )}
      </div>
      <p className="mt-2 font-bold text-gray-700 text-sm truncate">{title}</p>
    </motion.div>
  );
};

export default function YouTubeVideoSection() {
  const [playingFeatured, setPlayingFeatured] = useState(false);
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
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

  const { featuredVideo, latestVideos, channelId, channelName } = YOUTUBE_CONFIG;

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FaYoutube className="text-4xl text-red-600" />
            <h2 className="text-3xl font-display text-gray-800">
              Watch {channelName} Videos! 📺
            </h2>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Enjoy our fun mythology stories and learn amazing tales from Indian epics!
          </p>
        </div>

        {/* Featured Video */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <FaStar className="text-yellow-500" />
            <h3 className="text-xl font-bold text-gray-800">Most Popular Video</h3>
          </div>
          <div className="max-w-3xl mx-auto">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-primary-300">
              {playingFeatured ? (
                <iframe
                  src={`https://www.youtube.com/embed/${featuredVideo.id}?autoplay=1&mute=1&rel=0`}
                  className="w-full aspect-video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div
                  className="relative cursor-pointer group"
                  onClick={() => setPlayingFeatured(true)}
                >
                  <img
                    src={`https://img.youtube.com/vi/${featuredVideo.id}/maxresdefault.jpg`}
                    alt={featuredVideo.title}
                    className="w-full aspect-video object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-all">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="bg-red-600 rounded-full p-6 shadow-lg"
                    >
                      <FaPlay className="text-white text-3xl ml-1" />
                    </motion.div>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h4 className="text-white text-xl font-bold drop-shadow-lg">
                      {featuredVideo.title}
                    </h4>
                    <p className="text-white/90 text-sm drop-shadow">
                      {featuredVideo.description}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Latest Videos Carousel */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800">🎬 Latest Videos</h3>
            <div className="flex gap-2">
              <button
                onClick={() => scrollCarousel('left')}
                className="p-2 rounded-full bg-white shadow-md hover:bg-primary-50 transition-colors"
              >
                <FaChevronLeft className="text-primary-600" />
              </button>
              <button
                onClick={() => scrollCarousel('right')}
                className="p-2 rounded-full bg-white shadow-md hover:bg-primary-50 transition-colors"
              >
                <FaChevronRight className="text-primary-600" />
              </button>
            </div>
          </div>

          <div
            ref={carouselRef}
            className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
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

        {/* YouTube Subscribe Button */}
        <div className="text-center">
          <div className="inline-flex flex-col items-center gap-4 p-6 bg-white rounded-3xl shadow-lg border-2 border-red-100">
            <p className="text-gray-700 font-medium">
              Love our videos? Subscribe for more fun stories! 🎉
            </p>
            <a
              href={`https://www.youtube.com/channel/${channelId}?sub_confirmation=1`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-full transition-all transform hover:scale-105 shadow-lg"
            >
              <FaYoutube className="text-xl" />
              Subscribe to {channelName}
            </a>
            <p className="text-sm text-gray-500">
              Join our growing family of mythology lovers!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

