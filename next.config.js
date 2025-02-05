const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "backend-cv.nusantaratranssentosa.co.id",
        pathname: "/storage/**",
      },
    ],
  },
};

module.exports = nextConfig;
