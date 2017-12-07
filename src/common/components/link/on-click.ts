import { History } from "history";

function isModifiedEvent(event: MouseEvent): boolean {
  return event.metaKey || event.altKey || event.ctrlKey || event.shiftKey;
}

function isInternalLink(link: HTMLAnchorElement) {
  // N.B. link.href is used because browsers will transform relative paths to
  // the full path when set on the HTML anchor, which is what is used to check
  // against the current origin.
  return link.href && link.href.indexOf(window.location.origin) === 0;
}

// TODO: add unit tests
export function onClick(
  context: { history?: History },
  event: MouseEvent
): void {
  let link = null;
  if (event.currentTarget instanceof HTMLAnchorElement) {
    // When set on an anchor, currentTarget is the anchor
    link = event.currentTarget;
  } else if (event.target instanceof HTMLAnchorElement) {
    // When set on a parent to capture all clicks, currentTarget may be
    // something else. Use target if it is a link, as the handler triggers on
    // the bubbling phase
    link = event.target;
  } else if (
    event.target instanceof Node &&
    event.target.parentElement instanceof HTMLAnchorElement
  ) {
    // When set on a parent, the target may be an image. Check the parent to
    // see if it's an anchor.
    link = event.target.parentElement;
  }

  if (
    link &&
    isInternalLink(link) &&
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
    const path = link.href.replace(window.location.origin, "");
    context.history.push(path);
  }
}
