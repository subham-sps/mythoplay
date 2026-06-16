/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 'standalone' is for self-hosting/Docker. Vercel serves from its own output,
  // and standalone there causes a 404: NOT_FOUND, so disable it on Vercel only.
  output: process.env.VERCEL ? undefined : 'standalone',
  images: {
    domains: ['lh3.googleusercontent.com', 'localhost'],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  },
}

module.exports = nextConfig

