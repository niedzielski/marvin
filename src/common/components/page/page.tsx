import { h } from "preact";
import Paper, { Separator } from "../paper/paper";
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
        {children && <Separator />}
        <div class="Page-content">{children}</div>
      </Paper>
    </div>
  );
}
