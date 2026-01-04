/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    // ✅ Cara modern & recommended (Next 13+)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "i.imgur.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "drive.google.com",
      },
    ],

    // 🔥 Default optimasi image
    formats: ["image/avif", "image/webp"],

    // optional, tapi aman
    minimumCacheTTL: 60, // cache CDN 60 detik
  },
};

export default nextConfig;
