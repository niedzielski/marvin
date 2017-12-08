import * as pathToRegExp from "path-to-regexp";
import { AnyComponent } from "preact";
import HttpResponse from "../http/http-response";

/**
 * A map of path-to-regexp router path names to matches. The path keys must
 * match those specified in RouteConfig.path. This map is passed to
 * Route.toPath() with unencoded keys, constructed by Route.toParams() with
 * encoded keys, and passed to PageModule.getInitialProps() with encoded keys.
 * Query properties are always considered optional.
 *
 * Note: only strings are ever returned as outputs of Route.toParams() and all
 *       inputs are converted to strings in Route.toPath().
 */
export type PathParams = { [name: string]: string | undefined };
export type QueryParams = { [name: string]: string | undefined };
export type RouteParams = { path: PathParams; query: QueryParams };

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
   * Generate a Params object from a given URL path and query string or void if
   * the path does not match. An empty object is returned for matching
   * NoPropsRoutes.
   */
  toParams(pathQuery: string): Params | void; // eslint-disable-line no-use-before-define

  /** Generates a URL path from Params. */
  toPath(params: Params): string; // eslint-disable-line no-use-before-define
}

export interface NoParamsRoute extends Route<undefined> {
  toPath(params?: undefined): string; // eslint-disable-line no-use-before-define
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
  pathQuery: string
) {
  const matches = pathRegExp.exec(pathQuery);
  if (matches) {
    const [, ...paramValues] = matches;
    const params = {
      path: paramNames.length ? {} as PathParams : undefined,
      query: undefined
    };
    paramNames.forEach((param, index) => {
      if (params.path) params.path[param.name] = paramValues[index];
    });
    // todo: query parsing.
    return params;
  }
  return undefined;
}

function toPath(
  pathFunction: pathToRegExp.PathFunction,
  params?: Partial<RouteParams>
) {
  const path = pathFunction((params && params.path) || undefined);
  let query = "";
  if (params && params.query && Object.keys(params.query)) {
    // todo: real query string assembly.
    query = "?";
    Object.keys(params.query).forEach(name => {
      query += `${name}=${params.query && params.query[name]}&`;
    });
  }
  return `${path}${query}`;
}

export function newRoute<Params extends Partial<RouteParams> | undefined>({
  path,
  page
}: RouteConfig): Route<Params> {
  const paramNames: pathToRegExp.Key[] = [];
  const pathRegExp = pathToRegExp(
    path,
    paramNames,
    // Allow query parameters.
    { endsWith: "?" }
  );
  const pathFunction = pathToRegExp.compile(path);
  return {
    path,
    page,
    toParams: pathQuery => toParams(pathRegExp, paramNames, pathQuery),
    toPath: params => toPath(pathFunction, params)
  } as Route<Params>;
}
