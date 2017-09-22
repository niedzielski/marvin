import { h } from "preact";
import menu from "./icons/menu.svg";
import search from "./icons/search.svg";
import "./icon.css";

export interface Props {
  svg: string;
}

export { menu, search };

export default function Icon({ svg }: Props): JSX.Element {
  return <div class="Icon" dangerouslySetInnerHTML={{ __html: svg }} />;
}
