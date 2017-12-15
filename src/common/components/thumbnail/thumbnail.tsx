import { h } from "preact";
import { ClassProps, classOf } from "../preact-utils";
import Link from "../link/link";
import { PageImage } from "../../models/page/image";
import "./thumbnail.css";

export interface Props {
  image: PageImage;
  url?: string;
  block?: boolean;
}

export function Thumbnail({ image, url, block, ...props }: Props & ClassProps) {
  const imageOrientationClass = `Thumbnail-image-${
    image.landscape ? "landscape" : "portrait"
  }`;
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
    <span
      class={classOf(
        "Thumbnail",
        props.class,
        block ? "Thumbnail--block" : undefined
      )}
    >
      {url ? <Link href={url}>{img}</Link> : img}
    </span>
  );
}
