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
  chunkName?: string;
  status: number;
  Component: AnyComponent<Props, any>;
  title?(props: Props): string | undefined;
  props: Props;
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
      props: (response && response.data) as Props,
      title: module.default.title
    }))
  );
}

// todo: can we load this page dynamically instead? Many users will never even
// see a 404.
function respondNotFound(pathQuery: string): Promise<RouteResponse<any>> {
  const props: NotFoundProps = { pathQuery };
  return Promise.resolve({
    status: notFoundPage.status,
    Component: notFoundPage.Component,
    props,
    title: notFoundPage.title
  });
}

function respondError(
  pathQuery: string,
  error: Error
): Promise<RouteResponse<any>> {
  // Throw up RedirectErrors so that they can be handled by the server/client
  // appropriately
  if (error instanceof RedirectError) throw error;

  if (error instanceof ClientError && error.status === 404) {
    return respondNotFound(pathQuery);
  }

  console.error(`${error.message}\n${error.stack}`); // eslint-disable-line no-console

  const status = error instanceof FetchError ? error.status : errorPage.status;
  const props: ErrorProps = { error };
  return Promise.resolve({
    status,
    Component: errorPage.Component,
    props,
    title: errorPage.title
  });
}

export function newRouter(
  routes: Route<any>[],
  requestPageModule: RequestPageModule = requestPageModuleChunk
) {
  return {
    route(path: string, query?: string): Promise<RouteResponse<any>> {
      const pathQuery = `${path}${query || ""}`;
      for (const route of routes) {
        const params = route.toParams(path, query);
        if (params) {
          return respond(requestPageModule, route, params).catch(error =>
            respondError(pathQuery, error)
          );
        }
      }
      return respondNotFound(pathQuery);
    }
  };
}
