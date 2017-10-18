import { h } from "preact";
import { PageSection } from "../../models/page/page";
import Content from "../content/content";
import DynamicHeader from "../dynamic-header/dynamic-header";
import "./content-section.css";

export interface Props {
  section: PageSection;
}

export default function ContentSection({ section }: Props): JSX.Element {
  return (
    <section class="ContentSection" id={section.fragment}>
      {section.titleHTML && ( // Omit empty headers such as the lead.
        <DynamicHeader class="ContentSection-header" level={section.level + 1}>
          <Content dangerouslySetInnerHTML={{ __html: section.titleHTML }} />
        </DynamicHeader>
      )}

      <Content dangerouslySetInnerHTML={{ __html: section.contentHTML }} />
    </section>
  );
}
