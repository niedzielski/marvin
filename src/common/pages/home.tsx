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
} from "../../common/router/routes";
import Page from "../components/page/page";
import { PageTitleID } from "../models/page/title";
import Link from "../components/link/link";

const testSummaries = [
  { title: "Banana", text: "With landscape image" },
  { title: "Cucumber", text: "With portrait image" },
  { title: "Plaintext", text: "Without image" },
  {
    title: "Bill_&_Ted's_Excellent_Adventure",
    text: "With two paragraphs, unencoded path, and styled title"
  },
  { title: "Carrot cake", text: "Encoding redirect (301)" },
  { title: "Cheese_cake", text: "Redirect page (302)" },
  { title: "Nonexistent_title", text: "Missing (404)" },
  { title: "Pizza", query: "foo=bar", text: "Query string" }
];

const testPages = [
  { title: "Ice_cream", text: "A normal article" },
  { title: "Cake_(disambiguation)", text: "Disambiguation" },
  { title: "Carrot cake", text: "Encoding redirect (301)" },
  { title: "Cheese_cake", text: "Redirect page (302)" },
  {
    title: "Ice_cream_cake",
    revision: "24242119",
    text: "An arbitrary revision"
  },
  {
    title: "File:Vanilla_Ice_Cream_Cone_at_Camp_Manitoulin.jpg",
    text: "Redirect (external) and File page"
  },
  { title: "Nonexistent_title", text: "Missing (404)" },
  { title: "Pizza", query: "foo=bar", text: "Query string" }
];

export default {
  Component(): JSX.Element {
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
                query,
                revision,
                text
              }: {
                title: PageTitleID | string;
                query?: string;
                revision?: string;
                text: string;
              }) => (
                <li>
                  <Link href={wiki.toPath({ title, revision }, query)}>
                    {text}
                  </Link>
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
            {testSummaries.map(
              ({
                title,
                query,
                text
              }: {
                title: PageTitleID | string;
                query?: string;
                text: string;
              }) => (
                <li>
                  <Link href={summary.toPath({ title }, query)}>{text}</Link>
                </li>
              )
            )}
          </ul>
        </Page>
      </App>
    );
  }
};
