import * as unfetch from "isomorphic-unfetch";

/** true if executing on server, false otherwise. */
const server = typeof window !== "object";

export class FetchError extends Error {
  status: number;
  url: string;

  constructor(status: number, url: string) {
    super();
    this.status = status;
    this.url = url;
  }
}

/** Server-only 3xx redirect status code and destination URL. */
export class RedirectError extends FetchError {}

/** 4xx status code errors. */
export class ClientError extends FetchError {}

/** 5xx status code errors. */
export class ServerError extends FetchError {}

/**
 * Isomorphic fetch with transparent throw-on-redirect behavior for requests
 * issued on the server. The redirect behavior may be overridden by setting
 * RequestInit.redirect to "follow". On the client, the implementation performs
 * identically to fetch. Capturing redirects allows the server to respond with
 * the appropriate status code and resolved URL.
 */
export function fetch(
  input: RequestInfo,
  init?: RequestInit
): Promise<Response> {
  // Setting the redirect mode to "error" doesn't appear to yield the status
  // code so "manual" is used instead.
  const redirect = server ? "manual" : undefined;
  return unfetch(input, { redirect, ...init }).then(response => {
    if (server && response.status >= 300 && response.status <= 399) {
      const url = response.headers.get("location");
      throw new RedirectError(response.status, url as string);
    }
    const url = typeof input === "string" ? input : input.url;
    if (response.status >= 400 && response.status <= 499) {
      throw new ClientError(response.status, url);
    }
    if (response.status >= 500) {
      throw new ServerError(response.status, url);
    }
    return response;
  });
}
