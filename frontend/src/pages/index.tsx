import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/lib/store';
import {
  FaTrophy,
  FaStar,
  FaArrowRight,
  FaBook,
  FaFeatherAlt,
  FaSun,
  FaGraduationCap,
  FaSmile,
  FaShieldAlt,
  FaGift,
  FaCrown,
  FaBolt,
  FaGamepad,
} from 'react-icons/fa';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import YouTubeVideoSection, { YOUTUBE_CONFIG } from '@/components/YouTubeVideoSection';
import GitaWeeklySection from '@/components/GitaWeeklySection';
import SEO, { SITE_URL, SITE_NAME } from '@/components/SEO';
import { GAMES } from '@/lib/games';

const FAQS = [
  {
    q: 'What is Natkhat Gannu?',
    a: 'Natkhat Gannu is a fun, kid-safe learning platform where children aged 5–14 explore Indian mythology through interactive quizzes, weekly stories from the Ramayana and Mahabharata, Bhagavad Gita slokas, and mantras.',
  },
  {
    q: 'Which age groups is it designed for?',
    a: 'Content is tailored for three groups: Little Stars (5–7), Rising Champs (8–10), and Quiz Masters (11–14). Each quiz and story is matched to the right reading level and attention span.',
  },
  {
    q: 'Is it safe for children?',
    a: 'Yes. We store only the minimum information needed to run the quizzes, follow kid-safe practices, and all videos and stories are manually curated — no open comments or unmoderated content.',
  },
  {
    q: 'What topics do the quizzes cover?',
    a: 'Quizzes cover Ramayana, Mahabharata, Krishna Leela, Ganesha stories, and Indian festivals. We also publish a weekly Bhagavad Gita sloka and a mantra of the week with meaning, benefits, and rituals.',
  },
  {
    q: 'Do I need to pay to use Natkhat Gannu?',
    a: 'Core quizzes and weekly stories are free to play. Members of the Natkhat Gannu Community unlock exclusive quizzes, special badges, gift eligibility, and early access to new stories.',
  },
];

