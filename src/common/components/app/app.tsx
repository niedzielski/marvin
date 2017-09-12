import "./app.css";
import { ComponentProps, h } from "preact";
import Link from "../link";

export default function App({ children }: ComponentProps<any>): JSX.Element {
  return (
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
}
