/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  images: {
    domains: ['lh3.googleusercontent.com', 'i.ytimg.com', 'aview-public.s3.amazonaws.com'],
  },
};

module.exports = nextConfig;
