import "./index.css";
import * as page from "page";
import { api } from "../common/routers/api";
import { render } from "preact";

const root = document.getElementById("root");
if (!root) {
  throw new Error('Missing element with "root" ID.');
}

Object.keys(api).forEach(name => {
  const route = api[name];
  page(route.path, () =>
    route
      .response()
      .then((module: any) =>
        render(module.default(), root, root.lastElementChild || undefined)
      )
  );
});
