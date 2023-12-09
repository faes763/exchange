
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
      BASE_URL: "https://dev.stuart.exchange/",
      BASE_URL_MONITORING: "https://swag.stuart.exchange/"
    }
}

module.exports = withNextIntl(nextConfig);
