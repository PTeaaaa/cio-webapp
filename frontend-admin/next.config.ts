import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
  
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: 'localhost',
        port: '9000',
        pathname: '/cio-image-bucket/**',
      }
    ]
  }
};

export default nextConfig;