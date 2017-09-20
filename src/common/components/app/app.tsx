import { h } from "preact";
import "./app.css";
import { ChildrenProps } from "../preact-utils";
import Link from "../link";

export default function App({ children }: ChildrenProps): JSX.Element {
  return (
    <div class="App">
      <h5>
        <Link href="/">Home</Link>
      </h5>
      <div>{children}</div>
    </div>
  );
}
