import "./index.css";
import { FunctionalComponent, h } from "preact";
import { api } from "../../routers/api";

const app: FunctionalComponent<any> = ({ children } = {}) => (
  <div class="App">
    <ul>
      <li>
        <a href={api.about.path}>About</a>
      </li>
      <li>
        <a href={"/404"}>404</a>
      </li>
    </ul>
    <div>{children}</div>
  </div>
);

export default app;
