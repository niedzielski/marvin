import * as pathToRegExp from "path-to-regexp";
import { AnyComponent } from "../components/preact-utils";

export interface RouteParams {
  [name: string]: string;
}

/**
 * A file that exposes a Preact UI component and optionally a function to
 * request properties needed to construct the component. Modules within the
 * pages/ subdirectory should implicitly implement this interface or typing will
 * fail in routers/api.
 */
export interface PageModule<Params extends RouteParams = {}, Props = void> {
  /** A Preact view component. */
  Component: AnyComponent<Props, any>;

  /**
   * A function that returns a Promise for the dependencies needed to construct
   * the view component such as a remote resource. This method will likely issue
   * a network request.
   */
  getInitialProps?: (params: Params) => Promise<Props>;
}

export interface RouteConfig<Params extends RouteParams = {}, Props = void> {
  path: string;
  importModule: () => Promise<PageModule<Params, Props>>;
  chunkName: string;
  status?: number;
}

export interface Route<Params extends RouteParams = {}, Props = void>
  extends RouteConfig<Params, Props> {
  status: number;

  /** Generates a URL from parameters. */
  url: (params?: Params) => string;
}

export type AnyRoute = Route<any, any>;

export const newRoute = <Props, Params extends RouteParams>({
  path,
  importModule,
  chunkName,
  status = 200
}: RouteConfig<Params, Props>): Route<Params, Props> => ({
  path,
  importModule,
  chunkName,
  status,
  url: pathToRegExp.compile(path)
});
