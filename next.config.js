/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images:{
    domains: ["tailwindui.com", "garchi.s3.eu-west-2.amazonaws.com"]
  }
}

module.exports = nextConfig
