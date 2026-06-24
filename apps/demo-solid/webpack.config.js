const webpack = require('@nativescript/webpack');
const { resolve } = require('path');
module.exports = (env) => {
  webpack.init(env);

  webpack.chainWebpack((config) => {
    config.devServer.hotOnly(true);
    config.devServer.hot(true);

    // shared demo code
    config.resolve.alias.set('@demo/shared', resolve(__dirname, '..', '..', 'tools', 'demo'));

    // Force a SINGLE @nativescript/core copy. The masonkit plugin is linked from outside the demo's
    // node_modules, so webpack resolves ITS `@nativescript/core` imports to the repo-root copy
    // (9.0.20) while the app uses the demo's copy (9.1.0-dev.0). Two cores = two `Color` classes,
    // two property objects, etc. — e.g. `value instanceof Color` fails for a cross-copy instance, so
    // `backgroundColor`/`color` are silently dropped and nothing paints. Pin every `@nativescript/core`
    // import (app + plugin) to the demo's single copy.
    config.resolve.alias.set('@nativescript/core', resolve(__dirname, 'node_modules', '@nativescript', 'core'));
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
