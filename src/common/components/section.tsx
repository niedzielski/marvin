import { h } from "preact";
import { PageSection } from "../models/page/page";
import Content from "./content/content";
import DynamicHeader from "./dynamic-header/dynamic-header";

export interface Props {
  section: PageSection;
}

export default function Section({ section }: Props): JSX.Element {
  return (
    <section class="Section">
      <DynamicHeader class="Section-title" level={section.level}>
        <Content dangerouslySetInnerHTML={{ __html: section.titleHTML }} />
      </DynamicHeader>

      <Content dangerouslySetInnerHTML={{ __html: section.contentHTML }} />
    </section>
  );
}
