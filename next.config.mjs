import { withGTConfig } from "gt-next/config";
 /** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: true
  },
  images: {
    unoptimized: true
  }
};

export default withGTConfig(nextConfig, {});