import * as path from "path";
import * as webpack from "webpack";
import { PRODUCTION, VERBOSE } from "../server/config";
const pkg = require("../../package.json");

export const PATHS = {
  server: { output: path.resolve("dist/server") },

  // Files used by the client and the server.
  public: { output: path.resolve("dist/public") }
};

// There is no builtin Stats "warnings" preset.
// https://github.com/webpack/webpack/blob/7fe0371/lib/Stats.js#L886
// https://github.com/webpack/webpack/blob/7fe0371/lib/Stats.js#L101-L131
export const STATS = {
  all: VERBOSE, // Default all outputs to verbosity.
  errors: true,
  errorDetails: true,
  warnings: true
};

export const DEV_TOOL = PRODUCTION
  ? "source-map"
  : "cheap-module-eval-source-map";

// Add TypeScript and TypeScript React as resolvable extensions.
export const EXTENSIONS = [".ts", ".tsx", ".js"];

// Embed values of process.env.NODE_ENV and other variables in the code.
// This allows to embed information in the source itself at build time, and it
// is used for example to have uglify remove code at minification time,
// getting rid of development only code (for exmaple, like preact/debug)
export const definePlugin = new webpack.DefinePlugin({
  "process.env": {
    NODE_ENV: JSON.stringify(PRODUCTION ? "production" : "development"),
    VERBOSE: JSON.stringify(VERBOSE ? 1 : 0),
    PORT: JSON.stringify(process.env.PORT ? process.env.PORT : 3000),
    WEBPACK_DEV_SERVER_PORT: JSON.stringify(
      process.env.WEBPACK_DEV_SERVER_PORT
        ? process.env.WEBPACK_DEV_SERVER_PORT
        : 8080
    )
  },
  VERSION: JSON.stringify(pkg.version)
});

export const typescriptLoader = {
  test: /\.tsx?$/,
  loader: "ts-loader",
  options: { logLevel: VERBOSE ? "info" : "warn" }
};
