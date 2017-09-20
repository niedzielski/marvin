import { h } from "preact";
import App from "../components/app/app";
import { about, home, wiki, styleGuide } from "../../common/routers/api";
import Page from "../components/page/page";
import Link from "../components/link";

export const Component = (): JSX.Element => (
  <App>
    <Page title="Welcome" subtitle="">
      <p>Hello world!</p>
      <p>Here are some test links for the time being:</p>
      <ul>
        <li>
          <Link href={home.url()}>Home</Link>
        </li>
        <li>
          <Link href={about.url()}>About</Link>
        </li>
        <li>
          <Link href={styleGuide.url()}>Style Guide</Link>
        </li>
        <li>
          <Link href={wiki.url({ title: "Banana" })}>Banana</Link>
        </li>
        <li>
          <Link href={wiki.url({ title: "Bill_&_Ted's_Excellent_Adventure" })}>
            Bill & Ted's Excellent Adventure
          </Link>
        </li>
        <li>
          <Link href={wiki.url({ title: "Cucumber" })}>Cucumber</Link>
        </li>
        <li>
          <Link href={wiki.url({ title: "Ice_cream" })}>Ice cream</Link>
        </li>
        <li>
          <Link href="/404">404</Link>
        </li>
      </ul>
    </Page>
  </App>
);
