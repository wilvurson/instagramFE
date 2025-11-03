/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ["instagram-back-end-rxpd.onrender.com"],
  },
};

module.exports = nextConfig;