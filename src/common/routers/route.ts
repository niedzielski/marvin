import * as pathToRegExp from "path-to-regexp";
import { AnyComponent } from "../components/preact-utils";

/**
 * A map of path-to-regexp router path names to matches. The keys must match
 * those specified in RouteConfig.path. Passed to PageModule.requestProps() and
 * Route.toPath().
 *
 * Note: only strings are ever returned as outputs of Route.toParams() and all
 *       inputs are converted to strings in Route.toPath().
 */
export interface RouteParams {
  [name: string]: string | undefined;
}

/**
 * A file that exposes a Preact UI component and optionally a function to
 * request properties needed to construct the component. Modules within the
 * pages/ subdirectory should implicitly implement this interface or typing will
 * fail in routers/api.
 */
export type PageModule<
  Params extends RouteParams | undefined = undefined,
  Props = undefined
> =
  | {
      /**
       * A function that returns a Promise for the dependencies needed to
       * construct the view component such as a remote resource. This method
       * will likely issue a network request.
       */
      getInitialProps(params: Params): Promise<Props>;

      /** A Preact view component. */
      Component: AnyComponent<Props, any>;
    }
  | { getInitialProps?: undefined; Component: AnyComponent<undefined, any> };

/** A plain configuration used to generate a Route. */
export interface RouteConfig<
  Params extends RouteParams | undefined = undefined,
  Props = undefined
> {
  /**
   * A path-to-regexp URL path. This is tightly coupled to RouteParams which
   * must define a subset of properties.
   */
  path: string;

  /** Requests a PageModule. */
  importModule(): Promise<PageModule<Params, Props>>;

  /** The chunk filename of the module. */
  chunkName: string;

  /** The request status if import and request for properties succeed. */
  status?: number;
}

export interface Route<
  Params extends RouteParams | undefined = undefined,
  Props = undefined
> extends RouteConfig<Params, Props> {
  status: number;

  /**
   * Generate a Params object from a given URL path or void if the path does not
   * match. An empty object is returned for matching NoPropsRoutes.
   */
  toParams(path: string): Params | void; // eslint-disable-line no-use-before-define

  /** Generates a URL path from Params. */
  toPath(params: Params): string;
}

export interface NoParamsRoute<Props = undefined>
  extends Route<undefined, Props> {
  toPath(params?: undefined): string;
}

export type AnyRoute = Route<any, any>;

/**
 * Decompose a URL path into a Params map for use by
 * PageModule.getInitialProps(). This method uses a path regular expression to
 * split URL path values into the named properties of a corresponding Params
 * object. There is no compile-time validation performed on the result, so
 * Route.path's encoding and Params must be in sync (tested in api.test.ts).
 * Note: paramNames is equivalent to manually writing an ordered array of names
 * matching Route.path's encoding. e.g., `/^\/wiki\/([^/]+)$/i` and `["title"]`.
 */
const toParams = ({
  pathRegExp,
  paramNames,
  path
}: {
  pathRegExp: RegExp;
  paramNames: pathToRegExp.Key[];
  path: string;
}) => {
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
};

export function newRoute<
  Params extends RouteParams | undefined = undefined,
  Props = undefined
>({
  path,
  importModule,
  chunkName,
  status = 200
}: RouteConfig<Params, Props>): Route<Params, Props> {
  const paramNames: pathToRegExp.Key[] = [];
  const pathRegExp = pathToRegExp(path, paramNames);
  return {
    path,
    importModule,
    chunkName,
    status,
    toParams: (path: string) => toParams({ pathRegExp, paramNames, path }),
    toPath: pathToRegExp.compile(path)
  } as Route<Params, Props>;
}
