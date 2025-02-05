/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === "production";
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self';
  child-src shop.atysa.ir;
  style-src 'self' shop.atysa.ir;
  font-src 'self';  
`;
const securityHeaders = [
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "Permissions-Policy",
    value: " geolocation=(), browsing-topics=()",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "origin-when-cross-origin",
  },

  // {
  //   key: "Content-Security-Policy",
  //   value: ContentSecurityPolicy.replace(/\s{2,}/g, " ").trim(),
  // },
];
if (isProd) {
  securityHeaders.push(
    {
      key: "Strict-Transport-Security",
      value: "max-age=63072000; includeSubDomains; preload",
    },
    {
      key: "Access-Control-Allow-Origin",
      value: "shop.atysa.ir",
    }
  );
} else {
  // securityHeaders.push({
  //   key: "Access-Control-Allow-Origin",
  //   value: "localhost:3000",
  // });
}

const nextConfig = {
  crossOrigin: "anonymous",
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["localhost", "shop.atysa.ir", "cdn.atysa.ir", "atysa.ir"],
  },
  // distDir: "build",
  // experimental: { appDir: true },
  // assetPrefix: isProd ? "https://cdn.shop.atysa.ir" : undefined,
  async headers() {
    return [
      {
        // Apply these headers to all routes in your application.
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

module.exports = nextConfig;

/*  images: {
    domains: ["localhost"],
  },*/
