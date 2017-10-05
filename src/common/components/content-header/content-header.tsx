import { h } from "preact";
import Content from "../../components/content/content";

export default function ContentHeader({ titleHTML }: { titleHTML: string }) {
  return (
    <Content class="ContentHeader">
      <h1
        class="ContentHeader-title"
        dangerouslySetInnerHTML={{ __html: titleHTML }}
      />
    </Content>
  );
}
