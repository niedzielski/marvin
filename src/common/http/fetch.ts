import * as unfetch from "isomorphic-unfetch";
import { unmarshalPageTitleID } from "../marshallers/page-base/page-base-unmarshaller"; // eslint-disable-line max-len

/** true if executing on server, false otherwise. */
const server = typeof window !== "object";

export class FetchError extends Error {
  status: number;
  url: string;

  constructor(status: number, url: string, message?: string) {
    super(message);
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
export function request(
  input: RequestInfo,
  init?: RequestInit,
  fetch = unfetch
): Promise<Response> {
  // Setting the redirect mode to "error" doesn't appear to yield the status
  // code so "manual" is used instead.
  const redirect = server ? "manual" : undefined;
  return fetch(input, { redirect, ...init }).then(response => {
    const requestURL = typeof input === "string" ? input : input.url;
    if (server && response.status >= 300 && response.status <= 399) {
      const url = response.headers.get("location");
      if (url) throw new RedirectError(response.status, url);

      const message = "Location header missing in service response.";
      throw new ServerError(500, requestURL, message);
    }
    if (response.status >= 400 && response.status <= 499) {
      throw new ClientError(response.status, requestURL);
    }
    if (response.status >= 500) {
      throw new ServerError(response.status, requestURL);
    }
    return response;
  });
}

export function requestPage(
  input: RequestInfo,
  init?: RequestInit,
  fetch = unfetch
): Promise<Response> {
  return request(input, init, fetch).catch(error => {
    if (error instanceof RedirectError) {
      const requestedTitleID = unmarshalPageTitleID(
        typeof input === "string" ? input : input.url
      );
      const redirectedTitleID = unmarshalPageTitleID(error.url);
      if (requestedTitleID === redirectedTitleID) {
        // The URL is external but Marvin only supports Wikipedia. Follow it and
        // don't report redirect status.
        const destination =
          typeof input === "string" ? error.url : { ...input, url: error.url };
        return requestPage(destination, init);
      }
      // Else the URL may be internal or external. We need to redirect the
      // client to the new title in either case.
    }

    throw error;
  });
}
