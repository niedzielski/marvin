import "./index.css";
import { h, render } from "preact";
import App from "../common/components/app";

const root = document.getElementById("root");
if (!root) {
  throw new Error('Missing element with "root" ID.');
}

render(<App />, root, root.lastElementChild || undefined);
