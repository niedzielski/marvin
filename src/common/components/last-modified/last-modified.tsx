import { h } from "preact";
import { ClassProps, classOf } from "../preact-utils";

export default function LastModified({
  date,
  ...props
}: { date: Date } & ClassProps) {
  return (
    <span class={classOf("LastModified", props.class)}>
      Last updated {date.toLocaleString("en-GB")}
    </span>
  );
}
