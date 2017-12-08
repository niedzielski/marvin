import * as pathToRegExp from "path-to-regexp";
import { AnyComponent } from "preact";
import HttpResponse from "../http/http-response";

/**
 * A map of path-to-regexp router path names to matches. The keys must match
 * those specified in RouteConfig.path. This map is passed to Route.toPath()
 * with unencoded keys, constructed by Route.toParams() with encoded keys, and
 * passed to PageModule.getInitialProps() with encoded keys.
 *
 * Note: only strings are ever returned as outputs of Route.toParams() and all
 *       inputs are converted to strings in Route.toPath().
 */
export type RouteParams = { [name: string]: string | undefined };

/**
 * A file that exposes a Preact UI component and optionally a function to
 * request properties needed to construct the component. Modules within the
 * pages/ subdirectory should implicitly implement this interface or typing will
 * fail in router/routes.
 */
export type PageComponent<Params, Props> =
  | {
      /**
       * A function that returns a Promise for the dependencies needed to
       * construct the view component such as a remote resource. This method
       * will likely issue a network request.
       */
      getInitialProps(params: Params): Promise<HttpResponse<Props>>;

      status?: undefined;

      /** A Preact view component. */
      Component: Partial<AnyComponent<Props, any>>;

      /** The document title shown in the browser window's title bar or tab. */
      title?: (props: Props) => string | undefined;
    }
  | {
      getInitialProps?: undefined;

      /**
       * The request status if Route.importModule() is successful. Defaults to
       * 200.
       */
      status?: number;

      Component: Partial<AnyComponent<undefined, any>>;

      title?: () => string | undefined;
    };

export interface PageModule<Params, Props> {
  default: PageComponent<Params, Props>;
}

/** A plain configuration used to generate a Route. */
export interface RouteConfig {
  /**
   * A path-to-regexp URL path. This is tightly coupled to Params which must
   * define a subset of properties.
   */
  path: string;

  /** The base page to load inside pages/ */
  page: string;
}

export interface Route<Params> extends RouteConfig {
  /**
   * Generate a Params object from a given URL path or void if the path does not
   * match. An empty object is returned for matching NoPropsRoutes.
   */
  toParams(path: string): Params | void; // eslint-disable-line no-use-before-define

  /** Generates a URL path from Params. */
  toPath(params: Params, query?: string): string;
}

export interface NoParamsRoute extends Route<undefined> {
  toPath(params?: undefined, query?: string): string;
}

/**
 * Decompose a URL path into a Params map for use by
 * PageModule.getInitialProps(). This method uses a path regular expression to
 * split URL path values into the named properties of a corresponding Params
 * object. There is no compile-time validation performed on the result, so
 * Route.path's encoding and Params must be in sync (tested in routes.test.ts).
 * Note: paramNames is equivalent to manually writing an ordered array of names
 * matching Route.path's encoding. e.g., `/^\/wiki\/([^/]+)$/i` and `["title"]`.
 */
function toParams(
  pathRegExp: RegExp,
  paramNames: pathToRegExp.Key[],
  path: string
) {
  const matches = pathRegExp.exec(path);
  if (matches) {
    const [, ...paramValues] = matches;
    const params: RouteParams = {};
    paramNames.forEach((param, index) => {
      params[param.name] = paramValues[index];
    });
    return params;
  }
  return undefined;
}

export function newRoute<Params>({ path, page }: RouteConfig): Route<Params> {
  const paramNames: pathToRegExp.Key[] = [];
  const pathRegExp = pathToRegExp(
    path,
    paramNames,
    // Allow query parameters.
    { endsWith: "?" }
  );
  const toPath = pathToRegExp.compile(path);
  return {
    path,
    page,
    toParams: path => toParams(pathRegExp, paramNames, path),
    toPath: (path, query) => `${toPath(path)}${query ? `?${query}` : ""}`
  } as Route<Params>;
}
