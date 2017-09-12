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
        <Link href="/wiki/Banana">Banana</Link>
      </li>
      <li>
        <Link href="/wiki/Cucumber">Cucumber</Link>
      </li>
      <li>
        <Link href="/404">404</Link>
      </li>
    </ul>
    <div>{children}</div>
  </div>
);

export default app;
