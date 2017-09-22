import { h } from "preact";
import "./app.css";
import { ChildrenProps } from "../preact-utils";
import Header from "../header/header";

export default function App({ children }: ChildrenProps): JSX.Element {
  return (
    <div class="App">
      <Header />
      <div>{children}</div>
    </div>
  );
}
