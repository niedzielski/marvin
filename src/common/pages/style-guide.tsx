import { h } from "preact";
import App from "../components/app/app";
import Paper from "../components/paper/paper";

export function Component(): JSX.Element {
  return (
    <App>
      <Paper>
        <h1>Heading 1</h1>
        <h2>Heading 2</h2>
        <h3>Heading 3</h3>
        <h4>Heading 4</h4>
        <h5>Heading 5</h5>
        <h6>Heading 6</h6>
      </Paper>
      <Paper>
        <p>This is a paragraph with paragraph styles.</p>
        <p>This is a second paragraph with paragraph styles.</p>
      </Paper>
      <Paper>
        <blockquote>
          This is a blockquote with an important sentence.
        </blockquote>
      </Paper>
    </App>
  );
}
