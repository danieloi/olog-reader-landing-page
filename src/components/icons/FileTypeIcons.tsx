import type { HTMLAttributes } from "react";

type IconProps = HTMLAttributes<HTMLSpanElement>;

function MaskedIcon({ src, label, className, ...rest }: IconProps & { src: string; label: string }) {
  return (
    <span
      role="img"
      aria-label={label}
      className={`inline-block bg-current ${className ?? ""}`}
      style={{
        WebkitMaskImage: `url(${src})`,
        maskImage: `url(${src})`,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
        WebkitMaskSize: "contain",
        maskSize: "contain",
      }}
      {...rest}
    />
  );
}

export function FilePdfIcon(props: IconProps) {
  return <MaskedIcon src="/pdf-icon.svg" label="PDF" {...props} />;
}

export function FileEpubIcon(props: IconProps) {
  return <MaskedIcon src="/epub-icon.svg" label="EPUB" {...props} />;
}

export function FilePowerpointIcon(props: IconProps) {
  return <MaskedIcon src="/slides-icon.svg" label="Powerpoint" {...props} />;
}

export function FileLinkIcon(props: IconProps) {
  return <MaskedIcon src="/link-icon.svg" label="Link" {...props} />;
}

export function FileWordIcon(props: IconProps) {
  return <MaskedIcon src="/word-icon.svg" label="Word" {...props} />;
}

export function FileMoreIcon(props: IconProps) {
  return <MaskedIcon src="/more-icon.svg" label="More" {...props} />;
}

export const fileTypeItems = [
  { label: "PDF", Icon: FilePdfIcon },
  { label: "EPUB", Icon: FileEpubIcon },
  { label: "Slides", Icon: FilePowerpointIcon },
  { label: "Links", Icon: FileLinkIcon },
  { label: "Word", Icon: FileWordIcon },
  { label: "More", Icon: FileMoreIcon },
];
