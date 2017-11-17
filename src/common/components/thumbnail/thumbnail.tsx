import { h } from "preact";
import { ClassProps, classOf } from "../preact-utils";
import Link from "../link";
import { PageImage } from "../../models/page/image";
import "./thumbnail.css";

export interface Props {
  image: PageImage;
  url?: string;
}

export function Thumbnail({ image, url, ...props }: Props & ClassProps) {
  const imageOrientationClass = `Thumbnail-image-${image.landscape
    ? "landscape"
    : "portrait"}`;
  const img = (
    <img
      key={image.url}
      class={`Thumbnail-image ${imageOrientationClass}`}
      src={image.url}
      width={image.width}
      height={image.height}
    />
  );
  return (
    <span class={classOf("Thumbnail", props.class)}>
      {url ? <Link href={url}>{img}</Link> : img}
    </span>
  );
}
