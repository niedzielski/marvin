import { h } from "preact";
import "./hatnotes.css";

export function Hatnotes({ htmlHatnotes }: { htmlHatnotes: string[] }) {
  return (
    <div class="Hatnotes">
      {htmlHatnotes.map(hatnote => (
        <div
          class="Hatnotes-hatnote"
          dangerouslySetInnerHTML={{ __html: hatnote }}
        />
      ))}
    </div>
  );
}
