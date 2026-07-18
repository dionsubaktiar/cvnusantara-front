const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "backend.rinsgloballogistic.com",
        pathname: "/storage/**",
      },
    ],
  },
};

module.exports = nextConfig;
