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
export interface PageModule<Props = void> {
  /** A Preact view component. */
  Component: AnyComponent<Props, any>;

  /**
   * A function that returns a Promise for the dependencies needed to construct
   * the view component such as a remote resource.
   */
  initialProps?: (params: RouteParams) => Promise<Props>;
}

export interface RouteConfiguration<Props = void> {
  path: string;
  importModule: () => Promise<PageModule<Props>>;
  chunkName: string;
  status?: number;
}

export interface Route<Props = void, Params extends RouteParams = {}>
  extends RouteConfiguration<Props> {
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
}: RouteConfiguration<Props>): Route<Props, Params> => ({
  path,
  importModule,
  chunkName,
  status,
  url: pathToRegExp.compile(path)
});
