import { History } from "history";
import { h } from "preact";
import { PageSection } from "../../models/page/page";
import Content from "../content/content";
import DynamicHeader from "../dynamic-header/dynamic-header";
import { onClick } from "../link/on-click";
import "./content-section.css";

export interface Props {
  section: PageSection;
}

export default function ContentSection(
  { section }: Props,
  context: { history?: History }
): JSX.Element {
  return (
    <section
      onClick={event => onClick(context, event)}
      class="ContentSection"
      id={section.fragment}
    >
      {section.titleHTML && ( // Omit empty headers such as the lead.
        <Content respectMargins>
          <DynamicHeader level={section.level + 1}>
            <span dangerouslySetInnerHTML={{ __html: section.titleHTML }} />
          </DynamicHeader>
        </Content>
      )}

      <Content dangerouslySetInnerHTML={{ __html: section.contentHTML }} />
    </section>
  );
}
