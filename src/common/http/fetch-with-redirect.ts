import * as unfetch from "isomorphic-unfetch";

/** true if executing on server, false otherwise. */
const server = typeof window !== "object";

/** Server-only redirect status code and destination URL. */
export class RedirectError extends Error {
  /** Status code in the domain of [300, 399]. */
  status: number;

  /** Destination URL. */
  url: string;

  constructor(status: number, url: string) {
    super();
    this.status = status;
    this.url = url;
  }
}

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
    return response;
  });
}
