/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["avatars.githubusercontent.com"],
  },
  experimental: {
    serverActions: true,
  },
    webpack(config){
        config.externals.push({
            "utf-8-validate": "commonjs utf-8-validate",
            "bufferutil": "commonjs bufferutil"
        })
        return config
    }
};

module.exports = nextConfig;
