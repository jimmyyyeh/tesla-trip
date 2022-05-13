const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
});

module.exports = {
  devServer: {
    allowedHosts: 'all',
  },
  pwa: {
    iconPaths: {
      favicon32: 'img/icons/favicon.png',
      favicon16: 'img/icons/favicon.png',
      appleTouchIcon: 'img/icons/favicon.png',
      maskIcon: 'img/icons/favicon.png',
      msTileImage: 'img/icons/favicon.png',
    },
  },
};
