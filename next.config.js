/** @type {import('next').NextConfig} */

const nextConfig = ({
    dest: 'public',
    register: true,
    skipWaiting: true,
});

export default {
    output: 'export',
    reactStrictMode: false,
    experimental: {
        appDir: true,
    },
    images: {
        unoptimized: true,
    },
    pwa: {
        dest: 'public',
    },
    ...nextConfig, // Spread the properties of nextConfig
};