export default function Home() {
  const { isAuthenticated } = useAuthStore();

  const features = [
    {
      icon: FaBook,
      tint: 'from-primary-400 to-primary-600',
      title: 'Mythological Story of the Week',
      description:
        'Learn Indian mythology through stories about Gods & Goddesses from Puranas, Upanishads & Epics — one week at a time!',
    },
    {
      icon: FaFeatherAlt,
      tint: 'from-accent-400 to-accent-600',
      title: 'Bhagavad Gita Sloka of the Week',
      description:
        "Learn one Sloka at a time from Lord Krishna's timeless wisdom shared on the battlefield of Kurukshetra.",
    },
    {
      icon: FaSun,
      tint: 'from-amber-400 to-orange-500',
      title: 'Mantra of the Week',
      description:
        'Learn one mantra a week for your daily prayer — with meaning, benefits & rituals!',
    },
  ];

  const stats = [
    { value: '20+', label: 'Quizzes' },
    { value: '5–14', label: 'Age Groups' },
    { value: '100%', label: 'Kid-Safe' },
  ];

  const valueProps = [
    {
      icon: FaGraduationCap,
      title: 'Learn by Playing',
      description: 'Bite-sized quizzes that turn ancient stories into fun adventures.',
    },
    {
      icon: FaSmile,
      title: 'Age-appropriate',
      description: 'Content tailored for Little Stars, Rising Champs & Quiz Masters.',
    },
    {
      icon: FaShieldAlt,
      title: 'Kid-Safe & Parent-Approved',
      description: 'We only store minimal info and follow kid-safe practices.',
    },
  ];

  const organizationLd = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.ico`,
    description:
      'A kid-safe learning platform teaching Indian mythology to children aged 5–14 through interactive quizzes, weekly stories, Bhagavad Gita slokas, and mantras.',
    sameAs: [
      `https://www.youtube.com/channel/${YOUTUBE_CONFIG.channelId}`,
      `https://www.youtube.com/${YOUTUBE_CONFIG.channelHandle}`,
    ],
  };

  const websiteLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: 'en-IN',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/quiz?category={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  const videoLd = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: YOUTUBE_CONFIG.featuredVideo.title,
    description: YOUTUBE_CONFIG.featuredVideo.description,
    thumbnailUrl: `https://img.youtube.com/vi/${YOUTUBE_CONFIG.featuredVideo.id}/maxresdefault.jpg`,
    uploadDate: '2024-01-01',
    embedUrl: `https://www.youtube.com/embed/${YOUTUBE_CONFIG.featuredVideo.id}`,
    contentUrl: `https://www.youtube.com/watch?v=${YOUTUBE_CONFIG.featuredVideo.id}`,
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/favicon.ico` },
    },
  };

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Natkhat Gannu — Learn Indian Mythology Through Fun Quizzes for Kids"
        description="Natkhat Gannu helps kids aged 5–14 learn Indian mythology through interactive quizzes, weekly stories from the Ramayana and Mahabharata, Bhagavad Gita slokas, and mantras. Kid-safe and parent-approved."
        path="/"
        keywords={[
          'Indian mythology for kids',
          'Ramayana quiz for children',
          'Mahabharata stories for kids',
          'Bhagavad Gita for children',
          'Krishna stories for kids',
          'mantras for children',
          'Natkhat Gannu',
          'mythology quizzes',
        ]}
        jsonLd={[organizationLd, websiteLd, videoLd, faqLd]}
      />
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-brand-hero pointer-events-none" aria-hidden="true" />
        <div className="relative container-app px-4 pt-16 pb-24 md:pt-24 md:pb-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="eyebrow mb-6">
              ✨ New stories every week
            </span>
            <h1 className="heading-fun mt-6 mb-6">
              Learn Indian Mythology<br />Through Fun Quizzes! 🏹
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Join thousands of kids exploring ancient stories of gods, heroes, and magical adventures.
            </p>
            <div className="flex flex-wrap justify-center gap-3 md:gap-4">
              <Link
                href={isAuthenticated ? '/quiz' : '/login'}
                className="btn-primary text-lg px-7 py-4"
              >
                Start Your Adventure <FaArrowRight />
              </Link>
              <Link href="/games" className="btn-ghost text-lg px-7 py-4">
                <FaGamepad className="text-accent-500" /> Play Games
              </Link>
              <Link href="/leaderboard" className="btn-ghost text-lg px-7 py-4">
                <FaTrophy className="text-primary-500" /> Leaderboard
              </Link>
            </div>

            {/* Stats strip */}
            <div className="mt-12 grid grid-cols-3 gap-3 max-w-md mx-auto">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl bg-white/70 backdrop-blur border border-white/80 shadow-soft px-2 py-3"
                >
                  <div className="font-display text-2xl md:text-3xl text-primary-600">{s.value}</div>
                  <div className="text-xs md:text-sm text-gray-600 font-medium">{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Floating decorations */}
          <motion.div
            className="absolute top-10 left-6 md:left-10 text-5xl md:text-6xl select-none"
            animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            aria-hidden="true"
          >
            🐘
          </motion.div>
          <motion.div
            className="absolute top-20 right-6 md:right-20 text-4xl md:text-5xl select-none"
            animate={{ y: [0, -15, 0], rotate: [0, -5, 0] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            aria-hidden="true"
          >
            🦚
          </motion.div>
          <motion.div
            className="absolute bottom-10 left-10 md:left-20 text-4xl md:text-5xl select-none"
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            aria-hidden="true"
          >
            🪷
          </motion.div>
          <motion.div
            className="hidden md:block absolute bottom-16 right-24 text-5xl select-none"
            animate={{ y: [0, -8, 0], rotate: [0, 4, 0] }}
            transition={{ duration: 3.2, repeat: Infinity }}
            aria-hidden="true"
          >
            🏹
          </motion.div>
        </div>
      </section>

      {/* Natkhat Gannu Community — hero spotlight */}
      <section className="relative section-tight" aria-labelledby="ng-heading">
        <div className="container-app">
          <div className="relative overflow-hidden rounded-[2rem] shadow-card-hover border border-amber-200/70">
            {/* Base gradient */}
            <div
              className="absolute inset-0 bg-gradient-to-br from-amber-400 via-orange-500 to-pink-500"
              aria-hidden="true"
            />
            {/* Texture / glow */}
            <div
              className="absolute inset-0 bg-[radial-gradient(800px_400px_at_10%_0%,rgba(255,255,255,0.35),transparent_60%),radial-gradient(700px_400px_at_100%_100%,rgba(236,72,153,0.35),transparent_60%)]"
              aria-hidden="true"
            />
            {/* Soft grain dots */}
            <div
              className="absolute inset-0 opacity-20 mix-blend-overlay"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)',
                backgroundSize: '18px 18px',
              }}
              aria-hidden="true"
            />

            {/* Decorative sparkles */}
            <motion.div
              className="absolute top-6 right-8 text-3xl select-none"
              animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.15, 1] }}
              transition={{ duration: 4, repeat: Infinity }}
              aria-hidden="true"
            >
              ✨
            </motion.div>
            <motion.div
              className="absolute bottom-8 left-8 text-3xl select-none"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 2.6, repeat: Infinity }}
              aria-hidden="true"
            >
              🌟
            </motion.div>

            <div className="relative grid lg:grid-cols-[1.1fr_1fr] gap-8 lg:gap-10 p-7 md:p-10 lg:p-12">
              {/* Left — pitch */}
              <div className="text-white">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur text-white text-xs font-bold uppercase tracking-wider border border-white/30">
                  <FaCrown aria-hidden="true" /> Members Only Circle
                </div>

                <h2
                  id="ng-heading"
                  className="font-display text-3xl md:text-4xl lg:text-5xl leading-tight mt-4 drop-shadow-sm"
                >
                  Join the Natkhat Gannu Community
                </h2>

                <p className="mt-3 text-white/95 md:text-lg max-w-lg leading-relaxed">
                  Unlock exclusive quizzes, earn shiny badges, and get special gifts —
                  while learning mythology the fun way.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href={isAuthenticated ? '/profile' : '/login'}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-orange-700 font-bold rounded-2xl shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all"
                  >
                    <FaStar className="text-amber-500" aria-hidden="true" /> Become a Member
                    <FaArrowRight aria-hidden="true" />
                  </Link>
                  <a
                    href="https://www.youtube.com/channel/UCFSpc1EsFL3zn5VSQB-Z92g?sub_confirmation=1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/15 backdrop-blur text-white font-bold border border-white/40 hover:bg-white/25 transition-all"
                  >
                    ▶ Watch on YouTube
                  </a>
                </div>

                <div className="mt-6 flex items-center gap-3 text-white/90 text-sm">
                  <div className="flex -space-x-2">
                    <span className="w-7 h-7 rounded-full bg-white/30 border-2 border-white flex items-center justify-center text-sm">🧒</span>
                    <span className="w-7 h-7 rounded-full bg-white/30 border-2 border-white flex items-center justify-center text-sm">👧</span>
                    <span className="w-7 h-7 rounded-full bg-white/30 border-2 border-white flex items-center justify-center text-sm">👦</span>
                  </div>
                  <p>
                    Join <span className="font-bold">thousands of curious kids</span> already on the journey.
                  </p>
                </div>
              </div>

              {/* Right — perks grid */}
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                {[
                  {
                    icon: FaStar,
                    title: 'Exclusive Quizzes',
                    desc: 'Members-only challenges every week.',
                    tint: 'from-yellow-300 to-amber-400',
                  },
                  {
                    icon: FaTrophy,
                    title: 'Special Badges',
                    desc: 'Collect rare badges no one else can.',
                    tint: 'from-rose-300 to-pink-400',
                  },
                  {
                    icon: FaGift,
                    title: 'Gift Eligibility',
                    desc: 'Win surprises & seasonal goodies.',
                    tint: 'from-fuchsia-300 to-purple-400',
                  },
                  {
                    icon: FaBolt,
                    title: 'Priority Access',
                    desc: 'Early access to new stories & videos.',
                    tint: 'from-sky-300 to-cyan-400',
                  },
                ].map((perk, i) => (
                  <motion.div
                    key={perk.title}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="rounded-2xl bg-white/95 backdrop-blur p-4 md:p-5 shadow-soft hover:shadow-card-hover hover:-translate-y-0.5 transition-all"
                  >
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${perk.tint} flex items-center justify-center shadow-soft`}
                    >
                      <perk.icon className="text-white text-lg" aria-hidden="true" />
                    </div>
                    <h3 className="mt-3 font-bold text-gray-800 text-sm md:text-base">
                      {perk.title}
                    </h3>
                    <p className="text-xs md:text-sm text-gray-600 mt-1 leading-snug">
                      {perk.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Weekly Features */}
      <section className="section bg-white/60 backdrop-blur">
        <div className="container-app">
          <div className="text-center mb-12">
            <span className="eyebrow mb-4">This week</span>
            <h2 className="section-title mt-3">Explore Amazing Stories ✨</h2>
            <p className="text-gray-600 mt-2 max-w-xl mx-auto">
              A fresh drop of mythology every week — stories, slokas, and mantras.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="card-fun text-center group hover:-translate-y-1"
              >
                <div
                  className={`mx-auto mb-4 w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.tint}
                  flex items-center justify-center shadow-soft group-hover:scale-110 transition-transform`}
                >
                  <feature.icon className="text-white text-2xl" aria-hidden="true" />
                </div>
                <h3 className="font-display text-xl text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why MythoPlay */}
      <section className="section-tight">
        <div className="container-app">
          <div className="grid md:grid-cols-3 gap-4 md:gap-6">
            {valueProps.map((v) => (
              <div
                key={v.title}
                className="flex items-start gap-4 p-5 rounded-2xl bg-white/70 backdrop-blur border border-white/80 shadow-soft"
              >
                <div className="shrink-0 w-11 h-11 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
                  <v.icon className="text-xl" aria-hidden="true" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">{v.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{v.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Games */}
      <section className="section" aria-labelledby="games-heading">
        <div className="container-app">
          <div className="text-center mb-12">
            <span className="eyebrow mb-4">🎮 Play &amp; Learn</span>
            <h2 id="games-heading" className="section-title mt-3">Take a Break &amp; Play</h2>
            <p className="text-gray-600 mt-2 max-w-xl mx-auto">
              Kid-safe games that sneak in a little learning while you have fun.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
            {GAMES.map((game, index) => (
              <motion.div
                key={game.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={`/games/${game.slug}`}
                  className="group relative block h-full overflow-hidden rounded-3xl shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${game.tint} opacity-95`} aria-hidden="true" />
                  <div
                    className="absolute inset-0 opacity-20 mix-blend-overlay"
                    style={{
                      backgroundImage: 'radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)',
                      backgroundSize: '18px 18px',
                    }}
                    aria-hidden="true"
                  />
                  <div className="relative p-6 md:p-7 text-white">
                    <div className="flex items-center justify-between">
                      <span className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-3xl shadow-soft group-hover:scale-110 transition-transform" aria-hidden="true">
                        {game.emoji}
                      </span>
                      <span className="text-xs font-bold uppercase tracking-wider bg-white/20 backdrop-blur px-3 py-1 rounded-full">
                        Ages {game.ageRange}
                      </span>
                    </div>
                    <h3 className="font-display text-2xl mt-4 drop-shadow-sm">{game.title}</h3>
                    <p className="text-white/90 text-sm mt-1 font-semibold">{game.tagline}</p>
                    <span className="mt-5 inline-flex items-center gap-2 bg-white/95 text-gray-800 font-bold px-5 py-2.5 rounded-2xl shadow-soft group-hover:gap-3 transition-all">
                      <FaGamepad className="text-primary-500" aria-hidden="true" /> Play now
                      <FaArrowRight aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bhagavad Gita Weekly */}
      <GitaWeeklySection />

      {/* YouTube Videos Section */}
      <YouTubeVideoSection />

      {/* FAQ */}
      <section className="section bg-white/60 backdrop-blur" aria-labelledby="faq-heading">
        <div className="container-app max-w-3xl">
          <div className="text-center mb-10">
            <span className="eyebrow mb-4">Questions parents ask</span>
            <h2 id="faq-heading" className="section-title mt-3">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 mt-2">
              Everything you need to know about Natkhat Gannu before your child starts exploring.
            </p>
          </div>
          <div className="space-y-4">
            {FAQS.map((f) => (
              <details
                key={f.q}
                className="group rounded-2xl bg-white/80 backdrop-blur border border-white/80 shadow-soft p-5 open:shadow-card"
              >
                <summary className="cursor-pointer font-bold text-gray-800 flex items-center justify-between list-none">
                  <span>{f.q}</span>
                  <span
                    className="ml-3 text-primary-500 transition-transform group-open:rotate-45"
                    aria-hidden="true"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 text-gray-600 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
