/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['*.sharepoint.com', '*.onedrive.com'],
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'vue$': '@vue/runtime-dom',
    };
    config.module.rules.push({
      test: /\.vue$/,
      loader: 'vue-loader',
    });
    return config;
  },
};

module.exports = nextConfig;
