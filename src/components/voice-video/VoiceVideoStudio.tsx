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
  Pause,
  Play,
  RotateCcw,
  Share2,
  Sparkles,
  Square,
  Upload,
  WandSparkles,
  X,
} from "lucide-react";
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { segmentPhoto } from "./subject-segmentation";

type Stage = "capture" | "transcribing" | "edit" | "rendering" | "done";
type Ratio = "story" | "portrait" | "square";
type Theme = "paper" | "midnight" | "sunset" | "sage";
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
  previewUrl: string;
  foregroundUrl?: string;
  background?: Blob;
  foreground?: Blob;
  status: "processing" | "ready";
  remoteId?: string;
};

type UploadSession = {
  uploadId: string;
  accessToken: string;
  uploadUrl: string;
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://api.reader.olog.me/v1";
const MAX_SECONDS = 60;
const MAX_BYTES = 20 * 1024 * 1024;
const MAX_PHOTOS = 6;
const MAX_PHOTO_SOURCE_BYTES = 15 * 1024 * 1024;

const ratioClasses: Record<Ratio, string> = {
  story: "aspect-[9/16] max-h-[68svh] xl:max-h-[760px]",
  portrait: "aspect-[4/5] max-h-[64svh] xl:max-h-[680px]",
  square: "aspect-square max-h-[58svh] xl:max-h-[620px]",
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

  for (const paragraph of paragraphs) {
    const sentences = paragraph
      .split(/(?<=[.!?])\s+/)
      .map((sentence) => sentence.split(/\s+/).filter(Boolean))
      .filter((sentence) => sentence.length);
    const units = sentences.flatMap((sentence) => {
      if (sentence.length <= limit) return [sentence];
      const chunks: string[][] = [];
      for (let index = 0; index < sentence.length; index += limit) {
        chunks.push(sentence.slice(index, index + limit));
      }
      return chunks;
    });
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
      pages.push(
        allTokens.slice(globalCursor, globalCursor + pageWords.length),
      );
      globalCursor += pageWords.length;
    }
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
    .join("\n\n");
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
  const [session, setSession] = useState<UploadSession | null>(null);
  const [ratio, setRatio] = useState<Ratio>("story");
  const [theme, setTheme] = useState<Theme>("paper");
  const [photos, setPhotos] = useState<PhotoAsset[]>([]);
  const [attribution, setAttribution] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [saveUrl, setSaveUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
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
      setError("That recording is over 20 MB. Choose a clip under one minute.");
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
          setError("Keep it to 60 seconds so it fits a WhatsApp Status.");
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
    if (audioRef.current.paused) await audioRef.current.play();
    else audioRef.current.pause();
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
      setSelectedSegmentId(nextSegments[0]?.id ?? "");
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
      (file) =>
        ["image/jpeg", "image/png", "image/webp"].includes(file.type) &&
        file.size <= MAX_PHOTO_SOURCE_BYTES,
    );
    if (requested.length > available) {
      setError("Only the available photo slots were added.");
    } else if (valid.length !== selected.length) {
      setError("Use JPG, PNG, or WebP photos under 15 MB each.");
    } else {
      setError("");
    }
    const queued = valid.map((file) => ({
      file,
      asset: {
        localId: crypto.randomUUID(),
        name: file.name,
        previewUrl: URL.createObjectURL(file),
        status: "processing" as const,
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

  const uploadPhotos = async (activeSession: UploadSession) => {
    const visuals: Array<{ imageId: string; segmented: boolean }> = [];
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
      visuals.push({ imageId, segmented: Boolean(photo.foreground) });
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
    for (const photo of photosRef.current) {
      URL.revokeObjectURL(photo.previewUrl);
      if (photo.foregroundUrl) URL.revokeObjectURL(photo.foregroundUrl);
    }
    setPhotos([]);
  };

  const words = transcript.trim().split(/\s+/).filter(Boolean);
  const isEditingStage = stage === "edit" || stage === "rendering";
  const previewMarks = useMemo(
    () => alignPreviewWords(transcript, speechMarks, duration * 1000),
    [duration, speechMarks, transcript],
  );
  let activeWordIndex: number | null = null;
  for (const mark of previewMarks) {
    if (mark.time > previewTime * 1000) break;
    activeWordIndex = mark.wordIndex;
  }

  const seekPreview = (seconds: number) => {
    setPreviewTime(seconds);
    if (audioRef.current) audioRef.current.currentTime = seconds;
  };

  const activeCaptionSegment =
    captionSegments.find(
      (segment) =>
        previewTime * 1000 >= segment.startMs &&
        previewTime * 1000 < segment.endMs,
    ) ?? captionSegments.at(-1);
  const selectedCaptionSegment =
    captionSegments.find((segment) => segment.id === selectedSegmentId) ??
    activeCaptionSegment;

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

  return (
    <main
      id="main-content"
      className="voice-studio min-h-[100svh] bg-[#f5f0e8] text-[#15233a]"
    >
      <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
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
        className={`mx-auto grid max-w-7xl gap-7 px-5 pb-16 pt-2 sm:px-8 sm:pt-7 lg:items-start lg:pt-12 ${isEditingStage ? "lg:grid-cols-1" : "lg:grid-cols-[0.95fr_1.05fr] lg:gap-16"}`}
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
            {["Up to 60 seconds", "Edit every word", "Made for WhatsApp"].map(
              (item) => (
                <span key={item} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#1d9a6c]" /> {item}
                </span>
              ),
            )}
          </div>
        </div>

        <div
          className={`${isEditingStage ? "overflow-visible" : "overflow-hidden"} rounded-[2rem] border border-[#15233a]/10 bg-[#fffdf9] shadow-[0_24px_80px_rgba(34,46,68,0.12)]`}
        >
          <div className="flex items-center gap-2 border-b border-[#15233a]/8 px-6 py-4">
            {["Record", "Edit", "Download"].map((label, index) => {
              const current =
                stage === "capture" || stage === "transcribing"
                  ? 0
                  : stage === "edit" || stage === "rendering"
                    ? 1
                    : 2;
              return (
                <div
                  key={label}
                  className="flex min-w-0 flex-1 items-center gap-2"
                >
                  <span
                    className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-bold ${index <= current ? "bg-[#007aff] text-white" : "bg-[#e8e5df] text-[#7a8290]"}`}
                  >
                    {index < current ? (
                      <Check className="h-3.5 w-3.5" />
                    ) : (
                      index + 1
                    )}
                  </span>
                  <span
                    className={`hidden text-xs font-bold uppercase tracking-[0.12em] sm:block ${index <= current ? "text-[#15233a]" : "text-[#9a9fa8]"}`}
                  >
                    {label}
                  </span>
                  {index < 2 && (
                    <span className="ml-auto h-px flex-1 bg-[#15233a]/10" />
                  )}
                </div>
              );
            })}
          </div>

          <div className="p-5 sm:p-8">
            {(stage === "capture" || stage === "transcribing") && (
              <div>
                <h2 className="text-2xl font-semibold tracking-[-0.035em]">
                  Record your thought
                </h2>
                <p className="mt-2 text-[#697386]">
                  Speak naturally. You can clean up the words next.
                </p>

                {!audio ? (
                  <div className="mt-7 rounded-[1.6rem] border border-dashed border-[#15233a]/20 bg-[#f8f6f1] p-7 text-center sm:p-10">
                    <div
                      className={`mx-auto grid h-24 w-24 place-items-center rounded-full transition ${isRecording ? "recording-ring bg-[#ff6b5f] text-white" : "bg-[#15233a] text-white"}`}
                    >
                      {isRecording ? (
                        <Square className="h-8 w-8 fill-current" />
                      ) : (
                        <Mic className="h-9 w-9" />
                      )}
                    </div>
                    <p className="mt-5 font-mono text-3xl font-semibold tabular-nums">
                      {formatTime(elapsed)}
                    </p>
                    <p className="mt-1 text-sm text-[#7a8290]">
                      {isRecording
                        ? "Listening… tap when you’re done"
                        : "Your microphone stays off until you tap"}
                    </p>
                    <button
                      onClick={isRecording ? stopRecording : startRecording}
                      className="mt-6 rounded-full bg-[#007aff] px-7 py-3.5 font-semibold text-white shadow-[0_8px_24px_rgba(0,122,255,0.25)] transition hover:-translate-y-0.5 hover:bg-[#0068d9]"
                    >
                      {isRecording ? "Finish recording" : "Start recording"}
                    </button>
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
                      onEnded={() => setIsPlaying(false)}
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
                          <span className="font-mono text-sm text-[#697386]">
                            {formatTime(duration)}
                          </span>
                        </div>
                        <div
                          className="mt-2 flex h-7 items-center gap-1"
                          aria-hidden
                        >
                          {Array.from({ length: 34 }).map((_, index) => (
                            <span
                              key={index}
                              className="w-1 flex-1 rounded-full bg-[#6aaeff]"
                              style={{
                                height: `${22 + ((index * 37) % 78)}%`,
                                opacity: 0.45 + ((index * 13) % 50) / 100,
                              }}
                            />
                          ))}
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
              <div className="grid min-w-0 gap-7 xl:grid-cols-[minmax(320px,1.18fr)_minmax(0,0.82fr)]">
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
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={togglePlayback}
                        className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#007aff] text-white shadow-[0_6px_18px_rgba(0,122,255,0.24)]"
                        aria-label={
                          isPlaying ? "Pause preview" : "Play preview"
                        }
                      >
                        {isPlaying ? (
                          <Pause className="h-4 w-4" fill="currentColor" />
                        ) : (
                          <Play
                            className="ml-0.5 h-4 w-4"
                            fill="currentColor"
                          />
                        )}
                      </button>
                      <div className="min-w-0 flex-1">
                        <div className="mb-1.5 flex items-center justify-between text-xs font-semibold tabular-nums text-[#697386]">
                          <span>{formatTime(previewTime)}</span>
                          <span>{formatTime(duration)}</span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={Math.max(duration, 0.01)}
                          step={0.01}
                          value={Math.min(previewTime, duration || 0)}
                          onChange={(event) =>
                            seekPreview(Number(event.target.value))
                          }
                          className="w-full accent-[#007aff]"
                          aria-label="Preview timestamp"
                        />
                      </div>
                    </div>
                    <p className="mt-2 text-xs text-[#8b919d]">
                      Play or scrub to see the exact caption frame while you
                      edit.
                    </p>
                    <div className="mt-4 overflow-x-auto pb-1">
                      <div className="relative flex min-w-[680px] gap-1.5 border-y border-[#15233a]/8 py-3">
                        <span
                          className="pointer-events-none absolute bottom-1 top-1 z-20 w-0.5 rounded-full bg-[#15233a] shadow-[0_0_0_2px_white]"
                          style={{
                            left: `${Math.min(100, Math.max(0, (previewTime / Math.max(duration, 0.01)) * 100))}%`,
                          }}
                        />
                        {captionSegments.map((segment) => (
                          <button
                            key={segment.id}
                            type="button"
                            onClick={() => selectCaptionSegment(segment)}
                            className={`min-w-24 flex-1 truncate rounded-lg px-3 py-2 text-left text-[11px] font-semibold transition ${activeCaptionSegment?.id === segment.id ? "bg-[#5168ff] text-white" : "bg-[#e8ebff] text-[#34405a] hover:bg-[#dce1ff]"}`}
                            style={{
                              flexGrow: Math.max(
                                1,
                                segment.endMs - segment.startMs,
                              ),
                            }}
                            title={segment.text}
                          >
                            {segment.text}
                          </button>
                        ))}
                      </div>
                    </div>
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
                            className={`rounded-xl transition ${active ? "bg-white/[0.07]" : ""}`}
                          >
                            <button
                              type="button"
                              onClick={() => selectCaptionSegment(segment)}
                              className="grid w-full grid-cols-[3.5rem_1fr] gap-2 px-3 py-3 text-left"
                            >
                              <span
                                className={`flex items-center gap-1 font-mono text-xs tabular-nums ${active ? "text-[#9aa8ff]" : "text-white/28"}`}
                              >
                                {formatCaptionTime(segment.startMs)}
                              </span>
                              <span
                                className={`text-sm font-medium leading-snug ${active ? "text-white" : "text-white/52"}`}
                              >
                                {segment.text}
                              </span>
                            </button>
                            {selected && (
                              <div className="px-3 pb-3 pl-[4.9rem]">
                                <textarea
                                  autoFocus
                                  value={segment.text}
                                  onChange={(event) =>
                                    updateCaptionSegment(
                                      segment.id,
                                      event.target.value,
                                    )
                                  }
                                  maxLength={500}
                                  rows={2}
                                  className="w-full resize-none rounded-xl border border-[#7e8cff]/55 bg-[#20252d] px-3 py-2 text-sm leading-relaxed text-white outline-none ring-4 ring-[#6574ff]/10"
                                  aria-label={`Caption at ${formatCaptionTime(segment.startMs)}`}
                                />
                              </div>
                            )}
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
                  <input
                    id="credit"
                    value={attribution}
                    onChange={(event) => setAttribution(event.target.value)}
                    maxLength={80}
                    placeholder="e.g. @mayowa"
                    className="mt-2 w-full rounded-xl border border-[#15233a]/12 bg-white px-4 py-3 outline-none focus:border-[#007aff]"
                  />
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
                          accept="image/jpeg,image/png,image/webp"
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
                                  Finding subject…
                                </span>
                              </span>
                            ) : (
                              <span className="absolute left-2 top-2 rounded-full bg-black/55 px-2 py-1 text-[10px] font-bold text-white backdrop-blur-sm">
                                {photo.foreground
                                  ? "Subject found"
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
                  photos={photos.filter((photo) => photo.status === "ready")}
                  activeWordIndex={activeWordIndex}
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
  photos,
  activeWordIndex,
}: {
  ratio: Ratio;
  theme: Theme;
  transcript: string;
  attribution: string;
  photos: PhotoAsset[];
  activeWordIndex: number | null;
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
            className="absolute inset-0 h-full w-full scale-[1.04] object-cover"
          />
          <span
            className="absolute inset-0"
            style={{
              backgroundColor: selectedTheme.background[0],
              opacity: 0.2,
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
      <div
        className="relative z-10 -rotate-[1.5deg] rounded-[1.5rem] border-2 px-5 py-8 shadow-[0_14px_34px_rgba(0,49,102,0.18)] transition-colors"
        style={{
          backgroundColor: selectedTheme.card,
          borderColor: selectedTheme.border,
          color: selectedTheme.text,
          opacity: photo ? 0.88 : 1,
        }}
      >
        <span
          className="absolute left-4 top-2 font-serif text-6xl font-bold leading-none"
          style={{ color: selectedTheme.quote }}
        >
          “
        </span>
        <p className="relative mt-5 text-center text-[clamp(1rem,3.1vw,1.35rem)] font-semibold leading-snug tracking-[-0.025em]">
          {previewWords.length
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
                    className={
                      state === "active" ? "rounded-md px-1 py-0.5" : ""
                    }
                    style={{
                      backgroundColor:
                        state === "active" ? selectedTheme.accent : undefined,
                      color:
                        state === "active"
                          ? selectedTheme.activeText
                          : undefined,
                      opacity: state === "past" ? 0.3 : 1,
                      filter: state === "past" ? "blur(0.2px)" : undefined,
                    }}
                  >
                    {word.text}{" "}
                  </span>
                );
              })
            : "Your words will appear here."}
        </p>
        {attribution && (
          <p
            className="mt-5 border-t pt-3 text-sm font-semibold"
            style={{
              borderColor: selectedTheme.border,
              color: selectedTheme.muted,
            }}
          >
            {attribution}
          </p>
        )}
      </div>
      {photo?.foregroundUrl && (
        <img
          src={photo.foregroundUrl}
          alt=""
          className="pointer-events-none absolute inset-0 z-20 h-full w-full scale-[1.04] object-cover"
        />
      )}
      <div className="relative z-30 mt-5 flex -rotate-3 justify-center">
        <OlogSticker theme={selectedTheme} />
      </div>
    </div>
  );
}
