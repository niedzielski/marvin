import * as pathToRegExp from "path-to-regexp";
import { AnyComponent } from "preact";

export interface RouteParameters {
  [name: string]: string;
}

export interface Endpoint<Props = void, State = void> {
  /** A Preact view component. */
  Component: AnyComponent<Props, State>;

  /**
   * A function that returns a Promise for the dependencies needed to construct
   * the view component such as a remote resource.
   */
  initialProps?: (parameters: RouteParameters) => Promise<Props>;
}

export interface RouteConfiguration<Props = void, State = void> {
  path: string;
  endpoint: () => Promise<Endpoint<Props, State>>;
  chunkName: string;
  status?: number;
}

export interface Route<Props = void, State = void, Parameters = void>
  extends RouteConfiguration<Props, State> {
  status: number;

  /** Generates a URL from parameters. */
  url: (properties?: Parameters) => string;
}

export type AnyRoute = Route<any, any, any>;

export const newRoute = <Props, State, Parameters>({
  path,
  endpoint,
  chunkName,
  status = 200
}: RouteConfiguration<Props, State>): Route<Props, State, Parameters> => ({
  path,
  endpoint,
  chunkName,
  status,
  url: pathToRegExp.compile(path)
});
