import { h } from "preact";
import "./separator.css";
import { ClassProps, classOf } from "../preact-utils";

export default function Separator(props: ClassProps): JSX.Element {
  return <div class={classOf("Separator", props.class)} />;
}
