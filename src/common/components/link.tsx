import { ComponentProps, h } from "preact";
import { History } from "history";

export interface Props extends ComponentProps<any> {
  href: string;
}

/**
 * A single page app link that intercepts navigation (click) events and passes
 * control to History. All local hyperlinks should use a Link component.
 */
export default function Link(
  props: Props,
  context: { history?: History }
): JSX.Element {
  const { children, ...anchorProps } = props;
  return (
    <a
      {...anchorProps}
      onClick={event => {
        // todo: check that link is internal (relative).
        if (context.history) {
          event.preventDefault();
          context.history.push(anchorProps.href);
        }
      }}
    >
      {children}
    </a>
  );
}
