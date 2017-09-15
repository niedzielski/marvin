import "./app.css";
import { ComponentProps, h } from "preact";
import { about, index, wiki } from "../../../common/routers/api";
import Link from "../link";

export default function App({ children }: ComponentProps<any>): JSX.Element {
  return (
    <div class="App">
      <ul>
        <li>
          <Link href={index.url()}>Home</Link>
        </li>
        <li>
          <Link href={about.url()}>About</Link>
        </li>
        <li>
          <Link href={wiki.url({ title: "Banana" })}>Banana</Link>
        </li>
        <li>
          <Link href={wiki.url({ title: "Cucumber" })}>Cucumber</Link>
        </li>
        <li>
          <Link href="/404">404</Link>
        </li>
      </ul>
      <div>{children}</div>
    </div>
  );
}
