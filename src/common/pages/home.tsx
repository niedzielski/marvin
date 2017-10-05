import { h } from "preact";
import App from "../components/app/app";
import {
  about,
  home,
  wiki,
  summary,
  styleGuide
} from "../../common/routers/api";
import Page from "../components/page/page";
import Link from "../components/link";

export const Component = (): JSX.Element => {
  const testSummaries = [
    {
      title: "Banana",
      text: "With landscape image"
    },
    {
      title: "Cucumber",
      text: "With portrait image"
    },
    {
      title: "Plaintext",
      text: "Without image"
    },
    {
      title: "Bill_&_Ted's_Excellent_Adventure",
      text: "With two paragraphs, unencoded path, and styled title"
    }
  ];
  const testPages = [
    {
      title: "Ice_cream",
      text: "A normal article"
    },
    {
      title: "Cake_(disambiguation)",
      text: "Disambiguation"
    },
    {
      title: "Cheese_cake",
      text: "Redirect"
    },
    {
      title: "Carrot cake",
      text: "Encoding redirect"
    }
  ];
  return (
    <App>
      <Page title="Welcome" subtitle="">
        <p>Hello world!</p>
        <p>Here are some test links for the time being:</p>
        <ul>
          <li>
            <Link href={home.toPath()}>Home</Link>
          </li>
          <li>
            <Link href={about.toPath()}>About</Link>
          </li>
          <li>
            <Link href={styleGuide.toPath()}>Style Guide</Link>
          </li>
          <li>
            <Link href="/404">404</Link>
          </li>
        </ul>

        <h3>Pages</h3>
        <ul>
          {testPages.map(({ title, text }) => (
            <li>
              <Link href={wiki.toPath({ title })}>{text}</Link>
            </li>
          ))}
        </ul>

        <h3>Summaries</h3>
        <ul>
          {testSummaries.map(({ title, text }) => (
            <li>
              <Link href={summary.toPath({ title })}>{text}</Link>
            </li>
          ))}
        </ul>
      </Page>
    </App>
  );
};
