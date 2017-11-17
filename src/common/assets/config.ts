export const PRODUCTION: boolean = process.env.NODE_ENV === "production";

/** Specifies the build and runtime verbosity. */
export const VERBOSE: boolean = Boolean(JSON.parse(process.env.VERBOSE || "0"));

export const SERVER_PORT: number = JSON.parse(process.env.PORT || "3000");

export const SERVER_URL: string = `http://localhost:${SERVER_PORT}`;

export const WEBPACK_DEV_SERVER_PORT: number = JSON.parse(
  process.env.WEBPACK_DEV_SERVER_PORT || "8080"
);

export const WEBPACK_DEV_SERVER_URL: string = `http://localhost:${WEBPACK_DEV_SERVER_PORT}`;
