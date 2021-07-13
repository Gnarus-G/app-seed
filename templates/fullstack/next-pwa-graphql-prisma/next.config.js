const withPWA = require('next-pwa')

module.exports = withPWA({
    pwa: {
        dest: 'public',
		disable: process.env.NODE_ENV !== 'production'
    },
    env: {
        REST_API_URL: process.env.REST_API_URL
    }
});