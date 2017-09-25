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
export interface PageModule<Props = void, State = void> {
  /** A Preact view component. */
  Component: AnyComponent<Props, State>;

  /**
   * A function that returns a Promise for the dependencies needed to construct
   * the view component such as a remote resource.
   */
  initialProps?: (params: RouteParams) => Promise<Props>;
}

export interface RouteConfiguration<Props = void, State = void> {
  path: string;
  importModule: () => Promise<PageModule<Props, State>>;
  chunkName: string;
  status?: number;
}

export interface Route<Props = void, State = void, Params = void>
  extends RouteConfiguration<Props, State> {
  status: number;

  /** Generates a URL from parameters. */
  url: (params?: Params) => string;
}

export type AnyRoute = Route<any, any, any>;

export const newRoute = <Props, State, Params>({
  path,
  importModule,
  chunkName,
  status = 200
}: RouteConfiguration<Props, State>): Route<Props, State, Params> => ({
  path,
  importModule,
  chunkName,
  status,
  url: pathToRegExp.compile(path)
});
