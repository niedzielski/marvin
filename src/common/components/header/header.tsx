import { h } from "preact";
import Wordmark from "../wordmark/wordmark";
import Link from "../link/link";
import { ClassProps, classOf } from "../preact-utils";
import { home } from "../../router/routes";
import "./header.css";

export default function Header(props: ClassProps): JSX.Element {
  return (
    <div class={classOf("Header", props.class)}>
      <div class="Header-left">
        <Link href={home.toPath()} class="Header-wordmark">
          <Wordmark />
        </Link>
      </div>
      {/* The center placeholder will be used later for desktop sizes */}
      <div class="Header-center" />
      <div class="Header-right" />
    </div>
  );
}
