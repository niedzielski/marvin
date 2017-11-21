import { History } from "history";
import { h } from "preact";
import { ChildrenProps, classOf, ClassProps } from "../preact-utils";
import { onClick } from "./on-click";

export interface Props extends ClassProps, ChildrenProps {
  href: string;
}

/**
 * A single page app link that intercepts navigation (click) events and passes
 * control to History. All hyperlinks should use a Link component.
 */
export default function Link(
  { href, children, ...props }: Props,
  context: { history?: History }
): JSX.Element {
  return (
    <a
      class={classOf("Link", props.class)}
      href={href}
      onClick={event => onClick(context, event)}
    >
      {children}
    </a>
  );
}
