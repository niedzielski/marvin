import { h } from "preact";
import Icon, { menu, search } from "../icon/icon";
import Wordmark from "../wordmark/wordmark";
import Link from "../link";
import { home } from "../../routers/api";

import "./header.css";

export default function Header(): JSX.Element {
  return (
    <div className="Header">
      <div className="Header-left">
        <Icon svg={menu} />
        <Link href={home.toPath()} class="Header-wordmark">
          <Wordmark />
        </Link>
      </div>
      {/* The center placeholder will be used later for desktop sizes */}
      <div className="Header-center" />
      <div className="Header-right">
        <Icon svg={search} />
      </div>
    </div>
  );
}
