import { h } from "preact";
import "./wordmark.css";
import { asset } from "../../assets/manifest";

export default function Wordmark(): JSX.Element {
  return <img className="Wordmark" src={asset("wordmark-en", "svg")} />;
}
