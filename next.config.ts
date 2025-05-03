import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  i18n: {
    locales: ["is", "en"],
    defaultLocale: "is",
    localeDetection: false,
  },
  env: {
    API_URL: process.env.API_URL,
  },

  async redirects() {
    return [
      {
        source: '/',
        destination: '/login',
        permanent: true,
      },
    ]
  }
};

export default nextConfig;
