/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["localhost"],
  },
  distDir: "build",
};

module.exports = nextConfig;

/*  images: {
    domains: ["localhost"],
  },*/
