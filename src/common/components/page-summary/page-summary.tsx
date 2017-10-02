import { h } from "preact";
import "./page-summary.css";
import { PageSummary as PageSummaryModel } from "../../models/page/summary";
import Content from "../content/content";

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
      <Thumbnail summary={summary} />
      <div
        class="PageSummary-extract-body"
        dangerouslySetInnerHTML={{ __html: body.join("") }}
      />
    </div>
  );
};

const Thumbnail = ({ summary }: Props) => {
  if (!summary.thumbnail || !summary.image) {
    return null;
  }

  const landscape = summary.image.landscape;
  const imageOrientationClass = `PageSummary-thumbnail-image-${landscape
    ? "landscape"
    : "portrait"}`;
  return (
    // todo: replace anchor with Link.
    <span class="PageSummary-thumbnail">
      <a href={summary.image.url}>
        <img
          key={summary.thumbnail.url}
          class={`PageSummary-thumbnail-image ${imageOrientationClass}`}
          src={summary.thumbnail.url}
          width={summary.thumbnail.width}
          height={summary.thumbnail.height}
        />
      </a>
    </span>
  );
};
