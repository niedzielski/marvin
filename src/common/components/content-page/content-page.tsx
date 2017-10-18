import { h } from "preact";
import ContentSection from "../content-section/content-section";
import { PageSection } from "../../models/page/page";
import "./content-page.css";

export default function ContentPage({
  sections
}: {
  sections: PageSection[];
}): JSX.Element {
  return (
    <div class="Content-page">
      {sections.map(section => <ContentSection section={section} />)}
    </div>
  );
}
