import * as pathToRegExp from "path-to-regexp";
import { AnyComponent } from "../components/preact-utils";
import { AnyRoute, PageModule, RouteParams } from "../../common/routers/route";

export interface RouteResponse<Props> {
  chunkName: string;
  status: number;
  Component: AnyComponent<Props, any>;
  props: Props;
}

export interface Router {
  route(url: string): Promise<RouteResponse<any>>;
}

interface ParsedRoute extends AnyRoute {
  paramNames: pathToRegExp.Key[];
  regularExpression: RegExp;
}

const parseRoute = (route: AnyRoute): ParsedRoute => {
  const paramNames: pathToRegExp.Key[] = [];
  return {
    ...route,
    paramNames,
    regularExpression: pathToRegExp(route.path, paramNames)
  };
};

// This method is tightly coupled with Route.path and the parameters supplied to
// PageModule.getInitialProps. Route.path must use names that match the typing
// for the parameters of PageModule.getInitialProps(). This method only
// associates the names of Route.path with the values found in the matched URL.
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

function getInitialProps<Params extends RouteParams, Props>(
  module: PageModule<Params, Props>,
  params: Params
): Promise<Props | void> {
  return module.getInitialProps
    ? module.getInitialProps(params)
    : Promise.resolve();
}

function respond<Props>(
  route: ParsedRoute,
  params: RouteParams
): Promise<RouteResponse<Props>> {
  return route.importModule().then((module: PageModule<RouteParams, Props>) =>
    getInitialProps(module, params).then((props: Props) => ({
      chunkName: route.chunkName,
      status: route.status,
      Component: module.Component,
      props
    }))
  );
}

export const newRouter = (routes: AnyRoute[]): Router => {
  const parsedRoutes: ParsedRoute[] = routes.map(route => parseRoute(route));

  return {
    route(url) {
      for (const route of parsedRoutes) {
        const matches = route.regularExpression.exec(url);
        if (matches) {
          const [, ...paramValues] = matches;
          const params = newRouteParams(route.paramNames, paramValues);
          return respond(route, params);
        }
      }
      return Promise.reject(new Error("No route matched."));
    }
  };
};
