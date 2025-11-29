
import type {NextConfig} from 'next';
import webpack from 'webpack';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https'
        ,
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'a.espncdn.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ahouseinthehills.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'www.kenyans.co.ke',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.sciencedaily.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.news-medical.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 's.yimg.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.sciencealert.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.androidauthority.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.geeky-gadgets.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
    webpack: (config, { isServer }) => {
          if (!isServer) {
                  config.resolve.fallback = {
                            net: false,
                            fs: false,
                            path: false,
                            crypto: false,
                            stream: false,
                            util: false,
                            tls: false,
                            http: false,
                            https: false,
                            zlib: false,
                            buffer: false,
                            assert: false,
                            os: false,
                            url: false,
                          };
                  config.plugins.push(
                            new webpack.IgnorePlugin({ resourceRegExp: /^(@grpc|genkit)/ })
                          );
                }
          return config;
    },
};

export default nextConfig;
