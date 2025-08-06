/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["images.unsplash.com", "via.placeholder.com"],
  },
  experimental: {
    optimizeCss: true,
  },
};

module.exports = nextConfig;
