"use client";

/* eslint-disable @next/next/no-img-element */

import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  Captions,
  Check,
  Clock3,
  Mic,
  ImagePlus,
  SlidersHorizontal,
  Pause,
  Paintbrush,
  Play,
  RotateCcw,
  Share2,
  Sparkles,
  Square,
  Upload,
  WandSparkles,
  X,
} from "lucide-react";
import {
  FaAt,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTiktok,
  FaWhatsapp,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";
import {
  ChangeEvent,
  CSSProperties,
  PointerEvent as ReactPointerEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { segmentPhoto } from "./subject-segmentation";
import { MaskPainter } from "./MaskPainter";

type Stage = "capture" | "transcribing" | "edit" | "rendering" | "done";
type Ratio = "story" | "portrait" | "square";
type Theme = "paper" | "midnight" | "sunset" | "sage";
type SocialPlatform =
  | "none"
  | "instagram"
  | "tiktok"
  | "x"
  | "youtube"
  | "facebook"
  | "linkedin"
  | "whatsapp";
type SpeechMark = { time: number; value: string };
type PreviewWord = { text: string; index: number };
type CaptionSegment = {
  id: string;
  startMs: number;
  endMs: number;
  text: string;
};
type PhotoAsset = {
  localId: string;
  name: string;
  sourceFile: File;
  previewUrl: string;
  foregroundUrl?: string;
  background?: Blob;
  foreground?: Blob;
  status: "processing" | "ready";
  remoteId?: string;
  maskCoverage: number;
  maskSoftness: number;
  foregroundScale: number;
  maskEdited?: boolean;
};

type UploadSession = {
  uploadId: string;
  accessToken: string;
  uploadUrl: string;
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://api.reader.olog.me/v1";
const MAX_SECONDS = 90;
const MAX_BYTES = 30 * 1024 * 1024;
const MAX_PHOTOS = 6;
const MAX_PHOTO_SOURCE_BYTES = 15 * 1024 * 1024;
const TIMELINE_PIXELS_PER_SECOND = 72;
const supportedPhotoTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
  "image/heic-sequence",
  "image/heif-sequence",
]);

function isSupportedPhoto(file: File) {
  if (supportedPhotoTypes.has(file.type.toLocaleLowerCase())) return true;
  return /\.(?:jpe?g|png|webp|heic|heif)$/i.test(file.name);
}

const socialPlatforms: Array<{
  value: SocialPlatform;
  label: string;
  color: string;
}> = [
  { value: "none", label: "No platform", color: "#697386" },
  { value: "instagram", label: "Instagram", color: "#d62976" },
  { value: "tiktok", label: "TikTok", color: "#11161e" },
  { value: "x", label: "X", color: "#11161e" },
  { value: "youtube", label: "YouTube", color: "#ff0033" },
  { value: "facebook", label: "Facebook", color: "#1877f2" },
  { value: "linkedin", label: "LinkedIn", color: "#0a66c2" },
  { value: "whatsapp", label: "WhatsApp", color: "#25d366" },
];

function SocialIcon({
  platform,
  className,
  style,
}: {
  platform: SocialPlatform;
  className?: string;
  style?: CSSProperties;
}) {
  const props = { className, style, "aria-hidden": true };
  if (platform === "instagram") return <FaInstagram {...props} />;
  if (platform === "tiktok") return <FaTiktok {...props} />;
  if (platform === "x") return <FaXTwitter {...props} />;
  if (platform === "youtube") return <FaYoutube {...props} />;
  if (platform === "facebook") return <FaFacebookF {...props} />;
  if (platform === "linkedin") return <FaLinkedinIn {...props} />;
  if (platform === "whatsapp") return <FaWhatsapp {...props} />;
  return <FaAt {...props} />;
}

const ratioClasses: Record<Ratio, string> = {
  story: "aspect-[9/16] max-h-[68svh] xl:max-h-[760px]",
  portrait: "aspect-[4/5] max-h-[64svh] xl:max-h-[680px]",
  square: "aspect-square max-h-[58svh] xl:max-h-[620px]",
};

const previewTextCardClasses: Record<Ratio, string> = {
  story: "h-[20rem]",
  portrait: "h-[17rem]",
  square: "h-[14rem]",
};

const ratioLabels: Array<{ value: Ratio; label: string; hint: string }> = [
  { value: "story", label: "Story", hint: "9:16" },
  { value: "portrait", label: "Post", hint: "4:5" },
  { value: "square", label: "Square", hint: "1:1" },
];

const themes: Array<{
  value: Theme;
  label: string;
  background: [string, string];
  card: string;
  border: string;
  text: string;
  muted: string;
  accent: string;
  activeText: string;
  quote: string;
  sticker: string;
  stickerInner: string;
  stickerOuter: string;
  orbOne: string;
  orbTwo: string;
}> = [
  {
    value: "paper",
    label: "Paper",
    background: ["#EBF4FF", "#D6EAFF"],
    card: "#FFFFFF",
    border: "#ADD4FF",
    text: "#0B0F14",
    muted: "#32353A",
    accent: "#FF9500",
    activeText: "#FFFFFF",
    quote: "#85BFFF",
    sticker: "#003166",
    stickerInner: "#FFFFFF",
    stickerOuter: "#ADD4FF",
    orbOne: "#FF9500",
    orbTwo: "#FF6B8A",
  },
  {
    value: "midnight",
    label: "Midnight",
    background: ["#0A1228", "#172A52"],
    card: "#14213D",
    border: "#355583",
    text: "#F5F8FF",
    muted: "#B9C8E4",
    accent: "#FFB24A",
    activeText: "#17213A",
    quote: "#5274AA",
    sticker: "#D7E7FF",
    stickerInner: "#233A63",
    stickerOuter: "#6F91C4",
    orbOne: "#FFB24A",
    orbTwo: "#8C6CFF",
  },
  {
    value: "sunset",
    label: "Sunset",
    background: ["#FFF1DE", "#FFD3CA"],
    card: "#FFF9F2",
    border: "#F5B39B",
    text: "#3B2030",
    muted: "#75495B",
    accent: "#E75650",
    activeText: "#FFFFFF",
    quote: "#F2A184",
    sticker: "#762D52",
    stickerInner: "#FFF9F2",
    stickerOuter: "#F3A8A0",
    orbOne: "#E75650",
    orbTwo: "#8D4D91",
  },
  {
    value: "sage",
    label: "Sage",
    background: ["#EAF2E5", "#C8DCCB"],
    card: "#FAFCF5",
    border: "#A7C5AA",
    text: "#17342A",
    muted: "#49665A",
    accent: "#D97942",
    activeText: "#FFFFFF",
    quote: "#8EB497",
    sticker: "#214D3D",
    stickerInner: "#FAFCF5",
    stickerOuter: "#9AC2A4",
    orbOne: "#D97942",
    orbTwo: "#668D78",
  },
];

function buildPreviewPages(text: string, ratio: Ratio) {
  const allTokens = Array.from(
    text.trim().matchAll(/\S+/g),
    (match, index) => ({
      text: match[0],
      index,
    }),
  );
  if (!allTokens.length) return [];
  const limit = ratio === "square" ? 20 : ratio === "portrait" ? 26 : 34;
  const paragraphs = text
    .trim()
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
  const pages: PreviewWord[][] = [];
  let globalCursor = 0;

  const units = paragraphs.flatMap((paragraph) =>
    paragraph
      .split(/(?<=[.!?])\s+/)
      .map((sentence) => sentence.split(/\s+/).filter(Boolean))
      .filter((sentence) => sentence.length)
      .flatMap((sentence) => {
        if (sentence.length <= limit) return [sentence];
        const chunks: string[][] = [];
        for (let index = 0; index < sentence.length; index += limit) {
          chunks.push(sentence.slice(index, index + limit));
        }
        return chunks;
      }),
  );
  let pageWords: string[] = [];

  for (const unit of units) {
    if (pageWords.length && pageWords.length + unit.length > limit) {
      pages.push(
        allTokens.slice(globalCursor, globalCursor + pageWords.length),
      );
      globalCursor += pageWords.length;
      pageWords = [];
    }
    pageWords.push(...unit);
  }
  if (pageWords.length) {
    pages.push(allTokens.slice(globalCursor, globalCursor + pageWords.length));
  }

  return pages;
}

const nonWordCharacters = new RegExp("[^\\p{L}\\p{N}]", "gu");

function normalizeWord(value: string) {
  return value
    .normalize("NFKC")
    .toLocaleLowerCase()
    .replace(nonWordCharacters, "");
}

function alignPreviewWords(
  text: string,
  rawMarks: SpeechMark[],
  durationMs: number,
) {
  const edited = text.trim().split(/\s+/).filter(Boolean);
  if (!edited.length || !rawMarks.length) return [];
  const source = rawMarks.map((mark) => normalizeWord(mark.value));
  const target = edited.map(normalizeWord);
  const matrix = Array.from({ length: source.length + 1 }, () =>
    Array<number>(target.length + 1).fill(0),
  );
  for (let left = 1; left <= source.length; left += 1) {
    for (let right = 1; right <= target.length; right += 1) {
      matrix[left][right] =
        source[left - 1] && source[left - 1] === target[right - 1]
          ? matrix[left - 1][right - 1] + 1
          : Math.max(matrix[left - 1][right], matrix[left][right - 1]);
    }
  }
  const anchors = new Map<number, number>();
  let left = source.length;
  let right = target.length;
  while (left > 0 && right > 0) {
    if (source[left - 1] && source[left - 1] === target[right - 1]) {
      anchors.set(right - 1, left - 1);
      left -= 1;
      right -= 1;
    } else if (matrix[left - 1][right] >= matrix[left][right - 1]) left -= 1;
    else right -= 1;
  }
  const anchorList = Array.from(anchors.entries()).sort((a, b) => a[0] - b[0]);
  const timeFor = (targetIndex: number) => {
    const exact = anchors.get(targetIndex);
    if (exact !== undefined) return rawMarks[exact].time;
    const before = [...anchorList]
      .reverse()
      .find(([index]) => index < targetIndex);
    const after = anchorList.find(([index]) => index > targetIndex);
    if (before && after) {
      const progress = (targetIndex - before[0]) / (after[0] - before[0]);
      return (
        rawMarks[before[1]].time +
        progress * (rawMarks[after[1]].time - rawMarks[before[1]].time)
      );
    }
    if (before) {
      const startTime = rawMarks[before[1]].time;
      const endTime = Math.max(startTime, Math.max(0, durationMs) - 1);
      const progress = (targetIndex - before[0]) / (target.length - before[0]);
      return startTime + progress * (endTime - startTime);
    }
    if (after) {
      return (targetIndex / Math.max(1, after[0])) * rawMarks[after[1]].time;
    }
    const sourceIndex =
      (targetIndex * Math.max(0, source.length - 1)) /
      Math.max(1, target.length - 1);
    const lower = Math.floor(sourceIndex);
    const upper = Math.ceil(sourceIndex);
    return (
      rawMarks[lower].time +
      (rawMarks[upper].time - rawMarks[lower].time) * (sourceIndex - lower)
    );
  };
  return edited.map((value, wordIndex) => ({
    time: timeFor(wordIndex),
    value,
    wordIndex,
  }));
}

function formatTime(seconds: number) {
  return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
}

function formatCaptionTime(milliseconds: number) {
  const seconds = Math.max(0, Math.floor(milliseconds / 1000));
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}

function buildCaptionSegments(
  text: string,
  rawMarks: SpeechMark[],
  durationMs: number,
) {
  const marks = alignPreviewWords(text, rawMarks, durationMs);
  if (!marks.length) return [];
  const segments: CaptionSegment[] = [];
  let startIndex = 0;

  const commit = (endIndex: number) => {
    const slice = marks.slice(startIndex, endIndex + 1);
    if (!slice.length) return;
    segments.push({
      id: `caption-${startIndex}-${Math.round(slice[0].time)}`,
      startMs: slice[0].time,
      endMs: marks[endIndex + 1]?.time ?? durationMs,
      text: slice.map((mark) => mark.value).join(" "),
    });
    startIndex = endIndex + 1;
  };

  for (let index = 0; index < marks.length; index += 1) {
    const count = index - startIndex + 1;
    const span = marks[index].time - marks[startIndex].time;
    const sentenceEnd = /[.!?][”'\"]?$/.test(marks[index].value);
    if (
      (sentenceEnd && count >= 4 && span >= 1400) ||
      span >= 4200 ||
      count >= 12
    ) {
      commit(index);
    }
  }
  if (startIndex < marks.length) commit(marks.length - 1);
  return segments;
}

function segmentsToTranscript(segments: CaptionSegment[]) {
  return segments
    .map((segment) => segment.text.trim())
    .filter(Boolean)
    .join(" ");
}

function preferredMimeType() {
  if (typeof MediaRecorder === "undefined") return "";
  return (
    ["audio/webm;codecs=opus", "audio/mp4", "audio/webm"].find((type) =>
      MediaRecorder.isTypeSupported(type),
    ) || ""
  );
}

export function VoiceVideoStudio() {
  const [stage, setStage] = useState<Stage>("capture");
  const [audio, setAudio] = useState<Blob | null>(null);
  const [audioName, setAudioName] = useState("voice-note.webm");
  const [audioUrl, setAudioUrl] = useState("");
  const [duration, setDuration] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [speechMarks, setSpeechMarks] = useState<SpeechMark[]>([]);
  const [captionSegments, setCaptionSegments] = useState<CaptionSegment[]>([]);
  const [selectedSegmentId, setSelectedSegmentId] = useState("");
  const [previewTime, setPreviewTime] = useState(0);
  const [timelineViewportWidth, setTimelineViewportWidth] = useState(0);
  const [session, setSession] = useState<UploadSession | null>(null);
  const [ratio, setRatio] = useState<Ratio>("story");
  const [theme, setTheme] = useState<Theme>("paper");
  const [photos, setPhotos] = useState<PhotoAsset[]>([]);
  const [refiningPhotoId, setRefiningPhotoId] = useState("");
  const [maskEditorPhotoId, setMaskEditorPhotoId] = useState("");
  const [paintingPhotoId, setPaintingPhotoId] = useState("");
  const [attribution, setAttribution] = useState("");
  const [socialPlatform, setSocialPlatform] = useState<SocialPlatform>("none");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [saveUrl, setSaveUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const capturePlayheadRef = useRef<HTMLSpanElement | null>(null);
  const timelineRef = useRef<HTMLDivElement | null>(null);
  const timelineScrubbingRef = useRef(false);
  const timelineSyncingRef = useRef(false);
  const timelinePointerRef = useRef({
    id: -1,
    startX: 0,
    startScrollLeft: 0,
  });
  const photosRef = useRef<PhotoAsset[]>([]);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  useEffect(() => {
    photosRef.current = photos;
  }, [photos]);

  useEffect(() => {
    return () => {
      for (const photo of photosRef.current) {
        URL.revokeObjectURL(photo.previewUrl);
        if (photo.foregroundUrl) URL.revokeObjectURL(photo.foregroundUrl);
      }
    };
  }, []);

  const acceptAudio = (blob: Blob, name: string) => {
    setError("");
    if (blob.size > MAX_BYTES) {
      setError("That recording is over 30 MB. Choose a smaller file.");
      return;
    }
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    const nextUrl = URL.createObjectURL(blob);
    setAudio(blob);
    setAudioName(name);
    setAudioUrl(nextUrl);
    setTranscript("");
    setSpeechMarks([]);
    setCaptionSegments([]);
    setSelectedSegmentId("");
    setSession(null);
    setPreviewTime(0);
    setElapsed(0);
    const probe = new Audio(nextUrl);
    probe.addEventListener("loadedmetadata", () => {
      if (Number.isFinite(probe.duration)) {
        setDuration(probe.duration);
        if (probe.duration > MAX_SECONDS + 0.5) {
          setAudio(null);
          setError("Keep it to 90 seconds or less.");
        }
      }
    });
  };

  const startRecording = async () => {
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];
      const mimeType = preferredMimeType();
      const recorder = new MediaRecorder(
        stream,
        mimeType ? { mimeType } : undefined,
      );
      recorderRef.current = recorder;
      const startedAt = Date.now();
      recorder.ondataavailable = (event) => {
        if (event.data.size) chunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        setIsRecording(false);
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = null;
        const blob = new Blob(chunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        });
        const extension = recorder.mimeType.includes("mp4") ? "m4a" : "webm";
        acceptAudio(blob, `voice-note.${extension}`);
        stream.getTracks().forEach((track) => track.stop());
      };
      recorder.start(250);
      setElapsed(0);
      setIsRecording(true);
      intervalRef.current = setInterval(() => {
        const seconds = (Date.now() - startedAt) / 1000;
        setElapsed(seconds);
        if (seconds >= MAX_SECONDS) recorder.stop();
      }, 100);
    } catch {
      setError(
        "Microphone access was blocked. You can upload a voice note instead.",
      );
    }
  };

  const stopRecording = () => {
    if (recorderRef.current?.state === "recording") recorderRef.current.stop();
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    setIsRecording(false);
  };

  const chooseFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) acceptAudio(file, file.name);
    event.target.value = "";
  };

  const togglePlayback = async () => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      if (document.activeElement instanceof HTMLTextAreaElement) {
        document.activeElement.blur();
      }
      await audioRef.current.play();
    } else audioRef.current.pause();
  };

  const transcribe = async () => {
    if (!audio) return;
    setError("");
    setStage("transcribing");
    try {
      const uploadResponse = await fetch(`${API_URL}/voice-videos/uploads`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          contentType: audio.type || "audio/webm",
          fileName: audioName,
          size: audio.size,
        }),
      });
      if (!uploadResponse.ok) throw new Error("Could not start the upload");
      const nextSession = (await uploadResponse.json()) as UploadSession;
      const putResponse = await fetch(nextSession.uploadUrl, {
        method: "PUT",
        headers: { "content-type": audio.type || "audio/webm" },
        body: audio,
      });
      if (!putResponse.ok) throw new Error("Could not upload the voice note");
      const transcriptionResponse = await fetch(
        `${API_URL}/voice-videos/${nextSession.uploadId}/transcription`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "x-voice-video-token": nextSession.accessToken,
          },
        },
      );
      if (!transcriptionResponse.ok)
        throw new Error("Could not transcribe the voice note");
      const result = (await transcriptionResponse.json()) as {
        transcript: string;
        marks: SpeechMark[];
        durationMs: number;
      };
      setSession(nextSession);
      const nextSegments = buildCaptionSegments(
        result.transcript,
        result.marks,
        result.durationMs,
      );
      setCaptionSegments(nextSegments);
      setSelectedSegmentId("");
      setTranscript(
        nextSegments.length
          ? segmentsToTranscript(nextSegments)
          : result.transcript,
      );
      setSpeechMarks(result.marks);
      setPreviewTime(0);
      setDuration(result.durationMs / 1000);
      setStage("edit");
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Something went wrong",
      );
      setStage("capture");
    }
  };

  const choosePhotos = async (event: ChangeEvent<HTMLInputElement>) => {
    const available = Math.max(0, MAX_PHOTOS - photosRef.current.length);
    const requested = Array.from(event.target.files ?? []);
    const selected = requested.slice(0, available);
    event.target.value = "";
    if (!selected.length) {
      if (available === 0) setError("You can add up to 6 photos.");
      return;
    }
    const valid = selected.filter(
      (file) => isSupportedPhoto(file) && file.size <= MAX_PHOTO_SOURCE_BYTES,
    );
    if (requested.length > available) {
      setError("Only the available photo slots were added.");
    } else if (valid.length !== selected.length) {
      setError("Use HEIC, HEIF, JPG, PNG, or WebP photos under 15 MB each.");
    } else {
      setError("");
    }
    const queued = valid.map((file) => ({
      file,
      asset: {
        localId: crypto.randomUUID(),
        name: file.name,
        sourceFile: file,
        previewUrl: URL.createObjectURL(file),
        status: "processing" as const,
        maskCoverage: 0,
        maskSoftness: 20,
        foregroundScale: 140,
      },
    }));
    setPhotos((current) => [...current, ...queued.map(({ asset }) => asset)]);

    for (const { file, asset } of queued) {
      try {
        const processed = await segmentPhoto(file);
        const previewUrl = URL.createObjectURL(processed.background);
        const foregroundUrl = processed.foreground
          ? URL.createObjectURL(processed.foreground)
          : undefined;
        URL.revokeObjectURL(asset.previewUrl);
        setPhotos((current) =>
          current.map((photo) =>
            photo.localId === asset.localId
              ? {
                  ...photo,
                  previewUrl,
                  foregroundUrl,
                  background: processed.background,
                  foreground: processed.foreground,
                  status: "ready",
                }
              : photo,
          ),
        );
      } catch {
        URL.revokeObjectURL(asset.previewUrl);
        setPhotos((current) =>
          current.filter((photo) => photo.localId !== asset.localId),
        );
        setError(`Could not prepare ${file.name}.`);
      }
    }
  };

  const removePhoto = (localId: string) => {
    const photo = photosRef.current.find((item) => item.localId === localId);
    if (photo) {
      URL.revokeObjectURL(photo.previewUrl);
      if (photo.foregroundUrl) URL.revokeObjectURL(photo.foregroundUrl);
    }
    setMaskEditorPhotoId((current) => (current === localId ? "" : current));
    setPhotos((current) => current.filter((item) => item.localId !== localId));
  };

  const movePhoto = (index: number, offset: -1 | 1) => {
    setPhotos((current) => {
      const target = index + offset;
      if (target < 0 || target >= current.length) return current;
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const updatePhotoRefinement = (
    localId: string,
    key: "maskCoverage" | "maskSoftness",
    value: number,
  ) => {
    setPhotos((current) =>
      current.map((photo) =>
        photo.localId === localId ? { ...photo, [key]: value } : photo,
      ),
    );
  };

  const refinePhoto = async (
    localId: string,
    refinement: { maskCoverage?: number; maskSoftness?: number } = {},
  ) => {
    const photo = photosRef.current.find((item) => item.localId === localId);
    if (!photo || photo.status === "processing") return;
    const maskCoverage = refinement.maskCoverage ?? photo.maskCoverage;
    const maskSoftness = refinement.maskSoftness ?? photo.maskSoftness;
    setRefiningPhotoId(localId);
    setPhotos((current) =>
      current.map((item) =>
        item.localId === localId
          ? { ...item, maskCoverage, maskSoftness, status: "processing" }
          : item,
      ),
    );
    try {
      const processed = await segmentPhoto(photo.sourceFile, {
        coverage: maskCoverage,
        softness: maskSoftness,
      });
      const previewUrl = URL.createObjectURL(processed.background);
      const foregroundUrl = processed.foreground
        ? URL.createObjectURL(processed.foreground)
        : undefined;
      URL.revokeObjectURL(photo.previewUrl);
      if (photo.foregroundUrl) URL.revokeObjectURL(photo.foregroundUrl);
      setPhotos((current) =>
        current.map((item) =>
          item.localId === localId
            ? {
                ...item,
                previewUrl,
                foregroundUrl,
                background: processed.background,
                foreground: processed.foreground,
                remoteId: undefined,
                maskCoverage,
                maskSoftness,
                maskEdited: false,
                status: "ready",
              }
            : item,
        ),
      );
    } catch {
      setPhotos((current) =>
        current.map((item) =>
          item.localId === localId ? { ...item, status: "ready" } : item,
        ),
      );
      setError(`Could not refine ${photo.name}.`);
    } finally {
      setRefiningPhotoId((current) => (current === localId ? "" : current));
    }
  };

  const savePaintedMask = (localId: string, foreground: Blob) => {
    const photo = photosRef.current.find((item) => item.localId === localId);
    if (!photo) return;
    const foregroundUrl = URL.createObjectURL(foreground);
    if (photo.foregroundUrl) URL.revokeObjectURL(photo.foregroundUrl);
    setPhotos((current) =>
      current.map((item) =>
        item.localId === localId
          ? {
              ...item,
              foreground,
              foregroundUrl,
              remoteId: undefined,
              maskEdited: true,
            }
          : item,
      ),
    );
    setPaintingPhotoId("");
  };

  const uploadPhotos = async (activeSession: UploadSession) => {
    const visuals: Array<{
      imageId: string;
      segmented: boolean;
      foregroundScale: number;
    }> = [];
    for (const photo of photosRef.current) {
      if (!photo.background || photo.status !== "ready") {
        throw new Error("Wait for every photo to finish processing");
      }
      let imageId = photo.remoteId;
      if (!imageId) {
        const slotResponse = await fetch(
          `${API_URL}/voice-videos/${activeSession.uploadId}/images`,
          {
            method: "POST",
            headers: {
              "content-type": "application/json",
              "x-voice-video-token": activeSession.accessToken,
            },
          },
        );
        if (!slotResponse.ok) throw new Error("Could not prepare photo upload");
        const slot = (await slotResponse.json()) as {
          imageId: string;
          backgroundUploadUrl: string;
          foregroundUploadUrl: string;
        };
        const backgroundResponse = await fetch(slot.backgroundUploadUrl, {
          method: "PUT",
          headers: { "content-type": "image/jpeg" },
          body: photo.background,
        });
        if (!backgroundResponse.ok) throw new Error("Could not upload a photo");
        if (photo.foreground) {
          const foregroundResponse = await fetch(slot.foregroundUploadUrl, {
            method: "PUT",
            headers: { "content-type": "image/png" },
            body: photo.foreground,
          });
          if (!foregroundResponse.ok)
            throw new Error("Could not upload a subject mask");
        }
        imageId = slot.imageId;
        setPhotos((current) =>
          current.map((item) =>
            item.localId === photo.localId
              ? { ...item, remoteId: slot.imageId }
              : item,
          ),
        );
      }
      visuals.push({
        imageId,
        segmented: Boolean(photo.foreground),
        foregroundScale: photo.foregroundScale ?? 140,
      });
    }
    return visuals;
  };

  const renderVideo = async () => {
    if (!session || !transcript.trim()) return;
    audioRef.current?.pause();
    setIsPlaying(false);
    setError("");
    setStage("rendering");
    try {
      const visuals = await uploadPhotos(session);
      const response = await fetch(
        `${API_URL}/voice-videos/${session.uploadId}/jobs`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "x-voice-video-token": session.accessToken,
          },
          body: JSON.stringify({
            text: transcript.trim(),
            ratio,
            theme,
            attribution: attribution.trim() || undefined,
            socialPlatform:
              socialPlatform === "none" ? undefined : socialPlatform,
            visuals,
          }),
        },
      );
      if (!response.ok) throw new Error("Could not start the video render");
      const job = (await response.json()) as { jobId: string };
      for (let attempt = 0; attempt < 150; attempt += 1) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const statusResponse = await fetch(
          `${API_URL}/voice-videos/jobs/${encodeURIComponent(job.jobId)}`,
          { headers: { "x-voice-video-token": session.accessToken } },
        );
        if (!statusResponse.ok)
          throw new Error("Could not check the video render");
        const status = (await statusResponse.json()) as {
          status: "queued" | "rendering" | "completed" | "failed";
          downloadUrl?: string;
          saveUrl?: string;
        };
        if (status.status === "completed" && status.downloadUrl) {
          setDownloadUrl(status.downloadUrl);
          setSaveUrl(status.saveUrl || status.downloadUrl);
          setStage("done");
          return;
        }
        if (status.status === "failed")
          throw new Error("The video render failed");
      }
      throw new Error("The video took too long to render");
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Something went wrong",
      );
      setStage("edit");
    }
  };

  const reset = () => {
    audioRef.current?.pause();
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setStage("capture");
    setAudio(null);
    setAudioUrl("");
    setTranscript("");
    setSpeechMarks([]);
    setCaptionSegments([]);
    setSelectedSegmentId("");
    setPreviewTime(0);
    setSession(null);
    setDownloadUrl("");
    setSaveUrl("");
    setIsSaving(false);
    setError("");
    setElapsed(0);
    setDuration(0);
    setTheme("paper");
    setSocialPlatform("none");
    for (const photo of photosRef.current) {
      URL.revokeObjectURL(photo.previewUrl);
      if (photo.foregroundUrl) URL.revokeObjectURL(photo.foregroundUrl);
    }
    setPhotos([]);
    setRefiningPhotoId("");
    setMaskEditorPhotoId("");
    setPaintingPhotoId("");
  };

  const words = transcript.trim().split(/\s+/).filter(Boolean);
  const paintingPhoto = photos.find(
    (photo) => photo.localId === paintingPhotoId,
  );
  const isEditingStage = stage === "edit" || stage === "rendering";
  const capturePlaybackProgress =
    duration > 0 ? Math.min(1, Math.max(0, previewTime / duration)) : 0;
  const previewMarks = useMemo(
    () => alignPreviewWords(transcript, speechMarks, duration * 1000),
    [duration, speechMarks, transcript],
  );
  let activeWordIndex: number | null = null;
  for (const mark of previewMarks) {
    if (mark.time > previewTime * 1000) break;
    activeWordIndex = mark.wordIndex;
  }

  const positionCapturePlayhead = (seconds: number) => {
    if (!capturePlayheadRef.current) return;
    const progress =
      duration > 0 ? Math.min(1, Math.max(0, seconds / duration)) : 0;
    capturePlayheadRef.current.style.left = `${progress * 100}%`;
  };

  const seekPreview = (seconds: number) => {
    const nextTime = Math.min(Math.max(seconds, 0), duration || 0);
    positionCapturePlayhead(nextTime);
    setPreviewTime(nextTime);
    if (audioRef.current) audioRef.current.currentTime = nextTime;
  };

  const scrubCaptureWaveform = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!duration) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const progress = Math.min(
      1,
      Math.max(0, (event.clientX - bounds.left) / bounds.width),
    );
    seekPreview(progress * duration);
  };

  useEffect(() => {
    const timeline = timelineRef.current;
    if (!timeline || !isEditingStage) return;
    const measureTimeline = () =>
      setTimelineViewportWidth(timeline.clientWidth);
    measureTimeline();
    const observer = new ResizeObserver(measureTimeline);
    observer.observe(timeline);
    return () => observer.disconnect();
  }, [isEditingStage]);

  useEffect(() => {
    if (!isPlaying) return;
    let frame = 0;
    const followAudio = () => {
      if (audioRef.current && !timelineScrubbingRef.current) {
        const currentTime = audioRef.current.currentTime;
        positionCapturePlayhead(currentTime);
        setPreviewTime(currentTime);
      }
      frame = window.requestAnimationFrame(followAudio);
    };
    frame = window.requestAnimationFrame(followAudio);
    return () => window.cancelAnimationFrame(frame);
  }, [isPlaying]);

  useEffect(() => {
    const timeline = timelineRef.current;
    if (!timeline || timelineScrubbingRef.current) return;
    const target = previewTime * TIMELINE_PIXELS_PER_SECOND;
    if (Math.abs(timeline.scrollLeft - target) < 1) return;
    timelineSyncingRef.current = true;
    timeline.scrollLeft = target;
    const frame = window.requestAnimationFrame(() => {
      timelineSyncingRef.current = false;
    });
    return () => window.cancelAnimationFrame(frame);
  }, [previewTime]);

  const scrubTimeline = () => {
    const timeline = timelineRef.current;
    if (!timeline) return;
    if (timeline.scrollTop !== 0) timeline.scrollTop = 0;
    if (timelineSyncingRef.current && !timelineScrubbingRef.current) return;
    seekPreview(timeline.scrollLeft / TIMELINE_PIXELS_PER_SECOND);
  };

  const activeCaptionSegment =
    captionSegments.find(
      (segment) =>
        previewTime * 1000 >= segment.startMs &&
        previewTime * 1000 < segment.endMs,
    ) ??
    captionSegments
      .slice()
      .reverse()
      .find((segment) => previewTime * 1000 >= segment.startMs) ??
    captionSegments.at(0);
  const selectedCaptionSegment = captionSegments.find(
    (segment) => segment.id === selectedSegmentId,
  );

  const selectCaptionSegment = (segment: CaptionSegment) => {
    setSelectedSegmentId(segment.id);
    seekPreview(segment.startMs / 1000);
  };

  const updateCaptionSegment = (id: string, text: string) => {
    setCaptionSegments((current) => {
      const next = current.map((segment) =>
        segment.id === id ? { ...segment, text } : segment,
      );
      setTranscript(segmentsToTranscript(next));
      return next;
    });
  };

  const saveVideo = async () => {
    const videoSaveUrl = saveUrl || downloadUrl;
    if (!videoSaveUrl || isSaving) return;
    setError("");
    setIsSaving(true);
    try {
      const response = await fetch(videoSaveUrl);
      if (!response.ok) throw new Error("Could not prepare the download");
      const blob = await response.blob();
      const file = new File([blob], "olog-voice-video.mp4", {
        type: "video/mp4",
      });
      if (
        navigator.share &&
        (!navigator.canShare || navigator.canShare({ files: [file] }))
      ) {
        await navigator.share({
          files: [file],
          title: "My Olog voice video",
        });
        return;
      }
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 30_000);
    } catch (caught) {
      if (caught instanceof DOMException && caught.name === "AbortError")
        return;
      const link = document.createElement("a");
      link.href = videoSaveUrl;
      link.download = "olog-voice-video.mp4";
      document.body.appendChild(link);
      link.click();
      link.remove();
    } finally {
      setIsSaving(false);
    }
  };

  const returnToEditor = () => {
    setError("");
    setIsSaving(false);
    setStage("edit");
  };

  const captureHeading =
    stage === "transcribing"
      ? "Creating your captions"
      : audio
        ? "Your voice note is ready"
        : isRecording
          ? "Recording your thought"
          : "Record or upload a voice note";
  const captureDescription =
    stage === "transcribing"
      ? "Listening to the full recording and matching each word to the audio."
      : audio
        ? "Play it back or make captions when you’re ready."
        : isRecording
          ? "Speak naturally. You can clean up the words next."
          : "Use your microphone or choose an audio file from your device.";

  return (
    <main
      id="main-content"
      className="voice-studio min-h-[100svh] bg-[#f5f0e8] text-[#15233a]"
    >
      <header className="mx-auto flex max-w-7xl items-center justify-between px-[1rem] py-[1rem] sm:px-8 sm:py-5">
        <a
          href="https://ologreader.com"
          className="flex items-center gap-2.5"
          aria-label="Olog Reader home"
        >
          <Image src="/icon.webp" width={52} height={52} alt="" />
          <span className="text-lg font-semibold tracking-[-0.03em]">
            Olog Reader
          </span>
        </a>
        <a
          href="https://ologreader.com"
          className="group flex items-center gap-2 text-sm font-semibold text-[#33425a] transition hover:text-[#007aff]"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Listen to anything
        </a>
      </header>

      <section
        className={`mx-auto grid max-w-7xl gap-[1rem] px-[0.5rem] pb-16 pt-2 sm:gap-7 sm:px-8 sm:pt-7 lg:items-start lg:pt-12 ${isEditingStage ? "lg:grid-cols-1" : "lg:grid-cols-[0.95fr_1.05fr] lg:gap-16"}`}
      >
        <div className={isEditingStage ? "hidden" : "lg:sticky lg:top-10"}>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#15233a]/10 bg-white/55 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[#536078] sm:mb-5">
            <Sparkles className="h-3.5 w-3.5 text-[#ff7a59]" /> Free voice
            captioner
          </div>
          <h1 className="max-w-xl font-serif text-[clamp(3rem,7vw,6.8rem)] font-semibold leading-[0.88] tracking-[-0.065em]">
            Say it.
            <br />
            <span className="text-[#007aff]">Let it travel.</span>
          </h1>
          <p className="mt-4 max-w-lg text-lg leading-relaxed text-[#536078] sm:mt-7 sm:text-xl">
            Turn a voice note into a captioned video people can watch
            anywhere—even with the sound off.
          </p>
          <div className="mt-8 hidden flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-[#536078] sm:flex">
            {["Up to 90 seconds", "Edit every word", "Made for WhatsApp"].map(
              (item) => (
                <span key={item} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#1d9a6c]" /> {item}
                </span>
              ),
            )}
          </div>
        </div>

        <div
          className={`${isEditingStage ? "overflow-visible" : "overflow-hidden"} rounded-[1.25rem] border border-[#15233a]/10 bg-[#fffdf9] shadow-[0_24px_80px_rgba(34,46,68,0.12)] sm:rounded-[2rem]`}
        >
          <div className="relative grid grid-cols-3 items-center border-b border-[#15233a]/8 px-[0.75rem] py-[0.75rem] sm:px-6 sm:py-4">
            <span className="absolute left-[1.875rem] right-[1.875rem] top-1/2 h-px -translate-y-1/2 bg-[#15233a]/10 sm:left-[4.125rem] sm:right-[4.125rem]" />
            {["Record", "Edit", "Download"].map((label, index) => {
              const current =
                stage === "capture"
                  ? 0
                  : stage === "transcribing" ||
                      stage === "edit" ||
                      stage === "rendering"
                    ? 1
                    : 2;
              return (
                <div
                  key={label}
                  className={`relative z-10 ${index === 0 ? "justify-self-start" : index === 1 ? "justify-self-center" : "justify-self-end"}`}
                >
                  <span
                    className={`grid h-[2.25rem] w-[2.25rem] place-items-center rounded-full text-[11px] font-bold shadow-[0_0_0_0.4rem_#fffdf9] ${index <= current ? "bg-[#007aff] text-white" : "bg-[#e8e5df] text-[#7a8290]"}`}
                  >
                    {index < current ? (
                      <Check className="h-3.5 w-3.5" />
                    ) : (
                      index + 1
                    )}
                  </span>
                  <span className="sr-only">{label}</span>
                </div>
              );
            })}
          </div>

          <div className="p-[0.75rem] sm:p-8">
            {(stage === "capture" || stage === "transcribing") && (
              <div>
                <h2 className="text-2xl font-semibold tracking-[-0.035em]">
                  {captureHeading}
                </h2>
                <p className="mt-2 text-[#697386]">{captureDescription}</p>

                {!audio ? (
                  <div className="mt-7 rounded-[1.6rem] border border-dashed border-[#15233a]/20 bg-[#f8f6f1] p-7 text-center sm:p-10">
                    <div className="flex w-full justify-center">
                      <button
                        type="button"
                        onClick={isRecording ? stopRecording : startRecording}
                        className={`group relative grid shrink-0 transform-gpu place-items-center rounded-[2.25rem] border bg-white shadow-[0_18px_34px_rgba(21,35,58,0.16),inset_0_1px_0_rgba(255,255,255,0.9)] transition duration-300 hover:-translate-y-1 hover:rotate-[1deg] hover:shadow-[0_24px_42px_rgba(21,35,58,0.2),inset_0_1px_0_rgba(255,255,255,0.9)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#007aff] ${isRecording ? "recording-ring border-[#ff6b5f]/30" : "border-[#b8d8ff]"}`}
                        style={{
                          width: "7rem",
                          height: "7rem",
                          padding: "0.75rem",
                        }}
                        aria-label={
                          isRecording ? "Finish recording" : "Start recording"
                        }
                      >
                        <span
                          className={`grid transform-gpu place-items-center rounded-[1.45rem] text-white shadow-[0_10px_20px_rgba(0,100,220,0.28),inset_0_1px_0_rgba(255,255,255,0.28)] transition duration-300 group-hover:-translate-y-0.5 group-hover:-rotate-[2deg] group-hover:scale-[1.035] ${isRecording ? "bg-[#ff6b5f]" : "bg-gradient-to-br from-[#1688ff] to-[#0064dc]"}`}
                          style={{ width: "100%", height: "100%" }}
                        >
                          {isRecording ? (
                            <Square className="h-5 w-5 fill-current" />
                          ) : (
                            <Mic className="h-6 w-6" strokeWidth={2.25} />
                          )}
                        </span>
                      </button>
                    </div>
                    <p className="mt-5 font-mono text-3xl font-semibold tabular-nums">
                      {formatTime(elapsed)}
                    </p>
                    <p className="mt-1 text-sm text-[#7a8290]">
                      {isRecording
                        ? "Listening… tap when you’re done"
                        : "Your microphone stays off until you tap"}
                    </p>
                    <p className="mt-4 text-sm font-semibold text-[#15233a]">
                      {isRecording ? "Tap to finish" : "Tap to record"}
                    </p>
                    <div className="my-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#9a9fa8]">
                      <span className="h-px flex-1 bg-[#15233a]/10" />
                      or
                      <span className="h-px flex-1 bg-[#15233a]/10" />
                    </div>
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#15233a]/15 bg-white px-5 py-3 text-sm font-semibold transition hover:border-[#007aff]/40 hover:text-[#007aff]">
                      <Upload className="h-4 w-4" /> Upload a voice note
                      <input
                        type="file"
                        accept=".m4a,.mp4,.mp3,.wav,.aac,.webm,.ogg,audio/*"
                        className="sr-only"
                        onChange={chooseFile}
                      />
                    </label>
                  </div>
                ) : (
                  <div className="mt-7 rounded-[1.6rem] border border-[#15233a]/10 bg-[#f8f6f1] p-5">
                    <audio
                      ref={audioRef}
                      src={audioUrl}
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                      onTimeUpdate={(event) => {
                        const currentTime = event.currentTarget.currentTime;
                        positionCapturePlayhead(currentTime);
                        setPreviewTime(currentTime);
                      }}
                      onSeeked={(event) => {
                        const currentTime = event.currentTarget.currentTime;
                        positionCapturePlayhead(currentTime);
                        setPreviewTime(currentTime);
                      }}
                      onEnded={() => {
                        setIsPlaying(false);
                        setPreviewTime(duration);
                      }}
                    />
                    <div className="flex items-center gap-4">
                      <button
                        onClick={togglePlayback}
                        className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#15233a] text-white"
                        aria-label={isPlaying ? "Pause" : "Play"}
                      >
                        {isPlaying ? (
                          <Pause className="h-5 w-5 fill-current" />
                        ) : (
                          <Play className="ml-0.5 h-5 w-5 fill-current" />
                        )}
                      </button>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <p className="truncate font-semibold">{audioName}</p>
                          <span className="font-mono text-sm tabular-nums text-[#697386]">
                            {formatTime(previewTime)} / {formatTime(duration)}
                          </span>
                        </div>
                        <div
                          className="relative mt-2 h-8 cursor-pointer touch-none"
                          onPointerDown={(event) => {
                            event.currentTarget.setPointerCapture(
                              event.pointerId,
                            );
                            scrubCaptureWaveform(event);
                          }}
                          onPointerMove={(event) => {
                            if (
                              event.currentTarget.hasPointerCapture(
                                event.pointerId,
                              )
                            ) {
                              scrubCaptureWaveform(event);
                            }
                          }}
                          onPointerUp={(event) => {
                            scrubCaptureWaveform(event);
                            event.currentTarget.releasePointerCapture(
                              event.pointerId,
                            );
                          }}
                        >
                          <div
                            className="absolute inset-0 flex items-center gap-1"
                            aria-hidden
                          >
                            {Array.from({ length: 34 }).map((_, index) => {
                              const played =
                                (index + 0.5) / 34 <= capturePlaybackProgress;
                              return (
                                <span
                                  key={index}
                                  className="w-1 flex-1 rounded-full transition-colors duration-100"
                                  style={{
                                    height: `${22 + ((index * 37) % 78)}%`,
                                    backgroundColor: played
                                      ? "#007aff"
                                      : "#9bc9ff",
                                    opacity: played
                                      ? 1
                                      : 0.42 + ((index * 13) % 34) / 100,
                                  }}
                                />
                              );
                            })}
                          </div>
                          <span
                            ref={capturePlayheadRef}
                            className="pointer-events-none absolute bottom-0 top-0 z-10 w-0.5 -translate-x-1/2 rounded-full bg-[#15233a] shadow-[0_0_0_2px_rgba(255,255,255,0.8)] will-change-[left]"
                            style={{
                              left: `${capturePlaybackProgress * 100}%`,
                            }}
                            aria-hidden
                          />
                          <input
                            type="range"
                            min={0}
                            max={Math.max(duration, 0.01)}
                            step={0.01}
                            value={Math.min(previewTime, duration || 0)}
                            onChange={(event) =>
                              seekPreview(Number(event.target.value))
                            }
                            onInput={(event) =>
                              seekPreview(Number(event.currentTarget.value))
                            }
                            className="pointer-events-none absolute inset-0 z-20 h-full w-full opacity-0"
                            aria-label="Audio playback position"
                            aria-valuetext={`${formatTime(previewTime)} of ${formatTime(duration)}`}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mt-5 flex items-center justify-between">
                      <button
                        onClick={reset}
                        className="flex items-center gap-2 text-sm font-semibold text-[#697386] hover:text-[#15233a]"
                      >
                        <RotateCcw className="h-4 w-4" /> Start over
                      </button>
                      <button
                        disabled={stage === "transcribing"}
                        onClick={transcribe}
                        className="flex items-center gap-2 rounded-full bg-[#007aff] px-6 py-3 font-semibold text-white disabled:cursor-wait disabled:opacity-70"
                      >
                        {stage === "transcribing" ? (
                          <>
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/35 border-t-white" />{" "}
                            Transcribing…
                          </>
                        ) : (
                          <>
                            <WandSparkles className="h-4 w-4" /> Make captions
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {(stage === "edit" || stage === "rendering") && (
              <div className="grid min-w-0 gap-[1rem] xl:grid-cols-[minmax(320px,1.18fr)_minmax(0,0.82fr)] xl:gap-7">
                <div className="order-2 min-w-0">
                  <h2 className="text-2xl font-semibold tracking-[-0.035em]">
                    Make it sound like you
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-[#697386]">
                    Fix names or wording. We’ll keep the captions matched to
                    your voice.
                  </p>
                  <div className="mt-5 rounded-2xl border border-[#15233a]/10 bg-white p-4 shadow-sm">
                    <audio
                      ref={audioRef}
                      src={audioUrl}
                      preload="metadata"
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                      onEnded={() => setIsPlaying(false)}
                      onTimeUpdate={(event) =>
                        setPreviewTime(event.currentTarget.currentTime)
                      }
                    />
                    <div className="relative">
                      <div className="relative z-40 flex min-h-[3rem] items-center justify-between">
                        <button
                          type="button"
                          onClick={togglePlayback}
                          className="grid h-12 w-12 shrink-0 place-items-center rounded-[1rem] border border-white/10 bg-[#11161e] text-white shadow-[0_8px_22px_rgba(17,22,30,0.2)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#007aff]"
                          aria-label={
                            isPlaying ? "Pause preview" : "Play preview"
                          }
                        >
                          {isPlaying ? (
                            <Pause className="h-5 w-5 fill-current" />
                          ) : (
                            <Play className="ml-0.5 h-5 w-5 fill-current" />
                          )}
                        </button>
                        <div className="pointer-events-none absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center font-mono font-semibold leading-none tabular-nums">
                          <span className="text-base text-[#15233a]">
                            {formatCaptionTime(previewTime * 1000)}
                          </span>
                          <span className="mt-1 text-xs text-[#8b919d]">
                            {formatCaptionTime(duration * 1000)}
                          </span>
                        </div>
                        <span className="h-11 w-11" aria-hidden="true" />
                      </div>
                      <div className="relative mt-[1rem] h-[9rem] rounded-2xl bg-[#11161e] shadow-inner">
                        <div className="pointer-events-none absolute -top-3 bottom-0 left-1/2 z-50 w-[0.125rem] -translate-x-1/2 rounded-full bg-white shadow-[0_0_0_1px_rgba(17,22,30,0.55)]" />
                        <div
                          ref={timelineRef}
                          role="slider"
                          tabIndex={0}
                          aria-label="Caption timeline"
                          aria-valuemin={0}
                          aria-valuemax={Math.max(
                            0,
                            Math.round(duration * 100),
                          )}
                          aria-valuenow={Math.round(previewTime * 100)}
                          aria-valuetext={`${formatTime(previewTime)} of ${formatTime(duration)}`}
                          onScroll={scrubTimeline}
                          onPointerDown={(event) => {
                            timelineScrubbingRef.current = true;
                            audioRef.current?.pause();
                            timelinePointerRef.current = {
                              id: event.pointerId,
                              startX: event.clientX,
                              startScrollLeft: event.currentTarget.scrollLeft,
                            };
                            event.currentTarget.setPointerCapture(
                              event.pointerId,
                            );
                          }}
                          onPointerMove={(event) => {
                            if (
                              timelinePointerRef.current.id !== event.pointerId
                            )
                              return;
                            event.preventDefault();
                            const nextScrollLeft =
                              timelinePointerRef.current.startScrollLeft +
                              timelinePointerRef.current.startX -
                              event.clientX;
                            event.currentTarget.scrollLeft = nextScrollLeft;
                            seekPreview(
                              event.currentTarget.scrollLeft /
                                TIMELINE_PIXELS_PER_SECOND,
                            );
                          }}
                          onPointerUp={(event) => {
                            timelineScrubbingRef.current = false;
                            timelinePointerRef.current.id = -1;
                            event.currentTarget.releasePointerCapture(
                              event.pointerId,
                            );
                            scrubTimeline();
                          }}
                          onWheel={(event) => {
                            event.preventDefault();
                            audioRef.current?.pause();
                            const delta =
                              Math.abs(event.deltaX) > Math.abs(event.deltaY)
                                ? event.deltaX
                                : event.deltaY;
                            event.currentTarget.scrollLeft += delta;
                            seekPreview(
                              event.currentTarget.scrollLeft /
                                TIMELINE_PIXELS_PER_SECOND,
                            );
                          }}
                          onPointerCancel={(event) => {
                            timelineScrubbingRef.current = false;
                            timelinePointerRef.current.id = -1;
                            if (
                              event.currentTarget.hasPointerCapture(
                                event.pointerId,
                              )
                            ) {
                              event.currentTarget.releasePointerCapture(
                                event.pointerId,
                              );
                            }
                            scrubTimeline();
                          }}
                          onKeyDown={(event) => {
                            if (
                              event.key !== "ArrowLeft" &&
                              event.key !== "ArrowRight"
                            )
                              return;
                            event.preventDefault();
                            seekPreview(
                              previewTime +
                                (event.key === "ArrowRight" ? 1 : -1),
                            );
                          }}
                          className="h-[9rem] cursor-grab overflow-x-auto overflow-y-hidden rounded-2xl bg-[#11161e] overscroll-none outline-none active:cursor-grabbing focus-visible:ring-2 focus-visible:ring-[#8ea0ff] [&::-webkit-scrollbar]:hidden"
                          style={{
                            scrollbarWidth: "none",
                            touchAction: "none",
                          }}
                        >
                          <div
                            className="relative h-[9rem] select-none"
                            style={{
                              width: `${timelineViewportWidth + Math.max(duration, 0) * TIMELINE_PIXELS_PER_SECOND}px`,
                            }}
                          >
                            <div
                              className="absolute inset-y-0"
                              style={{
                                left: `${timelineViewportWidth / 2}px`,
                                width: `${Math.max(duration, 0) * TIMELINE_PIXELS_PER_SECOND}px`,
                              }}
                            >
                              {Array.from(
                                { length: Math.floor(duration) + 1 },
                                (_, second) => (
                                  <span
                                    key={second}
                                    className="absolute top-[0.75rem] -translate-x-1/2"
                                    style={{
                                      left: `${second * TIMELINE_PIXELS_PER_SECOND}px`,
                                    }}
                                  >
                                    <span className="block whitespace-nowrap text-[10px] font-medium leading-none tabular-nums text-[#aeb7c2]">
                                      {second}s
                                    </span>
                                    <span className="mx-auto mt-[0.4rem] block h-[0.35rem] w-[0.2rem] rounded-full bg-[#7f8996]" />
                                  </span>
                                ),
                              )}
                              {Array.from(
                                { length: Math.floor(duration) },
                                (_, second) => (
                                  <span
                                    key={`half-${second}`}
                                    className="absolute top-[0.75rem] h-[1rem] w-[0.2rem] -translate-x-1/2 rounded-full bg-[#626d7a]"
                                    style={{
                                      left: `${(second + 0.5) * TIMELINE_PIXELS_PER_SECOND}px`,
                                    }}
                                  />
                                ),
                              )}
                              <div className="absolute inset-x-0 bottom-[0.5rem] h-[4.5rem] rounded-lg bg-white/[0.05]">
                                {captionSegments.map((segment) => {
                                  const active =
                                    activeCaptionSegment?.id === segment.id;
                                  return (
                                    <button
                                      key={segment.id}
                                      type="button"
                                      onClick={() =>
                                        selectCaptionSegment(segment)
                                      }
                                      className={`absolute inset-y-[0.3rem] truncate rounded-md border px-[0.75rem] text-left text-[14px] font-bold tracking-[-0.01em] transition ${active ? "z-10 border-[#ffd60a] bg-[#5268ff] text-white shadow-[0_0_0_2px_#ffd60a]" : "border-white/10 bg-[#5268ff] text-white/95 hover:bg-[#6175ff]"}`}
                                      style={{
                                        left: `${(segment.startMs / 1000) * TIMELINE_PIXELS_PER_SECOND}px`,
                                        width: `${Math.max(42, ((segment.endMs - segment.startMs) / 1000) * TIMELINE_PIXELS_PER_SECOND - 3)}px`,
                                      }}
                                      title={`${formatCaptionTime(segment.startMs)} ${segment.text}`}
                                    >
                                      {segment.text}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="mt-2 text-xs text-[#8b919d]">
                      Swipe the caption track beneath the playhead, or tap a
                      segment to edit it.
                    </p>
                  </div>
                  <div className="mt-5 overflow-hidden rounded-t-[2rem] rounded-b-2xl bg-[#15191f] text-white shadow-[0_18px_50px_rgba(21,25,31,0.2)]">
                    <div className="mx-auto mt-3 h-1 w-12 rounded-full bg-white/35" />
                    <div className="flex items-center justify-between px-5 pb-3 pt-4">
                      <div>
                        <p className="flex items-center gap-2 text-lg font-semibold">
                          <Captions className="h-4 w-4 text-[#8ea0ff]" /> Edit
                          captions
                        </p>
                        <p className="mt-1 text-xs text-white/45">
                          Tap a segment to seek and correct it.
                        </p>
                      </div>
                      <span className="rounded-full bg-white/8 px-3 py-1.5 text-xs font-semibold text-white/65">
                        {captionSegments.length} segments
                      </span>
                    </div>
                    <div className="max-h-[42svh] overflow-y-auto border-t border-white/8 px-3 py-2">
                      {captionSegments.map((segment) => {
                        const selected =
                          selectedCaptionSegment?.id === segment.id;
                        const active = activeCaptionSegment?.id === segment.id;
                        return (
                          <div
                            key={segment.id}
                            className="relative rounded-xl"
                            aria-current={active ? "true" : undefined}
                          >
                            <div className="relative z-10 grid w-full grid-cols-[3.5rem_1fr] gap-2 px-[0.75rem] py-[0.65rem] text-left sm:px-3 sm:py-3">
                              <button
                                type="button"
                                onClick={() => selectCaptionSegment(segment)}
                                className={`flex items-center gap-1 font-mono text-xs tabular-nums ${active ? "text-[#9aa8ff]" : "text-white/28"}`}
                              >
                                {formatCaptionTime(segment.startMs)}
                              </button>
                              {selected ? (
                                <textarea
                                  autoFocus
                                  ref={(element) => {
                                    if (!element) return;
                                    element.style.height = "auto";
                                    element.style.height = `${element.scrollHeight}px`;
                                  }}
                                  value={segment.text}
                                  onChange={(event) => {
                                    event.currentTarget.style.height = "auto";
                                    event.currentTarget.style.height = `${event.currentTarget.scrollHeight}px`;
                                    updateCaptionSegment(
                                      segment.id,
                                      event.target.value,
                                    );
                                  }}
                                  maxLength={500}
                                  rows={1}
                                  className="m-0 block min-h-[1.25rem] w-full resize-none overflow-hidden border-0 bg-transparent p-0 text-[16px] font-medium leading-[1.25rem] text-white caret-white outline-none sm:text-sm"
                                  aria-label={`Caption at ${formatCaptionTime(segment.startMs)}`}
                                />
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => selectCaptionSegment(segment)}
                                  className="block min-h-[1.25rem] w-full p-0 text-left text-[16px] font-medium leading-[1.25rem] text-white/72 sm:text-sm"
                                >
                                  {segment.text}
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex items-center justify-between border-t border-white/8 px-5 py-3 text-xs text-white/42">
                      <span className="flex items-center gap-1.5">
                        <Clock3 className="h-3.5 w-3.5" /> Synced to your audio
                      </span>
                      <span>{words.length} words</span>
                    </div>
                  </div>
                  <label
                    className="mt-5 block text-xs font-bold uppercase tracking-[0.14em] text-[#697386]"
                    htmlFor="credit"
                  >
                    Name or handle{" "}
                    <span className="normal-case tracking-normal text-[#9a9fa8]">
                      (optional)
                    </span>
                  </label>
                  <div className="mt-2 flex overflow-hidden rounded-xl border border-[#15233a]/12 bg-white transition focus-within:border-[#007aff] focus-within:ring-2 focus-within:ring-[#007aff]/10">
                    <div
                      className="relative grid w-14 shrink-0 place-items-center border-r border-[#15233a]/10"
                      style={{
                        color: socialPlatforms.find(
                          (platform) => platform.value === socialPlatform,
                        )?.color,
                      }}
                    >
                      <SocialIcon
                        platform={socialPlatform}
                        className="h-[1.15rem] w-[1.15rem]"
                      />
                      <select
                        aria-label="Social platform"
                        value={socialPlatform}
                        onChange={(event) =>
                          setSocialPlatform(
                            event.target.value as SocialPlatform,
                          )
                        }
                        className="absolute inset-0 cursor-pointer opacity-0"
                      >
                        {socialPlatforms.map((platform) => (
                          <option key={platform.value} value={platform.value}>
                            {platform.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <input
                      id="credit"
                      value={attribution}
                      onChange={(event) => setAttribution(event.target.value)}
                      maxLength={80}
                      placeholder="e.g. @mayowa"
                      className="min-w-0 flex-1 border-0 bg-transparent px-4 py-3 outline-none"
                    />
                  </div>
                  <p className="mt-5 text-xs font-bold uppercase tracking-[0.14em] text-[#697386]">
                    Format
                  </p>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {ratioLabels.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setRatio(option.value)}
                        className={`rounded-xl border p-3 text-left transition ${ratio === option.value ? "border-[#007aff] bg-[#eaf4ff]" : "border-[#15233a]/10 hover:border-[#15233a]/25"}`}
                      >
                        <span className="block text-sm font-semibold">
                          {option.label}
                        </span>
                        <span className="text-xs text-[#7a8290]">
                          {option.hint}
                        </span>
                      </button>
                    ))}
                  </div>
                  <p className="mt-5 text-xs font-bold uppercase tracking-[0.14em] text-[#697386]">
                    Theme
                  </p>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {themes.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        aria-pressed={theme === option.value}
                        onClick={() => setTheme(option.value)}
                        className={`rounded-xl border p-2 text-left transition ${theme === option.value ? "border-[#007aff] ring-2 ring-[#007aff]/15" : "border-[#15233a]/10 hover:border-[#15233a]/25"}`}
                      >
                        <span
                          className="flex h-14 items-center justify-center rounded-lg"
                          style={{
                            background: `linear-gradient(135deg, ${option.background[0]}, ${option.background[1]})`,
                          }}
                        >
                          <span
                            className="relative h-9 w-16 rounded-md border p-2 shadow-sm"
                            style={{
                              backgroundColor: option.card,
                              borderColor: option.border,
                            }}
                          >
                            <span
                              className="block h-1 w-8 rounded-full"
                              style={{ backgroundColor: option.text }}
                            />
                            <span
                              className="mt-1 block h-1 w-5 rounded-full"
                              style={{ backgroundColor: option.accent }}
                            />
                          </span>
                        </span>
                        <span className="mt-1.5 block px-1 text-xs font-semibold">
                          {option.label}
                        </span>
                      </button>
                    ))}
                  </div>
                  <div className="mt-5 flex items-end justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#697386]">
                        Scene photos{" "}
                        <span className="normal-case">(optional)</span>
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-[#8b919d]">
                        Subjects are cut out on this device. Photos follow your
                        scenes in order.
                      </p>
                    </div>
                    {photos.length < MAX_PHOTOS && (
                      <label className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-[#15233a]/15 bg-white px-3 py-2 text-xs font-semibold hover:border-[#007aff]/40 hover:text-[#007aff]">
                        <ImagePlus className="h-3.5 w-3.5" /> Add
                        <input
                          type="file"
                          accept=".heic,.heif,image/heic,image/heif,image/jpeg,image/png,image/webp"
                          multiple
                          className="sr-only"
                          onChange={choosePhotos}
                        />
                      </label>
                    )}
                  </div>
                  {photos.length > 0 && (
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      {photos.map((photo, index) => (
                        <div
                          key={photo.localId}
                          className="overflow-hidden rounded-xl border border-[#15233a]/10 bg-white"
                        >
                          <div className="relative aspect-[4/3] overflow-hidden bg-[#e9e6df]">
                            <img
                              src={photo.previewUrl}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                            {photo.status === "processing" ? (
                              <span className="absolute inset-0 grid place-items-center bg-[#15233a]/45 text-xs font-semibold text-white backdrop-blur-[1px]">
                                <span className="flex items-center gap-2">
                                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                  {refiningPhotoId === photo.localId
                                    ? "Refining mask…"
                                    : "Finding subject…"}
                                </span>
                              </span>
                            ) : (
                              <span className="absolute left-2 top-2 rounded-full bg-black/55 px-2 py-1 text-[10px] font-bold text-white backdrop-blur-sm">
                                {photo.foreground
                                  ? photo.maskEdited
                                    ? "Mask edited"
                                    : "Subject found"
                                  : "Background only"}
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => removePhoto(photo.localId)}
                              className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-black/55 text-white backdrop-blur-sm"
                              aria-label={`Remove ${photo.name}`}
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <div className="flex items-center justify-between gap-2 px-2 py-1.5">
                            <span className="truncate text-[11px] font-semibold">
                              Scene {index + 1}
                            </span>
                            <span className="flex gap-1">
                              {photo.foreground && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setMaskEditorPhotoId((current) =>
                                      current === photo.localId
                                        ? ""
                                        : photo.localId,
                                    )
                                  }
                                  className="grid h-6 w-6 place-items-center rounded-md border border-[#15233a]/10"
                                  aria-label={`Refine mask for scene ${index + 1}`}
                                  aria-expanded={
                                    maskEditorPhotoId === photo.localId
                                  }
                                >
                                  <SlidersHorizontal className="h-3 w-3" />
                                </button>
                              )}
                              <button
                                type="button"
                                disabled={index === 0}
                                onClick={() => movePhoto(index, -1)}
                                className="grid h-6 w-6 place-items-center rounded-md border border-[#15233a]/10 disabled:opacity-25"
                                aria-label="Move photo earlier"
                              >
                                <ArrowLeft className="h-3 w-3" />
                              </button>
                              <button
                                type="button"
                                disabled={index === photos.length - 1}
                                onClick={() => movePhoto(index, 1)}
                                className="grid h-6 w-6 place-items-center rounded-md border border-[#15233a]/10 disabled:opacity-25"
                                aria-label="Move photo later"
                              >
                                <ArrowRight className="h-3 w-3" />
                              </button>
                            </span>
                          </div>
                          {photo.foreground &&
                            maskEditorPhotoId === photo.localId &&
                            photo.status === "ready" && (
                              <div className="space-y-3 border-t border-[#15233a]/10 px-2.5 py-3">
                                <label className="block text-[10px] font-semibold text-[#536078]">
                                  <span className="mb-1 flex justify-between gap-2">
                                    Subject scale
                                    <span className="font-mono tabular-nums">
                                      {photo.foregroundScale ?? 140}%
                                    </span>
                                  </span>
                                  <input
                                    type="range"
                                    min={110}
                                    max={190}
                                    step={1}
                                    value={photo.foregroundScale ?? 140}
                                    className="w-full accent-[#007aff]"
                                    onChange={(event) => {
                                      const foregroundScale = Number(
                                        event.currentTarget.value,
                                      );
                                      setPhotos((current) =>
                                        current.map((item) =>
                                          item.localId === photo.localId
                                            ? { ...item, foregroundScale }
                                            : item,
                                        ),
                                      );
                                    }}
                                  />
                                </label>
                                <label className="block text-[10px] font-semibold text-[#536078]">
                                  <span className="mb-1 flex justify-between gap-2">
                                    Include more or less
                                    <span className="font-mono tabular-nums">
                                      {photo.maskCoverage > 0 ? "+" : ""}
                                      {photo.maskCoverage}
                                    </span>
                                  </span>
                                  <input
                                    type="range"
                                    min={-20}
                                    max={20}
                                    step={1}
                                    value={photo.maskCoverage}
                                    className="w-full accent-[#007aff]"
                                    onChange={(event) =>
                                      updatePhotoRefinement(
                                        photo.localId,
                                        "maskCoverage",
                                        Number(event.currentTarget.value),
                                      )
                                    }
                                    onPointerUp={(event) =>
                                      void refinePhoto(photo.localId, {
                                        maskCoverage: Number(
                                          event.currentTarget.value,
                                        ),
                                      })
                                    }
                                    onKeyUp={(event) => {
                                      if (
                                        event.key === "ArrowLeft" ||
                                        event.key === "ArrowRight"
                                      ) {
                                        void refinePhoto(photo.localId, {
                                          maskCoverage: Number(
                                            event.currentTarget.value,
                                          ),
                                        });
                                      }
                                    }}
                                  />
                                </label>
                                <label className="block text-[10px] font-semibold text-[#536078]">
                                  <span className="mb-1 flex justify-between gap-2">
                                    Edge softness
                                    <span className="font-mono tabular-nums">
                                      {photo.maskSoftness}
                                    </span>
                                  </span>
                                  <input
                                    type="range"
                                    min={0}
                                    max={20}
                                    step={1}
                                    value={photo.maskSoftness}
                                    className="w-full accent-[#007aff]"
                                    onChange={(event) =>
                                      updatePhotoRefinement(
                                        photo.localId,
                                        "maskSoftness",
                                        Number(event.currentTarget.value),
                                      )
                                    }
                                    onPointerUp={(event) =>
                                      void refinePhoto(photo.localId, {
                                        maskSoftness: Number(
                                          event.currentTarget.value,
                                        ),
                                      })
                                    }
                                    onKeyUp={(event) => {
                                      if (
                                        event.key === "ArrowLeft" ||
                                        event.key === "ArrowRight"
                                      ) {
                                        void refinePhoto(photo.localId, {
                                          maskSoftness: Number(
                                            event.currentTarget.value,
                                          ),
                                        });
                                      }
                                    }}
                                  />
                                </label>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setPaintingPhotoId(photo.localId)
                                  }
                                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#15233a] px-3 py-2 text-[11px] font-semibold text-white"
                                >
                                  <Paintbrush className="h-3.5 w-3.5" /> Paint
                                  mask details
                                </button>
                                {photo.maskEdited && (
                                  <p className="text-[9px] leading-relaxed text-[#8b919d]">
                                    Moving either slider regenerates the
                                    automatic mask and replaces brush edits.
                                  </p>
                                )}
                              </div>
                            )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <VideoCard
                  ratio={ratio}
                  theme={theme}
                  transcript={transcript}
                  attribution={attribution}
                  socialPlatform={socialPlatform}
                  photos={photos.filter((photo) => photo.status === "ready")}
                  activeWordIndex={activeWordIndex}
                  previewTime={previewTime}
                />
                <div className="order-3 flex items-center justify-between gap-4 xl:col-span-2">
                  <button
                    onClick={() => setStage("capture")}
                    className="text-sm font-semibold text-[#697386] hover:text-[#15233a]"
                  >
                    Back
                  </button>
                  <button
                    disabled={
                      !transcript.trim() ||
                      stage === "rendering" ||
                      photos.some((photo) => photo.status === "processing")
                    }
                    onClick={renderVideo}
                    className="flex items-center gap-2 rounded-full bg-[#15233a] px-7 py-3.5 font-semibold text-white transition hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-60"
                  >
                    {stage === "rendering" ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />{" "}
                        Rendering video…
                      </>
                    ) : (
                      <>
                        <WandSparkles className="h-4 w-4" /> Create my video
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {stage === "done" && (
              <div className="py-4 text-center">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#dff6ea] text-[#15845d]">
                  <Check className="h-8 w-8" />
                </div>
                <h2 className="mt-5 text-3xl font-semibold tracking-[-0.04em]">
                  Your voice is ready to travel.
                </h2>
                <p className="mx-auto mt-2 max-w-md text-[#697386]">
                  Download the video, then share it to WhatsApp Status,
                  Instagram, TikTok, or anywhere else.
                </p>
                <video
                  src={downloadUrl}
                  controls
                  playsInline
                  className="mx-auto mt-7 max-h-[520px] max-w-full rounded-2xl bg-black shadow-xl"
                />
                <div className="mt-7 flex flex-wrap justify-center gap-3">
                  <button
                    type="button"
                    onClick={returnToEditor}
                    className="flex items-center gap-2 rounded-full border border-[#15233a]/15 bg-white px-6 py-3.5 font-semibold text-[#15233a] transition hover:border-[#007aff]/40 hover:text-[#007aff]"
                  >
                    <ArrowLeft className="h-4 w-4" /> Back to edit
                  </button>
                  <button
                    type="button"
                    onClick={saveVideo}
                    disabled={isSaving}
                    className="flex items-center gap-2 rounded-full bg-[#007aff] px-7 py-3.5 font-semibold text-white"
                  >
                    {isSaving ? (
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/35 border-t-white" />
                    ) : (
                      <Share2 className="h-4 w-4" />
                    )}
                    {isSaving ? "Preparing…" : "Save or share video"}
                  </button>
                  <button
                    onClick={reset}
                    className="flex items-center gap-2 rounded-full border border-[#15233a]/15 px-6 py-3.5 font-semibold"
                  >
                    <RotateCcw className="h-4 w-4" /> Make another
                  </button>
                </div>
                <a
                  href="https://ologreader.com"
                  className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#007aff]"
                >
                  Like listening? Turn any document into audio with Olog Reader{" "}
                  <ArrowLeft className="h-4 w-4 rotate-180" />
                </a>
              </div>
            )}

            {error && (
              <div
                role="alert"
                className="mt-5 rounded-xl border border-[#d94c4c]/20 bg-[#fff0ee] px-4 py-3 text-sm font-medium text-[#a33232]"
              >
                {error}
              </div>
            )}
          </div>
        </div>
      </section>

      {paintingPhoto?.foregroundUrl && (
        <MaskPainter
          name={paintingPhoto.name}
          sourceUrl={paintingPhoto.previewUrl}
          foregroundUrl={paintingPhoto.foregroundUrl}
          onCancel={() => setPaintingPhotoId("")}
          onSave={(foreground) =>
            savePaintedMask(paintingPhoto.localId, foreground)
          }
        />
      )}

      <footer className="border-t border-[#15233a]/10 px-5 py-7 text-center text-sm text-[#697386]">
        Made by{" "}
        <a
          href="https://ologreader.com"
          className="font-semibold text-[#007aff]"
        >
          Olog Reader
        </a>{" "}
        — turn anything you read into audio.
      </footer>
    </main>
  );
}

function OlogSticker({ theme }: { theme: (typeof themes)[number] }) {
  return (
    <svg
      viewBox="-14 -16 474 116"
      role="img"
      aria-label="ologreader.com"
      className="h-auto w-[58%] max-w-[240px] overflow-visible"
    >
      <defs>
        <filter
          id="previewStickerShadow"
          x="-20%"
          y="-40%"
          width="150%"
          height="190%"
        >
          <feDropShadow
            dx="0"
            dy="4"
            stdDeviation="4"
            floodColor="#003166"
            floodOpacity="0.22"
          />
        </filter>
        <filter
          id="previewStickerEdge"
          x="-12%"
          y="-45%"
          width="125%"
          height="190%"
          colorInterpolationFilters="sRGB"
        >
          <feMorphology
            in="SourceAlpha"
            operator="dilate"
            radius="9"
            result="outerAlpha"
          />
          <feFlood floodColor={theme.stickerOuter} result="outerColor" />
          <feComposite
            in="outerColor"
            in2="outerAlpha"
            operator="in"
            result="outer"
          />
          <feMorphology
            in="SourceAlpha"
            operator="dilate"
            radius="6"
            result="innerAlpha"
          />
          <feFlood floodColor={theme.stickerInner} result="innerColor" />
          <feComposite
            in="innerColor"
            in2="innerAlpha"
            operator="in"
            result="inner"
          />
          <feMerge>
            <feMergeNode in="outer" />
            <feMergeNode in="inner" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <mask
          id="previewLogoMask"
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="176"
          height="78"
          style={{ maskType: "alpha" }}
        >
          <image
            href="/olog-wordmark.png"
            x="0"
            y="0"
            width="176"
            height="78"
            preserveAspectRatio="xMidYMid meet"
          />
        </mask>
      </defs>
      <g filter="url(#previewStickerShadow)">
        <g filter="url(#previewStickerEdge)">
          <rect
            x="0"
            y="0"
            width="176"
            height="78"
            fill={theme.sticker}
            mask="url(#previewLogoMask)"
          />
          <text
            x="180"
            y="61"
            fontFamily="Arial, sans-serif"
            fontSize="46"
            fontWeight="800"
            letterSpacing="-1.6"
            fill={theme.sticker}
          >
            reader.com
          </text>
        </g>
      </g>
    </svg>
  );
}

function VideoCard({
  ratio,
  theme,
  transcript,
  attribution,
  socialPlatform,
  photos,
  activeWordIndex,
  previewTime,
}: {
  ratio: Ratio;
  theme: Theme;
  transcript: string;
  attribution: string;
  socialPlatform: SocialPlatform;
  photos: PhotoAsset[];
  activeWordIndex: number | null;
  previewTime: number;
}) {
  const selectedTheme = themes.find((option) => option.value === theme)!;
  const previewPages = buildPreviewPages(transcript, ratio);
  const pageIndex = Math.max(
    0,
    previewPages.findIndex((page) =>
      activeWordIndex === null
        ? false
        : activeWordIndex >= page[0].index &&
          activeWordIndex <= page[page.length - 1].index,
    ),
  );
  const previewWords = previewPages[pageIndex] ?? [];
  const pageCount = Math.max(1, previewPages.length);
  const photo = photos.length ? photos[pageIndex % photos.length] : undefined;
  const zoomProgress = Math.min(1, Math.max(0, previewTime / 45));
  const easedZoom = 1 - (1 - zoomProgress) ** 3;
  const backgroundScale = 1.035 + easedZoom * 0.055;
  const foregroundScale =
    (photo?.foregroundScale ?? 140) / 100 + easedZoom * 0.12;
  const backgroundX =
    Math.sin(previewTime * 0.22) * 0.9 +
    Math.sin(previewTime * 0.071 + 1.3) * 0.32;
  const backgroundY = Math.cos(previewTime * 0.17 + 0.2) * 0.68;
  const foregroundX =
    -Math.sin(previewTime * 0.19 + 0.45) * 0.42 +
    Math.sin(previewTime * 0.063) * 0.18;
  const foregroundY = Math.sin(previewTime * 0.14 + 0.8) * 0.42;
  const backgroundTransform = `translate3d(${backgroundX}%, ${backgroundY}%, 0) scale(${backgroundScale})`;
  const foregroundTransform = `translate3d(${foregroundX}%, ${foregroundY}%, 0) scale(${foregroundScale})`;
  const captionWords = previewWords.length
    ? previewWords.map((word) => {
        const state =
          activeWordIndex === null || word.index > activeWordIndex
            ? "future"
            : word.index === activeWordIndex
              ? "active"
              : "past";
        return (
          <span
            key={`${word.text}-${word.index}`}
            className="relative inline-block rounded-[0.18em]"
            style={{
              zIndex: photo ? (state === "active" ? 30 : 10) : undefined,
              backgroundColor:
                state === "active" ? selectedTheme.accent : undefined,
              boxShadow:
                state === "active"
                  ? photo
                    ? `0 0 0 0.14em ${selectedTheme.accent}, 0 0.18em 0.45em rgba(0,0,0,0.38)`
                    : `0 0 0 0.14em ${selectedTheme.accent}`
                  : undefined,
              color:
                state === "active"
                  ? selectedTheme.activeText
                  : photo
                    ? "#ffffff"
                    : undefined,
              opacity: state === "past" ? (photo ? 0.62 : 0.3) : 1,
              filter: state === "past" ? "blur(0.2px)" : undefined,
              WebkitTextStroke:
                photo && state !== "active"
                  ? "0.055em rgba(5, 12, 24, 0.96)"
                  : undefined,
              paintOrder: photo ? "stroke fill" : undefined,
              textShadow:
                photo && state !== "active"
                  ? "0 0.1em 0.18em rgba(0,0,0,0.9), 0 0.28em 0.7em rgba(0,0,0,0.72)"
                  : undefined,
            }}
          >
            {word.text}
          </span>
        );
      })
    : "Your words will appear here.";
  const subjectOverlayWords = previewWords.map((word) => {
    const isActive = word.index === activeWordIndex;
    return (
      <span
        key={`subject-overlay-${word.index}`}
        className="inline-block"
        style={{
          color: "#ffffff",
          opacity: isActive ? 0 : 0.24,
          WebkitTextStroke: "0.04em rgba(5, 12, 24, 0.9)",
          paintOrder: "stroke fill",
          textShadow:
            "0 0.1em 0.18em rgba(0,0,0,0.85), 0 0.28em 0.7em rgba(0,0,0,0.65)",
        }}
      >
        {word.text}
      </span>
    );
  });
  return (
    <div
      className={`relative order-1 mx-auto flex w-full max-w-[430px] flex-col justify-center self-start overflow-hidden rounded-[1.8rem] p-5 shadow-[0_18px_55px_rgba(24,50,86,0.16)] transition-colors xl:sticky xl:top-6 ${ratioClasses[ratio]}`}
      style={{
        background: `linear-gradient(135deg, ${selectedTheme.background[0]}, ${selectedTheme.background[1]})`,
      }}
    >
      {photo && (
        <>
          <img
            src={photo.previewUrl}
            alt=""
            className="absolute inset-0 h-full w-full origin-center object-cover will-change-transform"
            style={{ transform: backgroundTransform }}
          />
          <span
            className="absolute inset-0"
            style={{
              backgroundColor: "#07111f",
              opacity: 0.12,
            }}
          />
        </>
      )}
      <span
        className="pointer-events-none absolute -right-20 top-[12%] h-52 w-52 rounded-full opacity-10 blur-sm"
        style={{ backgroundColor: selectedTheme.orbOne }}
      />
      <span
        className="pointer-events-none absolute -bottom-20 -left-16 h-44 w-44 rounded-full opacity-[0.08] blur-sm"
        style={{ backgroundColor: selectedTheme.orbTwo }}
      />
      {pageCount > 1 && (
        <span
          className="absolute right-3 top-3 z-30 rounded-full px-2 py-1 text-[10px] font-bold"
          style={{
            backgroundColor: selectedTheme.card,
            color: selectedTheme.muted,
          }}
        >
          Scene {pageIndex + 1} of {pageCount}
        </span>
      )}
      {photo ? (
        <div className="relative flex min-h-[56%] shrink-0 items-center justify-center px-2 py-8">
          <p className="relative w-full text-center text-[clamp(1.12rem,3.5vw,1.55rem)] font-extrabold leading-[1.18] tracking-[-0.035em]">
            {typeof captionWords === "string"
              ? captionWords
              : captionWords.map((word, index) => (
                  <span key={index}>{word} </span>
                ))}
          </p>
          {photo.foregroundUrl && subjectOverlayWords.length > 0 && (
            <p className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center px-2 py-8 text-center text-[clamp(1.12rem,3.5vw,1.55rem)] font-extrabold leading-[1.18] tracking-[-0.035em]">
              <span className="block w-full">
                {subjectOverlayWords.map((word, index) => (
                  <span key={index}>{word} </span>
                ))}
              </span>
            </p>
          )}
        </div>
      ) : (
        <div
          className={`relative z-10 flex shrink-0 -rotate-[1.5deg] flex-col justify-center rounded-[1.5rem] border-2 px-[1.25rem] py-[2rem] shadow-[0_14px_34px_rgba(0,49,102,0.18)] transition-colors ${previewTextCardClasses[ratio]}`}
          style={{
            backgroundColor: selectedTheme.card,
            borderColor: selectedTheme.border,
            color: selectedTheme.text,
          }}
        >
          <span
            className="absolute left-4 top-2 font-serif text-6xl font-bold leading-none"
            style={{ color: selectedTheme.quote }}
          >
            “
          </span>
          <p className="relative mt-5 text-center text-[clamp(1rem,3.1vw,1.35rem)] font-semibold leading-snug tracking-[-0.025em]">
            {typeof captionWords === "string"
              ? captionWords
              : captionWords.map((word, index) => (
                  <span key={index}>{word} </span>
                ))}
          </p>
        </div>
      )}
      {photo?.foregroundUrl && (
        <img
          src={photo.foregroundUrl}
          alt=""
          className="pointer-events-none absolute inset-0 z-20 h-full w-full origin-center object-cover will-change-transform"
          style={{ transform: foregroundTransform }}
        />
      )}
      <div className="relative z-30 mt-5 flex -rotate-3 flex-col items-center justify-center gap-1">
        <OlogSticker theme={selectedTheme} />
        {attribution && (
          <div
            className="flex min-w-0 max-w-[72%] items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-sm font-bold shadow-[0_5px_12px_rgba(0,49,102,0.16)]"
            style={{
              backgroundColor: selectedTheme.card,
              borderColor: selectedTheme.border,
              color: selectedTheme.muted,
            }}
          >
            {socialPlatform !== "none" && (
              <SocialIcon
                platform={socialPlatform}
                className="shrink-0"
                style={{ width: "1.05rem", height: "1.05rem" }}
              />
            )}
            <span className="truncate">{attribution}</span>
          </div>
        )}
      </div>
    </div>
  );
}
