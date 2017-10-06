import { h, DangerouslySetInnerHTML } from "preact";
import { classOf, ClassProps, ChildrenProps } from "../preact-utils";
import "./styles/content.css";

interface Props extends ChildrenProps, ClassProps {
  dangerouslySetInnerHTML?: DangerouslySetInnerHTML;
}

export default function Content({
  children,
  dangerouslySetInnerHTML,
  ...props
}: Props): JSX.Element {
  return (
    <div
      class={classOf("Content", props.class)}
      dangerouslySetInnerHTML={dangerouslySetInnerHTML}
    >
      {children}
    </div>
  );
}
