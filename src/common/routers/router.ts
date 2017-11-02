import { AnyComponent } from "../components/preact-utils";
import {
  AnyRoute,
  PageComponent,
  PageModule,
  Route,
  RouteParams
} from "../../common/routers/route";
import HttpResponse from "../http/http-response";

export interface RouteResponse<Props> {
  chunkName: string;
  status: number;
  Component: AnyComponent<Props, any>;
  props: Props;
}

function getInitialProps<Params extends RouteParams | undefined, Props>(
  module: PageComponent<Params, Props>,
  params: Params
): Promise<HttpResponse<Props> | void> {
  return module.getInitialProps
    ? module.getInitialProps(params)
    : Promise.resolve();
}

function respond<Params extends RouteParams | undefined, Props>(
  route: Route<Params, Props>,
  params: Params
): Promise<RouteResponse<Props>> {
  return route.importModule().then((module: PageModule<Params, Props>) =>
    getInitialProps(
      module.default,
      params
    ).then((response: HttpResponse<Props>) => ({
      chunkName: route.chunkName,
      status: (response && response.status) || module.default.status || 200,
      Component: module.default.Component as AnyComponent<Props, any>,
      props: response && response.data
    }))
  );
}

export const newRouter = (routes: AnyRoute[]) => {
  return {
    route(path: string): Promise<RouteResponse<any>> {
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
