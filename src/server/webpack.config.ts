import * as CleanPlugin from "clean-webpack-plugin";
import * as nodeExternals from "webpack-node-externals";
import * as webpack from "webpack";
import {
  DEV_TOOL,
  EXTENSIONS,
  PATHS,
  STATS,
  definePlugin,
  typescriptLoader
} from "../common/webpack.config";
import { VERBOSE } from "../server/config";

const config: webpack.Configuration = {
  // Target a Node.js environment. The interpreter is expected to provide
  // require support and node_modules/ should be installed (see externals
  // below).
  target: "node",

  entry: "./src/server",
  stats: STATS,

  // All common code including dynamic imports are bundled into the output.
  // node_modules/, the asset manifest, and client-only files such as CSS are
  // not.
  output: { path: PATHS.server.output, filename: "index.js" },

  devtool: DEV_TOOL,

  resolve: { extensions: EXTENSIONS },

  // Exclude node_modules/. These are system dependent, numerous, and cannot be
  // practically bundled.
  externals: nodeExternals(),

  module: {
    rules: [{ test: /\.(css|svg)$/, loader: "ignore-loader" }, typescriptLoader]
  },

  plugins: [
    new CleanPlugin([PATHS.server.output], { verbose: VERBOSE }),
    definePlugin
  ]
};

export default config;
