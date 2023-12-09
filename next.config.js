
const withNextIntl = require('next-intl/plugin')(
    // This is the default (also the `src` folder is supported out of the box)
    './src/i18n.ts'
);
/** @type {import('next').NextConfig} */

const nextConfig = {
    experimental: {
        optimizePackageImports: ['@headlessui/react'],
    },
    env: {
      BASE_URL: "https://stuartexchange.online:3000",
      BASE_URL_MONITORING: "https://stuartexchange.online:3050"
    }
}

module.exports = withNextIntl(nextConfig);
