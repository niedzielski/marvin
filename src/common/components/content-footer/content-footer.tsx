import { h } from "preact";
import LastModified from "../last-modified/last-modified";

export default function ContentFooter({
  lastModified
}: {
  lastModified: Date;
}) {
  return (
    <div class="ContentFooter">
      <LastModified class="ContentFooter-lastModified" date={lastModified} />
    </div>
  );
}
