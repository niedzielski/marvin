import * as pathToRegExp from "path-to-regexp";
import { Endpoint, Route, RouteParameters } from "../../common/routers/route";
import { AnyComponent } from "preact";

export interface RouteResponse<Properties, State> {
  chunkName: string,
  status: number,
  component: AnyComponent<Properties, State>,
  properties: {
    path: string,
    url: string,
    parameters: { [name: string]: string }
  },
  initialProperties: any
}

export interface Router {
  route(url: string): Promise<RouteResponse<any, any>>
}

interface ParsedRoute extends Route<any, any> {
  parameterNames: pathToRegExp.Key[],
  regularExpression: RegExp
}

const parseRoutes = (routes: Route<any, any>[]) =>
  routes.map((route: Route<any, any>): ParsedRoute => {
    const parameterNames: pathToRegExp.Key[] = [];
    return {
      ...route,
      parameterNames,
      regularExpression: pathToRegExp(route.path, parameterNames)
    };
  });

const newRouteParameters = (
  parameterNames: pathToRegExp.Key[],
  parameterValues: RegExpExecArray
): RouteParameters =>
  parameterNames.reduce(
    (
      parameters: RouteParameters,
      parameterName: pathToRegExp.Key,
      index: number
    ) => {
      parameters[parameterName.name] = parameterValues[index];
      return parameters;
    },
    {}
  );

function requestInitialProperties<Properties>(
  endpoint: Endpoint<Properties, any>,
  parameters: RouteParameters
): Promise<Properties | {}> {
  if (endpoint.initialProperties) {
    return endpoint.initialProperties({ parameters });
  }
  return Promise.resolve({});
}

const respond = (
  route: ParsedRoute,
  url: string,
  parameters: RouteParameters
): Promise<RouteResponse<any, any>> =>
  route.endpoint().then((endpoint: Endpoint<any, any>) =>
    requestInitialProperties(endpoint, parameters).then((properties: any) => ({
      chunkName: route.chunkName,
      status: route.status,
      component: endpoint.component,
      properties: {
        ...properties,
        path: route.path,
        url,
        parameters
      },
      initialProperties: properties
    }))
  );

export const newRouter = (routes: Route<any, any>[]): Router => {
  const parsedRoutes: ParsedRoute[] = parseRoutes(routes);

  return {
    route(url) {
      for (const route of parsedRoutes) {
        const matches = route.regularExpression.exec(url);
        if (matches) {
          const parameters = newRouteParameters(route.parameterNames, matches);
          return respond(route, url, parameters);
        }
      }
      return Promise.reject(new Error("No route matched."));
    }
  };
};
