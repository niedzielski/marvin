import { h } from "preact";
import Separator from "../separator/separator";
import {
  ComponentChild,
  ChildrenProps,
  ClassProps,
  classOf
} from "../preact-utils";
import "./card.css";

interface Props extends ChildrenProps, ClassProps {
  header: ComponentChild;
  footer?: ComponentChild;
}

export default function Card({
  header,
  footer,
  children,
  ...props
}: Props): JSX.Element {
  return (
    <div class={classOf("Card", props.class)}>
      <div class="Card-header">{header}</div>
      {children && <Separator class="Card-content-separator" />}
      <div class="Card-content">{children}</div>
      {footer && <Separator class="Card-footer-separator" />}
      {footer && <div class="Card-footer">{footer}</div>}
    </div>
  );
}
