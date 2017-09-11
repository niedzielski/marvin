import { AnyComponent } from "preact";

export interface RouteParameters {
  [name: string]: string
}

export interface Endpoint<Properties, State> {
  /** A Preact view component. */
  component: AnyComponent<Properties, State>,

  /**
   * A function that returns a Promise for the dependencies needed to construct
   * the view component such as a remote resource.
   */
  initialProperties?: (parameters: { parameters: RouteParameters }) => Promise<
    Properties
  >
}

export interface Route<Properties, State> {
  path: string,
  endpoint: () => Promise<Endpoint<Properties, State>>,
  chunkName: string,
  status: number
}
