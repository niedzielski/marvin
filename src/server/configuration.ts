export const production: boolean = process.env.NODE_ENV === "production";

export const verbose: boolean = Boolean(JSON.parse(process.env.VERBOSE || "0"));

export const serverPort: number = JSON.parse(process.env.PORT || "3000");

export const serverUrl: string = `http://localhost:${serverPort}`;

export const webpackDevServerPort: number = JSON.parse(
  process.env.WEBPACK_DEV_SERVER_PORT || "8080"
);

export const webpackDevServerUrl: string = `http://localhost:${webpackDevServerPort}`;
