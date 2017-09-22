import { h } from "preact";
import "./wordmark.css";
import wordmarkEn from "./wordmark-en.svg";

export default function Wordmark(): JSX.Element {
  return (
    <div
      className="Wordmark"
      dangerouslySetInnerHTML={{ __html: wordmarkEn }}
    />
  );
}
