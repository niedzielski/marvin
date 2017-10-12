import { h, DangerouslySetInnerHTML } from "preact";
import { classOf, ClassProps, ChildrenProps } from "../preact-utils";
import "./styles/templates/plainlist.css";
import "./styles/content.css";
import "./styles/images.css";
import "./styles/lists.css";
import "./styles/tables.css";

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
