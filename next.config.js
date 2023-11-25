
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
      BASE_URL: "http://localhost:4444/",
      BASE_URL_MONITORING: "http://localhost:4445/"
    }
}

module.exports = withNextIntl(nextConfig);
