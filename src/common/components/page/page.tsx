import { h } from "preact";
import Card from "../card/card";
import { ComponentChild, ChildrenProps } from "../preact-utils";
import "./page.css";

interface Props extends ChildrenProps {
  title: ComponentChild;
  subtitle?: ComponentChild;
  footer?: ComponentChild;
}

export default function Page({
  title,
  subtitle,
  footer,
  children
}: Props): JSX.Element {
  return (
    <Card
      class="Page"
      header={
        <div class="Page-header">
          <div class="Page-title">{title}</div>
          <div class="Page-subtitle">{subtitle}</div>
        </div>
      }
      footer={footer}
    >
      {children}
    </Card>
  );
}
