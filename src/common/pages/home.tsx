import { h } from "preact";
import App from "../components/app/app";
import {
  about,
  home,
  wiki,
  summary,
  randomWiki,
  randomSummary,
  styleGuide
} from "../../common/routers/api";
import Page from "../components/page/page";
import { PageTitleID } from "../models/page/title";
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
    },
    {
      title: "Ice_cream_cake",
      revision: "24242119",
      text: "An arbitrary revision"
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
          <li>
            {/* todo: this should always appear as with the unvisited color or
                      be a button. */}
            <Link href={randomWiki.toPath()}>A random page</Link>
          </li>
          {testPages.map(
            ({
              title,
              revision,
              text
            }: {
              title: PageTitleID | string;
              revision?: string;
              text: string;
            }) => (
              <li>
                <Link href={wiki.toPath({ title, revision })}>{text}</Link>
              </li>
            )
          )}
        </ul>

        <h3>Summaries</h3>
        <ul>
          <li>
            {/* todo: this should always appear as with the unvisited color or
                      be a button. */}
            <Link href={randomSummary.toPath()}>A random summary</Link>
          </li>
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
