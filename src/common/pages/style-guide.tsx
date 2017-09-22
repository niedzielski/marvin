import { h } from "preact";
import App from "../components/app/app";
import Card from "../components/card/card";
import Page from "../components/page/page";
import Content from "../components/content/content";
import Separator from "../components/separator/separator";
import Header from "../components/header/header";

const lorem = `
  Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident quisquam
  facilis ab suscipit quos deleniti similique officia cumque, dignissimos iusto
  laudantium facere sint fuga vero iste vel asperiores beatae aliquam!`;

export function Component(): JSX.Element {
  return (
    <App>
      <h1 style={{ margin: "var(--double-space)", textAlign: "center" }}>
        Style guide
      </h1>

      <Card header={<h3>Header</h3>}>
        <Header />
      </Card>
      <Card header={<h3>Card</h3>}>
        <p>{lorem}</p>
      </Card>
      <Card header={<h3>Card w/ footer</h3>} footer="This, is a footer">
        <p>{lorem}</p>
      </Card>
      <Card header={<h3>Content typography</h3>}>
        <Content>
          <h1>Heading 1</h1>
          <p>{lorem}</p>
          <h2>Heading 2</h2>
          <p>{lorem}</p>
          <h3>Heading 3</h3>
          <p>{lorem}</p>
          <h4>Heading 4</h4>
          <p>{lorem}</p>
          <h5>Heading 5</h5>
          <p>{lorem}</p>
          <h6>Heading 6</h6>
          <p>{lorem}</p>
          <p>{lorem}</p>
          <blockquote>{lorem}</blockquote>
          <p>This is a separator:</p>
          <Separator />
          <p>The end</p>
        </Content>
      </Card>
      <Page title="Page template" subtitle="This is the subtitle of the page">
        <p>{lorem}</p>
      </Page>
      <Page title="Page template, no subtitle">
        <p>{lorem}</p>
      </Page>
      <Page title="Page template, w/ footer" footer="Hello, footer world">
        <p>{lorem}</p>
      </Page>
    </App>
  );
}
