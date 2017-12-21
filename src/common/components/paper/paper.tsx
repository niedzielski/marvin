import { h } from "preact";
import { ChildrenProps, ClassProps, classOf } from "../preact-utils";
import "./paper.css";

export default function Paper({
  children,
  ...props
}: ChildrenProps & ClassProps): JSX.Element {
  return <div class={classOf("Paper", props.class)}>{children}</div>;
}
