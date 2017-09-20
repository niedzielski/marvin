import { h } from "preact";
import { ChildrenProps } from "../preact-utils";
import "./paper.css";

export default function Paper({ children }: ChildrenProps): JSX.Element {
  return <div class="Paper">{children}</div>;
}
