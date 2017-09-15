import "./paper.css";
import { ComponentProps, h } from "preact";

export default function Paper({ children }: ComponentProps<any>): JSX.Element {
  return <div class="Paper">{children}</div>;
}
