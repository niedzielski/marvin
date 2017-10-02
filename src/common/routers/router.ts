import { AnyComponent } from "../components/preact-utils";
import {
  AnyRoute,
  PageModule,
  Route,
  RouteParams
} from "../../common/routers/route";

export interface RouteResponse<Props> {
  chunkName: string;
  status: number;
  Component: AnyComponent<Props, any>;
  props: Props;
}

export interface Router {
  route(path: string): Promise<RouteResponse<any>>;
}

function getInitialProps<Params extends RouteParams | undefined, Props>(
  module: PageModule<Params, Props>,
  params: Params
): Promise<Props | void> {
  return module.getInitialProps
    ? module.getInitialProps(params)
    : Promise.resolve();
}

function respond<Params extends RouteParams | undefined, Props>(
  route: Route<Params, Props>,
  params: Params
): Promise<RouteResponse<Props>> {
  return route.importModule().then((module: PageModule<Params, Props>) =>
    getInitialProps(module, params).then((props: Props) => ({
      chunkName: route.chunkName,
      status: route.status,
      Component: module.Component as AnyComponent<Props, any>,
      props
    }))
  );
}

export const newRouter = (routes: AnyRoute[]): Router => {
  return {
    route(path) {
      for (const route of routes) {
        const params = route.toParams(path);
        if (params) {
          return respond(route, params);
        }
      }
      return Promise.reject(new Error("No route matched."));
    }
  };
};
