const webpack = require('@nativescript/webpack');
const { resolve } = require('path');
module.exports = (env) => {
  webpack.init(env);

  webpack.chainWebpack((config) => {
    config.devServer.hotOnly(true);
    config.devServer.hot(true);

    // shared demo code
    config.resolve.alias.set('@demo/shared', resolve(__dirname, '..', '..', 'tools', 'demo'));
  });

  // Must run after @nativescript-community/solid-js sets up the bundle-source rule
  // (that plugin registers at order 0 via applyExternalConfigs; we use order 10
  // so our tap runs after its options are in place).
  // The masonkit package is symlinked from packages/ (not node_modules/), so it
  // bypasses the babel-loader exclude and needs static-class-block support.
  webpack.chainWebpack(
    (config) => {
      config.module
        .rule('bundle-source')
        .use('babel-loader')
        .tap((options) => {
          options.plugins = options.plugins || [];
          if (!options.plugins.includes('@babel/plugin-transform-class-static-block')) {
            options.plugins.push('@babel/plugin-transform-class-static-block');
          }
          return options;
        });
    },
    { order: 10 },
  );

  return webpack.resolveConfig();
};
