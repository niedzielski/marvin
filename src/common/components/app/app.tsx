import { h } from "preact";
import "./app.css";
import { about, index, wiki } from "../../../common/routers/api";
import { ChildrenProps } from "../preact-utils";
import Link from "../link";

export default function App({ children }: ChildrenProps): JSX.Element {
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
          <Link href={wiki.url({ title: "Bill_&_Ted's_Excellent_Adventure" })}>
            Bill & Ted's Excellent Adventure
          </Link>
        </li>
        <li>
          <Link href={wiki.url({ title: "Cucumber" })}>Cucumber</Link>
        </li>
        <li>
          <Link href={wiki.url({ title: "Ice_cream" })}>Ice cream</Link>
        </li>
        <li>
          <Link href="/404">404</Link>
        </li>
      </ul>
      <div>{children}</div>
    </div>
  );
}
