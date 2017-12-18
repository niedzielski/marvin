import { AnyComponent } from "preact";
import {
  PageComponent,
  PageModule,
  Route,
  RouteParams
} from "../../common/router/route";
import HttpResponse from "../http/http-response";
import notFoundPage, { Props as NotFoundProps } from "../pages/not-found";
import errorPage, { Props as ErrorProps } from "../pages/error";
import { ClientError, RedirectError, FetchError } from "../http/fetch";

export interface RouteResponse<Props> {
  // Chunk name, see {getChunk}, this variable should follow that structure.
  chunkName?: string;
  status: number;
  Component: AnyComponent<Props, any>;
  title?(props: Props): string | undefined;
  props: Props;
  path: string;
  query?: string;
}

interface RequestPageModule {
  (name: string): Promise<PageModule<Partial<RouteParams>, any>>;
}

function getInitialProps<Params extends Partial<RouteParams>, Props>(
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
function requestPageModuleChunk(
  page: string
): Promise<PageModule<Partial<RouteParams>, any>> {
  return import(/* webpackChunkName: "pages/[request]" */ `../pages/${page}`);
}

function respond<Params extends Partial<RouteParams>, Props>(
  requestPageModule: RequestPageModule,
  route: Route<Params>,
  params: Params,
  path: string,
  query?: string
): Promise<RouteResponse<Props>> {
  return requestPageModule(route.page).then(module =>
    getInitialProps(module.default, params).then(
      (response: HttpResponse<Props> | void) => ({
        chunkName: `pages/${route.page}`,
        status: (response && response.status) || module.default.status || 200,
        Component: module.default.Component as AnyComponent<Props, any>,
        props: (response && response.data) as Props,
        title: module.default.title,
        path,
        query
      })
    )
  );
}

// todo: can we load this page dynamically instead? Many users will never even
// see a 404.
function respondNotFound(
  path: string,
  query?: string
): Promise<RouteResponse<any>> {
  const props: NotFoundProps = { path, query };
  return Promise.resolve({
    status: notFoundPage.status,
    Component: notFoundPage.Component,
    props,
    title: notFoundPage.title,
    path,
    query
  });
}

function respondError(
  error: Error,
  path: string,
  query?: string
): Promise<RouteResponse<any>> {
  // Throw up RedirectErrors so that they can be handled by the server/client
  // appropriately
  if (error instanceof RedirectError) throw error;

  if (error instanceof ClientError && error.status === 404) {
    return respondNotFound(path, query);
  }

  console.error(`${error.message}\n${error.stack}`); // eslint-disable-line no-console

  const status = error instanceof FetchError ? error.status : errorPage.status;
  const props: ErrorProps = { error };
  return Promise.resolve({
    status,
    Component: errorPage.Component,
    props,
    title: errorPage.title,
    path,
    query
  });
}

export function newRouter(
  routes: Route<any>[],
  requestPageModule: RequestPageModule = requestPageModuleChunk
) {
  return {
    route(path: string, query?: string): Promise<RouteResponse<any>> {
      for (const route of routes) {
        const params = route.toParams(path, query);
        if (params) {
          return respond(requestPageModule, route, params, path, query).catch(
            error => respondError(error, path, query)
          );
        }
      }
      return respondNotFound(path, query);
    }
  };
}
