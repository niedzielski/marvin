import { h } from "preact";
import { History } from "history";
import { ChildrenProps, classOf, ClassProps } from "./preact-utils";

export interface Props extends ClassProps, ChildrenProps {
  href: string;
}

/**
 * A single page app link that intercepts navigation (click) events and passes
 * control to History. All local hyperlinks should use a Link component.
 */
export default function Link(
  { href, children, ...props }: Props,
  context: { history?: History }
): JSX.Element {
  return (
    <a
      class={classOf("Link", props.class)}
      href={href}
      onClick={event => {
        // todo: check that link is internal (relative).
        if (context.history) {
          event.preventDefault();
          context.history.push(href);
        }
      }}
    >
      {children}
    </a>
  );
}
