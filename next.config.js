/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  images: {
    domains: [
      'lh3.googleusercontent.com',
      'res.cloudinary.com',
      'aview-public.s3.amazonaws.com',
    ],
  },
};

module.exports = nextConfig;
