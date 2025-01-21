/** @type {import('next').NextConfig} */

const hostnames = [
  'lh3.googleusercontent.com',
  'res.cloudinary.com',
  'aview-public.s3.amazonaws.com',
];

const nextConfig = {
  reactStrictMode: false,
  output: 'export',
  distDir: 'dist',
  images: {
    unoptimized: true,
    remotePatterns: hostnames.map((hostname) => ({
      protocol: 'https',
      hostname,
    })),
  },
};

module.exports = nextConfig;
