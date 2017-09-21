import { h } from "preact";
import { classOf, ClassProps, ChildrenProps } from "../preact-utils";
import "./content.css";

export default function Content({
  children,
  ...props
}: ChildrenProps & ClassProps): JSX.Element {
  return <div class={classOf("Content", props.class)}>{children}</div>;
}
