import { h, Component as PreactComponent } from "preact";
import App from "../components/app/app";
import Link from "../components/link/link";
import Page from "../components/page/page";

// Fake a type declaration for the global variable VERSION that will be replaced
// by webpack#DefinePlugin when building. declare needs to be top level, but it
// is here for the VERSION usage in componentDidMount
declare const VERSION: string;

export interface State {
  subtitle: string;
}

export default {
  Component: class extends PreactComponent<undefined, State> {
    state = { subtitle: "" };

    componentDidMount() {
      // todo: figure out a common way across entry points for defining
      // configuration variables that common code could consume. The server has
      // server specific vars in config.ts and this here for example are used
      // only on DOM capable envs (componentDidMount will only fire on DOM
      // capable environments). It would be ideal if we had a common place with
      // configuration for common code. We need to also take into account
      // UglifyJS and the dead code elimination when using DefinePlugin, so that
      // we can leverage it to remove dev-only code in production builds
      // (see https://webpack.js.org/guides/tree-shaking/#minify-the-output)
      //
      // Fill the subtitle on the DOM-capable env with the information embedded
      // in the assets by webpack#DefinePlugin
      const env = process.env.NODE_ENV;
      const subtitle = `Version ${VERSION}; Env: ${env}`;
      this.setState({ subtitle });
    }

    render(_props: undefined, { subtitle }: State) {
      const links = [
        {
          href: "https://phabricator.wikimedia.org/tag/marvin/",
          text: "Task/Bug tracker"
        },
        {
          href: "https://phabricator.wikimedia.org/diffusion/MARV/",
          text: "Code repository (Wikimedia Phabricator)"
        },
        {
          href: "https://github.com/wikimedia/marvin",
          text: "Github mirror"
        },
        {
          href:
            "https://www.mediawiki.org/wiki/Reading/Web/Projects/NewMobileWebsite",
          text: "Documentation on MediaWiki.org"
        },
        {
          href: "https://github.com/wikimedia/marvin/tree/master/docs",
          text: "Technical documentation on Github.com"
        }
      ];
      return (
        <App>
          <Page title="About Marvin" subtitle={subtitle}>
            <p>
              Marvin is in early stages of development.<br /> For more
              information see the following links:
            </p>
            <ul>
              {links.map(({ href, text }) => (
                <li>
                  <Link href={href}>{text}</Link>
                </li>
              ))}
            </ul>
            <p>
              If you want to chat, you can find us in{" "}
              <code>#wikimedia-mobile</code> on freenode. Or you can send an
              email to the{" "}
              <a href="https://lists.wikimedia.org/mailman/listinfo/mobile-l">
                mobile-l mailing list
              </a>.
            </p>
          </Page>
        </App>
      );
    }
  },

  title: () => "About"
};
