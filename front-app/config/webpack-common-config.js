// webpack-common-config.js

// This file will contain configuration data that
// is shared between development and production builds.

const path = require("path");

const paths = require("./paths");

module.exports = {
  resolve: {
    // File extensions. Add others and needed (e.g. scss, json)
    extensions: [".js", ".jsx"],
    modules: ["node_modules"],
    // Aliases help with shortening relative paths
    // 'Components/button' === '../../../components/button'
    alias: {
      Components: path.resolve(paths.appSrc, "components"),
      Constants: path.resolve(paths.appSrc, "constants"),
      Contexts: path.resolve(paths.appSrc, "contexts"),
      ContextProviders: path.resolve(paths.appSrc, "contextProviders"),
      Services: path.resolve(paths.appSrc, "services"),
      Utils: path.resolve(paths.appSrc, "utils")
    }
  },
  module: {
    rules: [
      {
        test: /\.(png|svg|jpg)$/,
        use: ["file-loader"]
      }
    ]
  }
};
