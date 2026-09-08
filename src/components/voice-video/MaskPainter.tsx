"use client";

import {
  Check,
  Eraser,
  Hand,
  Paintbrush,
  RotateCcw,
  Undo2,
  X,
} from "lucide-react";
import {
  PointerEvent as ReactPointerEvent,
  useEffect,
  useRef,
  useState,
} from "react";

type MaskPainterProps = {
  name: string;
  sourceUrl: string;
  foregroundUrl: string;
  onCancel: () => void;
  onSave: (foreground: Blob) => void;
};

type Point = { x: number; y: number };
type PointerPoint = Point & { clientX: number; clientY: number };

const loadImage = (url: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Could not open mask"));
    image.src = url;
  });

const canvasBlob = (canvas: HTMLCanvasElement) =>
  new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) =>
        blob ? resolve(blob) : reject(new Error("Could not save mask")),
      "image/png",
    );
  });

export function MaskPainter({
  name,
  sourceUrl,
  foregroundUrl,
  onCancel,
  onSave,
}: MaskPainterProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const maskRef = useRef<HTMLCanvasElement>();
  const overlayRef = useRef<HTMLCanvasElement>();
  const sourceImageRef = useRef<HTMLImageElement>();
  const resetMaskRef = useRef<ImageData>();
  const undoRef = useRef<ImageData[]>([]);
  const pointersRef = useRef(new Map<number, PointerPoint>());
  const cursorPointRef = useRef<Point>();
  const previousPointRef = useRef<Point>();
  const drawingRef = useRef(false);
  const pinchRef = useRef<{
    distance: number;
    zoom: number;
    center: Point;
    pan: Point;
  }>();
  const panDragRef = useRef<{ clientX: number; clientY: number; pan: Point }>();
  const panRef = useRef<Point>({ x: 0, y: 0 });
  const [mode, setMode] = useState<"add" | "erase" | "pan">("add");
  const [brushSize, setBrushSize] = useState(34);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState<Point>({ x: 0, y: 0 });
  const [undoCount, setUndoCount] = useState(0);
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const redraw = () => {
    const canvas = canvasRef.current;
    const mask = maskRef.current;
    const overlay = overlayRef.current;
    const source = sourceImageRef.current;
    if (!canvas || !mask || !overlay || !source) return;
    const context = canvas.getContext("2d");
    const overlayContext = overlay.getContext("2d");
    if (!context || !overlayContext) return;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(source, 0, 0, canvas.width, canvas.height);
    context.fillStyle = "rgba(3, 9, 20, 0.34)";
    context.fillRect(0, 0, canvas.width, canvas.height);
    overlayContext.clearRect(0, 0, overlay.width, overlay.height);
    overlayContext.globalCompositeOperation = "source-over";
    overlayContext.drawImage(mask, 0, 0);
    overlayContext.globalCompositeOperation = "source-in";
    overlayContext.fillStyle = "rgba(0, 122, 255, 0.62)";
    overlayContext.fillRect(0, 0, overlay.width, overlay.height);
    overlayContext.globalCompositeOperation = "source-over";
    context.drawImage(overlay, 0, 0);
    if (cursorPointRef.current && mode !== "pan") {
      const cursor = cursorPointRef.current;
      context.save();
      context.beginPath();
      context.arc(cursor.x, cursor.y, brushSize / 2, 0, Math.PI * 2);
      context.fillStyle =
        mode === "add" ? "rgba(0, 122, 255, 0.16)" : "rgba(255, 107, 95, 0.16)";
      context.fill();
      context.lineWidth = 0.8 / zoom;
      context.strokeStyle = "rgba(255, 255, 255, 0.94)";
      context.stroke();
      context.beginPath();
      context.arc(cursor.x, cursor.y, brushSize / 2, 0, Math.PI * 2);
      context.lineWidth = 0.45 / zoom;
      context.strokeStyle = mode === "add" ? "#007aff" : "#ff6b5f";
      context.stroke();
      context.restore();
    }
  };

  useEffect(() => {
    let cancelled = false;
    Promise.all([loadImage(sourceUrl), loadImage(foregroundUrl)])
      .then(([source, foreground]) => {
        if (cancelled) return;
        const scale = Math.min(1, 1024 / Math.max(source.width, source.height));
        const width = Math.max(1, Math.round(source.width * scale));
        const height = Math.max(1, Math.round(source.height * scale));
        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.width = width;
        canvas.height = height;
        const mask = document.createElement("canvas");
        mask.width = width;
        mask.height = height;
        const maskContext = mask.getContext("2d");
        if (!maskContext) throw new Error("Mask editing is unavailable");
        maskContext.drawImage(foreground, 0, 0, width, height);
        maskContext.globalCompositeOperation = "source-in";
        maskContext.fillStyle = "#ffffff";
        maskContext.fillRect(0, 0, width, height);
        maskContext.globalCompositeOperation = "source-over";
        const overlay = document.createElement("canvas");
        overlay.width = width;
        overlay.height = height;
        maskRef.current = mask;
        overlayRef.current = overlay;
        sourceImageRef.current = source;
        resetMaskRef.current = maskContext.getImageData(0, 0, width, height);
        undoRef.current = [];
        setUndoCount(0);
        setReady(true);
        window.requestAnimationFrame(redraw);
      })
      .catch((caught) => {
        setError(
          caught instanceof Error ? caught.message : "Could not open mask",
        );
      });
    return () => {
      cancelled = true;
    };
  }, [foregroundUrl, sourceUrl]);

  useEffect(() => {
    if (ready) redraw();
  }, [brushSize, mode, ready, zoom]);

  const pointFromEvent = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const bounds = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - bounds.left) / bounds.width) * canvas.width,
      y: ((event.clientY - bounds.top) / bounds.height) * canvas.height,
    };
  };

  const drawStroke = (from: Point, to: Point) => {
    const mask = maskRef.current;
    const context = mask?.getContext("2d");
    if (!mask || !context) return;
    context.save();
    context.globalCompositeOperation =
      mode === "add" ? "source-over" : "destination-out";
    context.strokeStyle = "#ffffff";
    context.fillStyle = "#ffffff";
    context.lineCap = "round";
    context.lineJoin = "round";
    context.lineWidth = brushSize;
    context.beginPath();
    context.moveTo(from.x, from.y);
    context.lineTo(to.x, to.y);
    context.stroke();
    if (from.x === to.x && from.y === to.y) {
      context.beginPath();
      context.arc(to.x, to.y, brushSize / 2, 0, Math.PI * 2);
      context.fill();
    }
    context.restore();
    redraw();
  };

  const rememberUndo = () => {
    const mask = maskRef.current;
    const context = mask?.getContext("2d");
    if (!mask || !context) return;
    undoRef.current.push(context.getImageData(0, 0, mask.width, mask.height));
    if (undoRef.current.length > 8) undoRef.current.shift();
    setUndoCount(undoRef.current.length);
  };

  const pointerDistance = () => {
    const points = Array.from(pointersRef.current.values());
    if (points.length < 2) return 0;
    return Math.hypot(
      points[0].clientX - points[1].clientX,
      points[0].clientY - points[1].clientY,
    );
  };

  const pointerCenter = () => {
    const points = Array.from(pointersRef.current.values());
    if (!points.length) return { x: 0, y: 0 };
    return {
      x: points.reduce((sum, point) => sum + point.clientX, 0) / points.length,
      y: points.reduce((sum, point) => sum + point.clientY, 0) / points.length,
    };
  };

  const updatePan = (next: Point, atZoom = zoom) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const maxX = (canvas.offsetWidth * (atZoom - 1)) / 2;
    const maxY = (canvas.offsetHeight * (atZoom - 1)) / 2;
    const bounded = {
      x: Math.max(-maxX, Math.min(maxX, next.x)),
      y: Math.max(-maxY, Math.min(maxY, next.y)),
    };
    panRef.current = bounded;
    setPan(bounded);
  };

  const updateZoom = (next: number) => {
    const boundedZoom = Math.max(1, Math.min(6, next));
    setZoom(boundedZoom);
    updatePan(panRef.current, boundedZoom);
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!ready) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    const point = pointFromEvent(event);
    cursorPointRef.current = point;
    pointersRef.current.set(event.pointerId, {
      ...point,
      clientX: event.clientX,
      clientY: event.clientY,
    });
    if (pointersRef.current.size >= 2) {
      drawingRef.current = false;
      cursorPointRef.current = undefined;
      pinchRef.current = {
        distance: pointerDistance(),
        zoom,
        center: pointerCenter(),
        pan: panRef.current,
      };
      return;
    }
    if (mode === "pan") {
      cursorPointRef.current = undefined;
      panDragRef.current = {
        clientX: event.clientX,
        clientY: event.clientY,
        pan: panRef.current,
      };
      return;
    }
    rememberUndo();
    drawingRef.current = true;
    previousPointRef.current = point;
    drawStroke(point, point);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    const point = pointFromEvent(event);
    cursorPointRef.current = mode === "pan" ? undefined : point;
    if (!pointersRef.current.has(event.pointerId)) {
      redraw();
      return;
    }
    pointersRef.current.set(event.pointerId, {
      ...point,
      clientX: event.clientX,
      clientY: event.clientY,
    });
    if (pointersRef.current.size >= 2 && pinchRef.current) {
      const distance = pointerDistance();
      let nextZoom = pinchRef.current.zoom;
      if (pinchRef.current.distance > 0) {
        nextZoom = Math.max(
          1,
          Math.min(
            6,
            pinchRef.current.zoom * (distance / pinchRef.current.distance),
          ),
        );
        setZoom(nextZoom);
      }
      const center = pointerCenter();
      updatePan(
        {
          x: pinchRef.current.pan.x + center.x - pinchRef.current.center.x,
          y: pinchRef.current.pan.y + center.y - pinchRef.current.center.y,
        },
        nextZoom,
      );
      return;
    }
    if (mode === "pan" && panDragRef.current) {
      updatePan({
        x:
          panDragRef.current.pan.x + event.clientX - panDragRef.current.clientX,
        y:
          panDragRef.current.pan.y + event.clientY - panDragRef.current.clientY,
      });
      return;
    }
    if (!drawingRef.current || !previousPointRef.current) return;
    drawStroke(previousPointRef.current, point);
    previousPointRef.current = point;
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    pointersRef.current.delete(event.pointerId);
    drawingRef.current = false;
    previousPointRef.current = undefined;
    panDragRef.current = undefined;
    if (pointersRef.current.size < 2) pinchRef.current = undefined;
  };

  const handlePointerLeave = () => {
    if (drawingRef.current) return;
    cursorPointRef.current = undefined;
    redraw();
  };

  const undo = () => {
    const previous = undoRef.current.pop();
    const mask = maskRef.current;
    const context = mask?.getContext("2d");
    if (!previous || !context) return;
    context.putImageData(previous, 0, 0);
    setUndoCount(undoRef.current.length);
    redraw();
  };

  const reset = () => {
    const initial = resetMaskRef.current;
    const mask = maskRef.current;
    const context = mask?.getContext("2d");
    if (!initial || !context) return;
    rememberUndo();
    context.putImageData(initial, 0, 0);
    redraw();
  };

  const save = async () => {
    const source = sourceImageRef.current;
    const mask = maskRef.current;
    if (!source || !mask || saving) return;
    setSaving(true);
    setError("");
    try {
      const output = document.createElement("canvas");
      output.width = source.width;
      output.height = source.height;
      const context = output.getContext("2d");
      if (!context) throw new Error("Mask editing is unavailable");
      context.drawImage(source, 0, 0, output.width, output.height);
      context.globalCompositeOperation = "destination-in";
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";
      context.drawImage(mask, 0, 0, output.width, output.height);
      context.globalCompositeOperation = "source-over";
      onSave(await canvasBlob(output));
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Could not save mask",
      );
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-[#07111f]/75 p-0 backdrop-blur-sm sm:items-center sm:p-5"
      role="dialog"
      aria-modal="true"
      aria-label={`Edit mask for ${name}`}
    >
      <div className="flex max-h-[96svh] w-full max-w-3xl flex-col overflow-hidden rounded-t-[1.75rem] bg-[#111720] text-white shadow-2xl sm:rounded-[1.75rem]">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 sm:px-5">
          <div className="min-w-0">
            <h3 className="font-semibold">Paint subject mask</h3>
            <p className="truncate text-xs text-white/55">{name}</p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="grid h-10 w-10 place-items-center rounded-full bg-white/10"
            aria-label="Close mask editor"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-auto bg-[#050912] p-3 sm:p-5">
          <div className="grid min-h-[46svh] place-items-center overflow-auto rounded-xl bg-[linear-gradient(45deg,#202833_25%,transparent_25%),linear-gradient(-45deg,#202833_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#202833_75%),linear-gradient(-45deg,transparent_75%,#202833_75%)] bg-[length:24px_24px] bg-[position:0_0,0_12px,12px_-12px,-12px_0px]">
            <canvas
              ref={canvasRef}
              className={`max-h-[58svh] max-w-full object-contain shadow-2xl ${
                mode === "pan"
                  ? "cursor-grab active:cursor-grabbing"
                  : "cursor-none"
              }`}
              style={{
                transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`,
                transformOrigin: "center",
                touchAction: "none",
              }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              onPointerLeave={handlePointerLeave}
            />
          </div>
        </div>

        <div className="border-t border-white/10 bg-[#171e28] px-4 py-3 sm:px-5">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setMode("add")}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${mode === "add" ? "bg-[#007aff]" : "bg-white/8 text-white/70"}`}
            >
              <Paintbrush className="h-4 w-4" /> Add
            </button>
            <button
              type="button"
              onClick={() => setMode("erase")}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${mode === "erase" ? "bg-[#ff6b5f]" : "bg-white/8 text-white/70"}`}
            >
              <Eraser className="h-4 w-4" /> Erase
            </button>
            <button
              type="button"
              onClick={() => setMode("pan")}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${mode === "pan" ? "bg-white text-[#111720]" : "bg-white/8 text-white/70"}`}
            >
              <Hand className="h-4 w-4" /> Move
            </button>
            <button
              type="button"
              onClick={undo}
              disabled={!undoCount}
              className="grid h-9 w-9 place-items-center rounded-full bg-white/8 disabled:opacity-30"
              aria-label="Undo mask stroke"
            >
              <Undo2 className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={reset}
              className="grid h-9 w-9 place-items-center rounded-full bg-white/8"
              aria-label="Reset mask"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-4 text-xs font-semibold text-white/65">
            <label>
              <span className="mb-1 flex justify-between">
                Brush <span>{brushSize}</span>
              </span>
              <input
                type="range"
                min={8}
                max={100}
                value={brushSize}
                onChange={(event) => setBrushSize(Number(event.target.value))}
                className="w-full accent-[#007aff]"
              />
            </label>
            <label>
              <span className="mb-1 flex justify-between">
                Zoom <span>{zoom.toFixed(1)}×</span>
              </span>
              <input
                type="range"
                min={1}
                max={6}
                step={0.1}
                value={zoom}
                onChange={(event) => updateZoom(Number(event.target.value))}
                className="w-full accent-[#007aff]"
              />
            </label>
          </div>
          <p className="mt-2 text-[11px] text-white/45">
            Blue is included in the subject. Pinch and drag with two fingers, or
            choose Move to pan with one finger.
          </p>
          {error && <p className="mt-2 text-xs text-[#ff9188]">{error}</p>}
          <div className="mt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-full px-5 py-2.5 text-sm font-semibold text-white/65"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => void save()}
              disabled={!ready || saving}
              className="flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#111720] disabled:opacity-50"
            >
              <Check className="h-4 w-4" /> {saving ? "Saving…" : "Use mask"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
