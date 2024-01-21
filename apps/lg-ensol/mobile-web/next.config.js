/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/main',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
