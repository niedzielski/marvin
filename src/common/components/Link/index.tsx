import { Children } from "../../types/preact";
import { History } from "history";
import { h } from "preact";

export interface LinkParameters {
  href: string,
  children?: Children
}

/**
 * A single page app link that intercepts navigation (click) events and passes
 * control to History. All local hyperlinks should use a Link component.
 */
const Link = (
  properties: LinkParameters,
  context: { history?: History }
): JSX.Element => {
  const { children, ...anchorProperties } = properties;
  return (
    <a
      {...anchorProperties}
      onClick={event => {
        // todo: check that link is relative.
        if (context.history) {
          event.preventDefault();
          context.history.push(anchorProperties.href);
        }
      }}
    >
      {children}
    </a>
  );
};

export default Link;
