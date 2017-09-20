import { h } from "preact";
import "./page-summary.css";
import { PageSummary as PageSummaryModel } from "../../models/page";

export interface Props {
  summary: PageSummaryModel;
}

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
      {summary.thumbnail &&
        summary.image && (
          /* todo: replace with Link. */
          <a href={summary.image.url}>
            <img
              key={summary.thumbnail.url}
              class="PageSummary-thumbnail"
              src={summary.thumbnail.url}
              width={summary.thumbnail.width}
              height={summary.thumbnail.height}
            />
          </a>
        )}
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
