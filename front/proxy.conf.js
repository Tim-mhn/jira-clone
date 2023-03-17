const API_URL = 'http://localhost:8080'; // Dev API
const NOTIFICATIONS_API_URL = 'http://localhost:3000';

const PROXY_CONFIG = {
  '/figma-api': {
    target: API_URL,
    secure: false,
    pathRewrite: {
      '^/figma-api': '',
    },
    changeOrigin: true,
    logLevel: 'debug',
  },
  '/notifications-api': {
    target: NOTIFICATIONS_API_URL,
    secure: false,
    pathRewrite: {
      '^/notifications-api': '',
    },
    changeOrigin: true,
    logLevel: 'debug',
  },
};

module.exports = PROXY_CONFIG;
