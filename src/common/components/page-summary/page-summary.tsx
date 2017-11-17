import { h } from "preact";
import "./page-summary.css";
import { PageSummary as PageSummaryModel } from "../../models/page/summary";
import Content from "../content/content";
import { Thumbnail } from "../thumbnail/thumbnail";

export interface Props {
  summary: PageSummaryModel;
}

export const PageSummary = ({ summary }: Props): JSX.Element => {
  const [lead, ...body] = summary.extractHTML;
  return (
    <div class="PageSummary">
      <Content
        class="PageSummary-extract-lead"
        dangerouslySetInnerHTML={{ __html: lead }}
      />
      {summary.thumbnail && (
        <Thumbnail
          class="PageSummary-thumbnail"
          image={summary.thumbnail}
          url={summary.image && summary.image.url}
        />
      )}
      <div
        class="PageSummary-extract-body"
        dangerouslySetInnerHTML={{ __html: body.join("") }}
      />
    </div>
  );
};
