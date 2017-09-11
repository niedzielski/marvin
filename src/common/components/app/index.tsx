import "./index.css";
import { FunctionalComponent, h } from "preact";
import Link from "../Link";

const app: FunctionalComponent<any> = ({ children } = {}) => (
  <div class="App">
    <ul>
      <li>
        <Link href="/">Home</Link>
      </li>
      <li>
        <Link href="/about">About</Link>
      </li>
      <li>
        <Link href="/404">404</Link>
      </li>
    </ul>
    <div>{children}</div>
  </div>
);

export default app;
