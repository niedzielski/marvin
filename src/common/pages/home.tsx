import { h } from "preact";
import App from "../components/app/app";
import { about, home, summary, styleGuide } from "../../common/routers/api";
import Page from "../components/page/page";
import Link from "../components/link";

export const Component = (): JSX.Element => (
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
          <Link href={summary.toPath({ title: "Banana" })}>Banana</Link>
        </li>
        <li>
          <Link
            href={summary.toPath({ title: "Bill_&_Ted's_Excellent_Adventure" })}
          >
            Bill & Ted's Excellent Adventure
          </Link>
        </li>
        <li>
          <Link href={summary.toPath({ title: "Cucumber" })}>Cucumber</Link>
        </li>
        <li>
          <Link href={summary.toPath({ title: "Ice_cream" })}>Ice cream</Link>
        </li>
        <li>
          <Link href={summary.toPath({ title: "Plaintext" })}>
            Article without image
          </Link>
        </li>
        <li>
          <Link href="/404">404</Link>
        </li>
      </ul>
    </Page>
  </App>
);
