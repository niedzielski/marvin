import { h, DangerouslySetInnerHTML } from "preact";
import { classOf, ClassProps, ChildrenProps } from "../preact-utils";
import "./styles/core/parsoid.css";
import "./styles/core/gallery.css";
import "./styles/extensions/cite.css";
import "./styles/extensions/math.css";
import "./styles/extensions/timeline.css";
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
