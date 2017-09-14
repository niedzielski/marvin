import App from "../components/app/app";
import { h } from "preact";

export function Component(): JSX.Element {
  return (
    <App>
      <h1>Heading 1</h1>
      <h2>Heading 2</h2>
      <h3>Heading 3</h3>
      <h4>Heading 4</h4>
      <h5>Heading 5</h5>
      <h6>Heading 6</h6>
      <p>This is a paragraph with paragraph styles.</p>
      <blockquote>This is a blockquote with an important sentence.</blockquote>
    </App>
  );
}
