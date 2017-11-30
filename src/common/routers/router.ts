import { AnyComponent } from "preact";
import {
  AnyRoute,
  PageComponent,
  PageModule,
  Route,
  RouteParams
} from "../../common/routers/route";
import HttpResponse from "../http/http-response";

import notFoundPage from "../pages/not-found";
import errorPage from "../pages/error";
import { RedirectError } from "../http/fetch";

export interface RouteResponse<Props> {
  chunkName?: string;
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
    ).then((response: HttpResponse<Props> | void) => ({
      chunkName: route.chunkName,
      status: (response && response.status) || module.default.status || 200,
      Component: module.default.Component as AnyComponent<Props, any>,
      props: (response && response.data) as Props
    }))
  );
}

function respondError(error: Error) {
  // Throw up RedirectErrors so that they can be handled by the server/client
  // appropriately
  if (error instanceof RedirectError) throw error;

  console.error(`${error.message}\n${error.stack}`); // eslint-disable-line no-console
  return {
    status: errorPage.status,
    Component: errorPage.Component,
    props: { error }
  };
}

export const newRouter = (routes: AnyRoute[]) => {
  return {
    route(path: string): Promise<RouteResponse<any>> {
      for (const route of routes) {
        const params = route.toParams(path);
        if (params) {
          return respond(route, params).catch(respondError);
        }
      }
      return Promise.resolve({
        status: notFoundPage.status,
        Component: notFoundPage.Component,
        props: { path }
      });
    }
  };
};
