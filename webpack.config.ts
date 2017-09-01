/* eslint-env node */
import * as AssetsPlugin from "assets-webpack-plugin";
import * as ExtractTextPlugin from "extract-text-webpack-plugin";
import * as path from "path";
import * as webpack from "webpack";
import {
  PRODUCTION,
  VERBOSE,
  WEBPACK_DEV_SERVER_PORT
} from "./src/server/configuration";

const PATHS = {
  client: {
    output: path.resolve("./dist/public/")
  }
};

// There is no builtin Stats "warnings" preset.
// https://github.com/webpack/webpack/blob/7fe0371/lib/Stats.js#L886
// https://github.com/webpack/webpack/blob/7fe0371/lib/Stats.js#L101-L131
const STATS = {
  all: VERBOSE, // Default all outputs to verbosity.
  errors: true,
  errorDetails: true,
  warnings: true
};

const configuration: webpack.Configuration = {
  entry: {
    index: "./src/client/index"
  },

  stats: STATS,

  output: {
    path: PATHS.client.output,
    // Use chunkhash instead of hash to get per-file/chunk hashing instead of
    // global build hashing, to improve caching from browsers.
    // See: https://webpack.js.org/guides/caching/#output-filenames
    chunkFilename: PRODUCTION ? "[name].[chunkhash].js" : "[name].js",

    // Use constant filenames for developmental server.
    filename: PRODUCTION ? "[name].[chunkhash].js" : "[name].js"
  },

  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: [".ts", ".tsx", ".js"]
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        options: {
          logLevel: VERBOSE ? "info" : "warn"
        }
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: ["css-loader"]
        })
      }
    ]
  },

  devtool: PRODUCTION ? "source-map" : "cheap-module-eval-source-map",

  // For development builds, serve the packaged result over
  // http://localhost:8080/ and live reload the browser when the bundle is
  // rebuilt.
  devServer: PRODUCTION
    ? undefined
    : {
        // Forbid static files. All responses are in memory.
        contentBase: false,

        // Explicitly specify the default port so a failure to allocate will
        // cause Webpack to exit with a nonzero. Otherwise, a free port is
        // allocated  and requests fail to execute.
        port: WEBPACK_DEV_SERVER_PORT,

        // Log warnings and errors in the browser console.
        clientLogLevel: VERBOSE ? "info" : "warning",

        // Hide bundling start and finish messages.
        noInfo: !VERBOSE,

        // Show warnings and errors as an obtrusive opaque overlay in the
        // browser.
        overlay: { warnings: true, errors: true },

        stats: STATS
      }
};

configuration.plugins = [
  new ExtractTextPlugin({
    filename: PRODUCTION ? "[name].[contenthash].css" : "[name].css"
  })
];

if (PRODUCTION) {
  // Generate a json manifest with the entry points and assets names to use
  // in the server to pass to the HTML page template
  configuration.plugins.push(
    new AssetsPlugin({
      prettyPrint: true,
      filename: "assets-manifest.json",
      path: PATHS.client.output
    })
  );
}

export default configuration;
