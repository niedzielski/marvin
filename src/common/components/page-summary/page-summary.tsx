import { h } from "preact";
import "./page-summary.css";
import { PageSummary as PageSummaryModel } from "../../models/page";

export interface Props {
  summary: PageSummaryModel;
}

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

export const PageSummary = ({ summary }: Props): JSX.Element => (
  <div class="PageSummary">
    <div class="PageSummary-header">
      <h2
        class="PageSummary-title"
        dangerouslySetInnerHTML={{ __html: summary.titleHTML }}
      />
      {summary.descriptionText && (
        <p class="PageSummary-description">{summary.descriptionText}</p>
      )}
    </div>
    <div class="PageSummary-body">
      <Thumbnail summary={summary} />
      {summary.extractHTML && (
        <p
          class="PageSummary-extract"
          dangerouslySetInnerHTML={{ __html: summary.extractHTML }}
        />
      )}
    </div>
    <div class="PageSummary-footer">
      <p class="PageSummary-lastModified">
        {summary.lastModified.toLocaleString()}
      </p>
    </div>
  </div>
);
