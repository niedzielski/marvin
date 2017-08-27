/* eslint-env node */
import * as AssetsPlugin from "assets-webpack-plugin";
import * as ExtractTextPlugin from "extract-text-webpack-plugin";
import * as path from "path";
import * as webpack from "webpack";

const isProd = process.env.NODE_ENV === "production";
const isVerbose = Boolean(JSON.parse(process.env.VERBOSE || "false"));

const paths = {
  client: {
    output: path.resolve("./dist/public/")
  }
};

// There is no builtin Stats "warnings" preset.
// https://github.com/webpack/webpack/blob/7fe0371/lib/Stats.js#L886
// https://github.com/webpack/webpack/blob/7fe0371/lib/Stats.js#L101-L131
const stats = {
  all: isVerbose, // Default all outputs to verbosity.
  errors: true,
  errorDetails: true,
  warnings: true
};

const configuration: webpack.Configuration = {
  entry: {
    index: "./src/client/index"
  },

  stats,

  output: {
    path: paths.client.output,
    // Use chunkhash instead of hash to get per-file/chunk hashing instead of
    // global build hashing, to improve caching from browsers.
    // See: https://webpack.js.org/guides/caching/#output-filenames
    chunkFilename: isProd ? "[name].[chunkhash].js" : "[name].js",

    // Use constant filenames for developmental server.
    filename: isProd ? "[name].[chunkhash].js" : "[name].js"
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
          logLevel: isVerbose ? "info" : "warn"
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

  devtool: isProd ? "source-map" : "cheap-module-eval-source-map",

  // For development builds, serve the packaged result over
  // http://localhost:8080/ and live reload the browser when the bundle is
  // rebuilt.
  devServer: isProd
    ? undefined
    : {
        // Forbid static files. All responses are in memory.
        contentBase: false,

        // Log warnings and errors in the browser console.
        clientLogLevel: isVerbose ? "info" : "warning",

        // Hide bundling start and finish messages.
        noInfo: !isVerbose,

        // Show warnings and errors as an obtrusive opaque overlay in the
        // browser.
        overlay: { warnings: true, errors: true },

        stats
      }
};

configuration.plugins = [
  new ExtractTextPlugin({
    filename: isProd ? "[name].[contenthash].css" : "[name].css"
  })
];

if (isProd) {
  // Generate a json manifest with the entry points and assets names to use
  // in the server to pass to the HTML page template
  configuration.plugins.push(
    new AssetsPlugin({
      prettyPrint: true,
      filename: "assets-manifest.json",
      path: paths.client.output
    })
  );
}

export default configuration;
