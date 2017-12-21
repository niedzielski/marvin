import { h } from "preact";
import { asset } from "../../assets/manifest";

export default function Wordmark(): JSX.Element {
  return (
    <img
      class="Wordmark"
      src={asset("wordmark-en", "svg")}
      height="18"
      width="116"
    />
  );
}
