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
        pathname: '/uc/**',
      },
      {
        protocol: 'https',
        hostname: 'lfgcrrxytpadcvrvtjfm.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      }
    ],
  },
}

module.exports = nextConfig