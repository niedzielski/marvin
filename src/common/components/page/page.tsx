import { h } from "preact";
import Paper from "../paper/paper";
import Separator from "../separator/separator";
import { ComponentChild, ChildrenProps } from "../preact-utils";
import "./page.css";

interface Props extends ChildrenProps {
  title: ComponentChild;
  subtitle: ComponentChild;
}

export default function Page({
  title,
  subtitle,
  children
}: Props): JSX.Element {
  return (
    <div class="Page">
      <Paper>
        <div class="Page-header">
          <div class="Page-title">{title}</div>
          <div class="Page-subtitle">{subtitle}</div>
        </div>
        {children && <Separator class="Page-content-separator" />}
        <div class="Page-content">{children}</div>
      </Paper>
    </div>
  );
}
