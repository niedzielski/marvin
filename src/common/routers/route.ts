import * as pathToRegExp from "path-to-regexp";
import { AnyComponent } from "../components/preact-utils";

/**
 * A map of path-to-regexp router path names to matches. The keys must match
 * those specified in RouteConfig.path. Passed to PageModule.requestProps() and
 * Route.url().
 */
export interface RouteParams {
  [name: string]: string;
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

  /** A regular expression for matching a URL path and capturing RouteParams. */
  pathRe: RegExp;

  /** Parameter names. These are used to generate a Params object. */
  paramNames: pathToRegExp.Key[];

  /** Generates a URL from RouteParams. */
  url(params: Params): string;
}

export interface NoPropsRoute extends Route<undefined, undefined> {
  url(params?: undefined): string;
}

export type AnyRoute = Route<any, any>;

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
  return {
    path,
    importModule,
    chunkName,
    status,
    pathRe: pathToRegExp(path, paramNames),
    paramNames,
    url: pathToRegExp.compile(path)
  } as Route<Params, Props>;
}
