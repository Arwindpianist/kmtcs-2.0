/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'drive.google.com',
        port: '',
        pathname: '/uc/**',
      },
      {
        protocol: 'https',
        hostname: 'hrdcorp.gov.my',
        port: '',
        pathname: '/uc/**',}
    ],
  },
}

module.exports = nextConfig

module.exports = {
  images: {
    domains: ['drive.google.com', 'hrdcorp.gov.my'],
  },
};