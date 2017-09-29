/**
 * When enabled (the default), requests for [redirect pages] return an HTTP
 * 302 with a redirect target in the Location header and content in the body.
 * When disabled, an HTTP 200 response is returned instead.
 *
 * Beware that redirected pre-flighted cross-origin requests (such as those
 * sending custom request headers like Api-User-Agent) will fail in most
 * current browsers due to a [spec bug].
 *
 * [redirect pages]: https://www.mediawiki.org/wiki/Help:Redirects
 * [spec bug]: https://github.com/whatwg/fetch/issues/204
 */
export type PageRedirect = boolean;
