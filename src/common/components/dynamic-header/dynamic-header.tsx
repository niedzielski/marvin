import { h } from "preact";
import { ChildrenProps, ClassProps, classOf } from "../preact-utils";

export default function DynamicHeader({
  level,
  children,
  ...props
}: { level: number } & ChildrenProps & ClassProps): JSX.Element {
  const classes = classOf("DynamicHeader", props.class);
  const Header = level < 1 ? "div" : `h${Math.min(level, 6)}`;
  return <Header class={classes}>{children}</Header>;
}
