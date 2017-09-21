import { h } from "preact";
import { History } from "history";
import { ChildrenProps, classOf, ClassProps } from "./preact-utils";

export interface Props extends ClassProps, ChildrenProps {
  href: string;
}

function isModifiedEvent(event: MouseEvent): boolean {
  return event.metaKey || event.altKey || event.ctrlKey || event.shiftKey;
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
      onClick={event => {
        const origin = window.location.origin;
        const link = event.target as HTMLAnchorElement;
        // TODO: Move all the logic to check if an event should be captured to a
        // DOM utilities module and add unit tests
        if (
          // Check if the href is internal
          //
          // N.B. link.href is used because browsers will transform relative
          // paths to the full path when set on the HTML anchor, which is what
          // is used to check against the current origin
          link.href &&
          link.href.indexOf(origin) === 0 &&
          // onClick not prevented default
          !event.defaultPrevented &&
          // Ignore everything but left clicks
          event.button === 0 &&
          // Let browser handle "target=_blank" etc.
          !link.target &&
          // Ignore clicks with modifier keys
          !isModifiedEvent(event) &&
          // We have a context history
          context.history
        ) {
          event.preventDefault();
          context.history.push(href);
        }
      }}
    >
      {children}
    </a>
  );
}
