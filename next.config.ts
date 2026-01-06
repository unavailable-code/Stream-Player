/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "fhm8uog8tx.ufs.sh"
    ]
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config, { isServer }) => {
    // Handle non-code files
    config.module.rules.push({
      test: /\.(md|LICENSE)$/,
      type: 'asset/resource',
      generator: {
        filename: 'static/[hash][ext]',
      },
    });

    // Externalize server-only packages on the client
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        buffer: false,
        'node:crypto': false,
        'node:buffer': false,
        'node:stream': false,
      };
      
      // Prevent livekit-server-sdk from being bundled on client
      config.externals = config.externals || [];
      config.externals.push('livekit-server-sdk');
    }
    
    return config;
  },
  transpilePackages: ['uploadthing', '@uploadthing/react', '@uploadthing/mime-types', '@uploadthing/shared'],
  
  // Mark server-only packages
  experimental: {
    serverComponentsExternalPackages: ['livekit-server-sdk'],
  },
};

module.exports = nextConfig;