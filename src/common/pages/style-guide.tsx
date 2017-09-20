import { h } from "preact";
import App from "../components/app/app";
import Paper from "../components/paper/paper";
import Separator from "../components/separator/separator";
import { ChildrenProps } from "../components/preact-utils";

export function Component(): JSX.Element {
  return (
    <App>
      <Card title="Headings">
        <h1>Heading 1</h1>
        <h2>Heading 2</h2>
        <h3>Heading 3</h3>
        <h4>Heading 4</h4>
        <h5>Heading 5</h5>
        <h6>Heading 6</h6>
      </Card>
      <Card title="Text">
        <p>This is a paragraph with paragraph styles.</p>
        <p>This is a second paragraph with paragraph styles.</p>
        <Separator />
        <blockquote>
          This is a blockquote with an important sentence.
        </blockquote>
      </Card>
    </App>
  );
}

interface CardProps extends ChildrenProps {
  title: string;
}
function Card({ title, children }: CardProps): JSX.Element {
  /* Use inline styles as we don't want this in the general CSS since it is a
  dev only route */
  return (
    <Paper>
      <div
        style={{
          padding: "var(--space) var(--space) 0"
        }}
      >
        <h5>{title}</h5>
      </div>
      <Separator />
      <div
        style={{
          padding: "0 var(--space) var(--space)"
        }}
      >
        {children}
      </div>
    </Paper>
  );
}
