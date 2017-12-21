import { h } from "preact";
import "./app.css";
import { ChildrenProps } from "../preact-utils";
import Header from "../header/header";
import Paper from "../paper/paper";

export default function App({ children }: ChildrenProps): JSX.Element {
  return (
    <div class="App">
      <Header class="App-header" />
      <Paper>
        <div class="App-children">{children}</div>
      </Paper>
    </div>
  );
}
