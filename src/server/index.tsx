import * as express from "express";
import * as compression from "compression";
import { h } from "preact";
import { render as renderToString } from "preact-render-to-string";
import { RouteResponse, newRouter } from "../common/routers/router";
import { RedirectError } from "../common/http/fetch-with-redirect";
import { routes } from "../common/routers/api";
import { SERVER_PORT, SERVER_URL } from "../common/assets/config";
import HTMLPage from "./components/html-page";

const server = express();

server.use(compression());

server.use("/public", express.static("dist/public"));

const render = ({ chunkName, Component, props }: RouteResponse<any>) => {
  return (
    "<!doctype html>" + // eslint-disable-line prefer-template
    renderToString(
      <HTMLPage title="" chunkName={chunkName}>
        <Component {...props} />
      </HTMLPage>
    )
  );
};

const router = newRouter(routes);
server.get("*", (request, response) => {
  router
    .route(request.url)
    .then(routeResponse =>
      response.status(routeResponse.status).send(render(routeResponse))
    )
    .catch(error => {
      if (error instanceof RedirectError) {
        return response
          .status(error.status)
          .header("location", error.url)
          .send();
      } else {
        const message = `${error.message}\n${error.stack}`;
        console.error(message); // eslint-disable-line no-console
        return response.status(500).send(message);
      }
    });
});

server.listen(SERVER_PORT, () => {
  console.log(`Server started on ${SERVER_URL}/`); // eslint-disable-line no-console
});
