import { FilesetResolver, ImageSegmenter } from "@mediapipe/tasks-vision";

const WASM_ROOT =
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.0.1/wasm";
const MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_segmenter/float16/latest/selfie_segmenter.tflite";
const MAX_EDGE = 1800;

let segmenterPromise: Promise<ImageSegmenter> | undefined;

function getSegmenter() {
  segmenterPromise ??= FilesetResolver.forVisionTasks(WASM_ROOT).then(
    (vision) =>
      ImageSegmenter.createFromOptions(vision, {
        baseOptions: { modelAssetPath: MODEL_URL, delegate: "GPU" },
        runningMode: "IMAGE",
        outputCategoryMask: false,
        outputConfidenceMasks: true,
      }),
  );
  return segmenterPromise;
}

function canvasBlob(
  canvas: HTMLCanvasElement,
  type: "image/jpeg" | "image/png",
  quality?: number,
) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) =>
        blob ? resolve(blob) : reject(new Error("Could not prepare photo")),
      type,
      quality,
    );
  });
}

function loadImage(file: File) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read photo"));
    };
    image.src = url;
  });
}

export type SegmentedPhoto = {
  background: Blob;
  foreground?: Blob;
  width: number;
  height: number;
};

export async function segmentPhoto(file: File): Promise<SegmentedPhoto> {
  const image = await loadImage(file);
  const scale = Math.min(1, MAX_EDGE / Math.max(image.width, image.height));
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));
  const source = document.createElement("canvas");
  source.width = width;
  source.height = height;
  const sourceContext = source.getContext("2d", { alpha: false });
  if (!sourceContext) throw new Error("Photo processing is unavailable");
  sourceContext.drawImage(image, 0, 0, width, height);
  const background = await canvasBlob(source, "image/jpeg", 0.9);

  try {
    const segmenter = await getSegmenter();
    const result = segmenter.segment(source);
    const mask = result.confidenceMasks?.[0];
    if (!mask) return { background, width, height };
    const confidence = mask.getAsFloat32Array();
    const pixels = new Uint8ClampedArray(mask.width * mask.height * 4);
    let subjectPixels = 0;
    for (let index = 0; index < confidence.length; index += 1) {
      const score = confidence[index];
      if (score > 0.5) subjectPixels += 1;
      const alpha = Math.round(
        Math.max(0, Math.min(1, (score - 0.18) / 0.64)) * 255,
      );
      const offset = index * 4;
      pixels[offset] = 255;
      pixels[offset + 1] = 255;
      pixels[offset + 2] = 255;
      pixels[offset + 3] = alpha;
    }
    const coverage = subjectPixels / confidence.length;
    if (coverage < 0.025 || coverage > 0.96) {
      mask.close();
      return { background, width, height };
    }

    const maskCanvas = document.createElement("canvas");
    maskCanvas.width = mask.width;
    maskCanvas.height = mask.height;
    maskCanvas
      .getContext("2d")
      ?.putImageData(new ImageData(pixels, mask.width, mask.height), 0, 0);
    mask.close();

    const cutout = document.createElement("canvas");
    cutout.width = width;
    cutout.height = height;
    const cutoutContext = cutout.getContext("2d");
    if (!cutoutContext) return { background, width, height };
    cutoutContext.drawImage(source, 0, 0);
    cutoutContext.globalCompositeOperation = "destination-in";
    cutoutContext.drawImage(maskCanvas, 0, 0, width, height);
    const foreground = await canvasBlob(cutout, "image/png");
    return { background, foreground, width, height };
  } catch {
    return { background, width, height };
  }
}
