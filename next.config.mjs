/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "images.unsplash.com",
        protocol: "https",
        port: "",
      },
      {
        hostname: "sensible-bee-680.convex.cloud",
        protocol: "https",
        port: "",
      },
    ],
  },
}

export default nextConfig
