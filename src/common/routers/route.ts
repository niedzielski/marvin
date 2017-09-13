import { AnyComponent } from "preact";

export interface RouteParameters {
  [name: string]: string;
}

export interface Endpoint<Props, State> {
  /** A Preact view component. */
  Component: AnyComponent<Props, State>;

  /**
   * A function that returns a Promise for the dependencies needed to construct
   * the view component such as a remote resource.
   */
  initialProps?: (parameters: RouteParameters) => Promise<Props>;
}

export interface Route<Props, State> {
  path: string;
  endpoint: () => Promise<Endpoint<Props, State>>;
  chunkName: string;
  status: number;
}
