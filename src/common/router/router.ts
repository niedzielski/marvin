import { AnyComponent } from "preact";
import {
  AnyRoute,
  PageComponent,
  PageModule,
  Route
} from "../../common/router/route";
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

interface RequestPageModule {
  (name: string): Promise<PageModule<any, any>>;
}

function getInitialProps<Params, Props>(
  module: PageComponent<Params, Props>,
  params: Params
): Promise<HttpResponse<Props> | void> {
  return module.getInitialProps
    ? module.getInitialProps(params)
    : Promise.resolve();
}

/**
 * Imports a page module from common/pages/* and names the chunk pages/* so that
 * the router can tell the server the name of the chunks to preload.
 * @param {string} page The page chunk basename with no extension. Corresponds
 *                      to Route.page.
 */
function requestPageModuleChunk(page: string): Promise<PageModule<any, any>> {
  return import(/* webpackChunkName: "pages/[request]" */ `../pages/${page}`);
}

function respond<Params, Props>(
  requestPageModule: RequestPageModule,
  route: Route<Params>,
  params: Params
): Promise<RouteResponse<Props>> {
  return requestPageModule(route.page).then(module =>
    getInitialProps(
      module.default,
      params
    ).then((response: HttpResponse<Props> | void) => ({
      // Chunk name, see {getChunk}, this variable should follow that structure
      chunkName: `pages/${route.page}`,
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

export const newRouter = (
  routes: AnyRoute[],
  requestPageModule: RequestPageModule = requestPageModuleChunk
) => {
  return {
    route(path: string): Promise<RouteResponse<any>> {
      for (const route of routes) {
        const params = route.toParams(path);
        if (params) {
          return respond(requestPageModule, route, params).catch(respondError);
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
