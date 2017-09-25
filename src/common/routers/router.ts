import * as pathToRegExp from "path-to-regexp";
import { AnyComponent } from "../components/preact-utils";
import { AnyRoute, PageModule, RouteParams } from "../../common/routers/route";

export interface RouteResponse<Props> {
  chunkName: string;
  status: number;
  Component: AnyComponent<Props, any>;
  props: {
    path: string;
    url: string;
    params: { [name: string]: string };
  };
  initialProps: any;
}

export interface Router {
  route(url: string): Promise<RouteResponse<any>>;
}

interface ParsedRoute extends AnyRoute {
  paramNames: pathToRegExp.Key[];
  regularExpression: RegExp;
}

const parseRoutes = (routes: AnyRoute[]) =>
  routes.map((route: AnyRoute): ParsedRoute => {
    const paramNames: pathToRegExp.Key[] = [];
    return {
      ...route,
      paramNames,
      regularExpression: pathToRegExp(route.path, paramNames)
    };
  });

const newRouteParams = (
  paramNames: pathToRegExp.Key[],
  paramValues: string[]
): RouteParams =>
  paramNames.reduce(
    (params: RouteParams, paramName: pathToRegExp.Key, index: number) => {
      params[paramName.name] = paramValues[index];
      return params;
    },
    {}
  );

function requestInitialProps<Props>(
  module: PageModule<Props>,
  params: RouteParams
): Promise<Props | void> {
  return module.initialProps ? module.initialProps(params) : Promise.resolve();
}

const respond = (
  route: ParsedRoute,
  url: string,
  params: RouteParams
): Promise<RouteResponse<any>> =>
  route.importModule().then((module: PageModule<any>) =>
    requestInitialProps(module, params).then((props: any) => ({
      chunkName: route.chunkName,
      status: route.status,
      Component: module.Component,
      props: {
        ...props,
        path: route.path,
        url,
        params
      },
      initialProps: props
    }))
  );

export const newRouter = (routes: AnyRoute[]): Router => {
  const parsedRoutes: ParsedRoute[] = parseRoutes(routes);

  return {
    route(url) {
      for (const route of parsedRoutes) {
        const matches = route.regularExpression.exec(url);
        if (matches) {
          const [url, ...paramValues] = matches;
          const params = newRouteParams(route.paramNames, paramValues);
          return respond(route, url, params);
        }
      }
      return Promise.reject(new Error("No route matched."));
    }
  };
};
