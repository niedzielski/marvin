import * as pathToRegExp from "path-to-regexp";
import {
  AnyRoute,
  Endpoint,
  RouteParameters
} from "../../common/routers/route";
import { AnyComponent } from "preact";

export interface RouteResponse<Props, State> {
  chunkName: string;
  status: number;
  Component: AnyComponent<Props, State>;
  props: {
    path: string;
    url: string;
    parameters: { [name: string]: string };
  };
  initialProps: any;
}

export interface Router {
  route(url: string): Promise<RouteResponse<any, any>>;
}

interface ParsedRoute extends AnyRoute {
  parameterNames: pathToRegExp.Key[];
  regularExpression: RegExp;
}

const parseRoutes = (routes: AnyRoute[]) =>
  routes.map((route: AnyRoute): ParsedRoute => {
    const parameterNames: pathToRegExp.Key[] = [];
    return {
      ...route,
      parameterNames,
      regularExpression: pathToRegExp(route.path, parameterNames)
    };
  });

const newRouteParameters = (
  parameterNames: pathToRegExp.Key[],
  parameterValues: string[]
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

function requestInitialProps<Props>(
  endpoint: Endpoint<Props, any>,
  parameters: RouteParameters
): Promise<Props | {}> {
  if (endpoint.initialProps) {
    return endpoint.initialProps(parameters);
  }
  return Promise.resolve({});
}

const respond = (
  route: ParsedRoute,
  url: string,
  parameters: RouteParameters
): Promise<RouteResponse<any, any>> =>
  route.endpoint().then((endpoint: Endpoint<any, any>) =>
    requestInitialProps(endpoint, parameters).then((props: any) => ({
      chunkName: route.chunkName,
      status: route.status,
      Component: endpoint.Component,
      props: {
        ...props,
        path: route.path,
        url,
        parameters
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
          const [url, ...parameterValues] = matches;
          const parameters = newRouteParameters(
            route.parameterNames,
            parameterValues
          );
          return respond(route, url, parameters);
        }
      }
      return Promise.reject(new Error("No route matched."));
    }
  };
};
