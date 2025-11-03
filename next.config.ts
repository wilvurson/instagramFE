/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "njb2v7hsrapd07yd.public.blob.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "instagram-back-end-i361.onrender.com",
      },
    ],
  },
};

module.exports = nextConfig;