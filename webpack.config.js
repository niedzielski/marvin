const path = require("path");
const webpack = require("webpack");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const AssetsPlugin = require("assets-webpack-plugin");

const isProd = process.env.NODE_ENV === "production";
const paths = {
  client: {
    output: path.resolve("./dist/client/")
  }
};

module.exports = {
  target: "web",

  entry: {
    index: "./src/client/index.js"
  },

  output: {
    path: paths.client.output,
    // Use chunkhash instead of hash to get per-file/chunk hashing instead of
    // global build hashing, to improve caching from browsers.
    // See: https://webpack.js.org/guides/caching/#output-filenames
    chunkFilename: "[name].[chunkhash].js",
    filename: "[name].[chunkhash].js"
  },

  devtool: isProd ? "source-map" : "cheap-module-eval-source-map",

  plugins: [
    // Use path names instead of autogenerated ids for asset names
    new webpack.NamedModulesPlugin(),

    // Clean the build folder on restarts
    new CleanWebpackPlugin(paths.client.output, { verbose: true }),

    // Generate a json manifest with the entry points and assets names to use
    // in the server to pass to the HTML page template
    new AssetsPlugin({
      prettyPrint: true,
      filename: "assets-manifest.json",
      path: paths.client.output
    })
  ]
};