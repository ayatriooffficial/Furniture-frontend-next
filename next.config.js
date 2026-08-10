const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  runtimeCaching: [
    {
      urlPattern: ({ pathname }) => pathname.startsWith("/_next/image"),
      handler: "NetworkFirst",
      options: {
        cacheName: "next-image-cache",
        expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 7 },
        networkTimeoutSeconds: 10, // avoid hanging forever if network is slow
      },
    },
    ...runtimeCaching,
  ],
});

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig = withPWA({
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "ayatrio-bucket-data-data-data.s3.ap-south-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "wowslider.com",
      },
      {
        protocol: "https",
        hostname: "your-s3-url.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "static.thenounproject.com",
      },
      {
        protocol: "https",
        hostname: "t4.ftcdn.net",
      },
      {
        protocol: "https",
        hostname: "www.google.com",
      },
      {
        protocol: "https",
        hostname: "ayatrio-bucket-data.s3.ap-south-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "ayatrio-bucket-data-data.s3.ap-south-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "ayatrio-bucket.s3.ap-south-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "i0.wp.com",
      },
      {
        protocol: "https",
        hostname: "cdn.britannica.com",
      },
      {
        protocol: "https",
        hostname: "example.com",
      },
      {
        protocol: "https",
        hostname: "i.pinimg.com",
      },
      {
        protocol: "https",
        hostname: "cdn1.vectorstock.com",
      },
      {
        protocol: "https",
        hostname: "www.iconpacks.net",
      },
      {
        protocol: "https",
        hostname: "encrypted-tbn0.gstatic.com",
      },
      {
        protocol: "https",
        hostname: "in.pinterest.com",
      },
      {
        protocol: "https",
        hostname: "ayatrio-images.s3.ap-south-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "localhost",
        port: "5173",
      },
      {
        protocol: "https",
        hostname: "www.ikea.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
      },
      {
        protocol: "https",
        hostname: "wellgroomedgentleman.com",
      },
      {
        protocol: "https",
        hostname: "scontent.cdninstagram.com",
      },
      {
        protocol: "https",
        hostname: "scontent-sin6-3.cdninstagram.com",
      },
      {
        protocol: "https",
        hostname: "unsplash.com",
      },
      {
        protocol: "https",
        hostname: "ecom-data3.s3.ap-south-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "source.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "scontent-del1-2.cdninstagram.com",
      },
      {
        protocol: "https",
        hostname: "scontent-del2-1.cdninstagram.com",
      },
      {
        protocol: "https",
        hostname: "scontent-del1-1.cdninstagram.com",
      },
      {
        protocol: "https",
        hostname: "bolt-gcdn.sc-cdn.net",
      },
      {
        protocol: "https",
        hostname: "scontent-sin6-4.cdninstagram.com",
      },
      {
        protocol: "https",
        hostname: "scontent-sin6-1.cdninstagram.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "www.ayatrio.com",
      },
      {
        protocol: "https",
        hostname: "ayatrio.com",
      },
    ],
  },
  experimental: {
    missingSuspenseWithCSRBailout: true,
    optimizePackageImports: ['lucide-react', 'react-icons', 'swiper', '@react-google-maps/api'],
  },
  // LCP Optimization: Image optimization for faster delivery
  compress: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  onDemandEntries: {
    maxInactiveAge: 25000,
    pagesBufferLength: 5,
  },
});

module.exports = withBundleAnalyzer(nextConfig);
