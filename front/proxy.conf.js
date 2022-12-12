const API_URL = 'http://localhost:8080'; // Dev API

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
};

module.exports = PROXY_CONFIG;
