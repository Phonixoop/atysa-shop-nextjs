/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === "production";

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["localhost"],
  },
  distDir: "build",
  // experimental: { appDir: true },
  assetPrefix: isProd ? "https://cdn.shop.atysa.ir" : undefined,
  env: {
    BASE_URL: "http://localhost:3000",
    UPLOAD_DIR: "uploads",
  },
};

module.exports = nextConfig;

/*  images: {
    domains: ["localhost"],
  },*/
