
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
        BASE_URL: "https://stuart.exchange/v1/",
        BASE_URL_MONITORING: "https://stuart.exchange/v2/"
    }
}

module.exports = withNextIntl(nextConfig);