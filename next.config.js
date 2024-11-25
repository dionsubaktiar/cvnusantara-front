const nextConfig = {
  rewrites: () => {
    return [
      {
        source: "/backend/:path*",
        destination: "https://cvnusantara.nusantaratranssentosa.co.id/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
