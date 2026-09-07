"use client";

/* eslint-disable @next/next/no-img-element */

import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Download,
  Mic,
  ImagePlus,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Square,
  Upload,
  WandSparkles,
  X,
} from "lucide-react";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { segmentPhoto } from "./subject-segmentation";

type Stage = "capture" | "transcribing" | "edit" | "rendering" | "done";
type Ratio = "story" | "portrait" | "square";
type Theme = "paper" | "midnight" | "sunset" | "sage";
type SpeechMark = { time: number; value: string };
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
  story: "aspect-[9/16] max-h-[610px]",
  portrait: "aspect-[4/5] max-h-[560px]",
  square: "aspect-square max-h-[520px]",
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
  quote: string;
  sticker: string;
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
    quote: "#85BFFF",
    sticker: "#003166",
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
    quote: "#5274AA",
    sticker: "#D7E7FF",
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
    quote: "#F2A184",
    sticker: "#762D52",
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
    quote: "#8EB497",
    sticker: "#214D3D",
  },
];

function buildPreviewPages(text: string, ratio: Ratio) {
  const limit = ratio === "square" ? 20 : ratio === "portrait" ? 26 : 34;
  const paragraphs = text
    .trim()
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
  const pages: string[][] = [];

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
        pages.push(pageWords);
        pageWords = [];
      }
      pageWords.push(...unit);
    }
    if (pageWords.length) pages.push(pageWords);
  }

  return pages;
}

function formatTime(seconds: number) {
  return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
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
  const [session, setSession] = useState<UploadSession | null>(null);
  const [ratio, setRatio] = useState<Ratio>("story");
  const [theme, setTheme] = useState<Theme>("paper");
  const [photos, setPhotos] = useState<PhotoAsset[]>([]);
  const [attribution, setAttribution] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
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
      setTranscript(result.transcript);
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
        };
        if (status.status === "completed" && status.downloadUrl) {
          setDownloadUrl(status.downloadUrl);
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
    setStage("capture");
    setAudio(null);
    setTranscript("");
    setSession(null);
    setDownloadUrl("");
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

      <section className="mx-auto grid max-w-7xl gap-7 px-5 pb-16 pt-2 sm:px-8 sm:pt-7 lg:grid-cols-[0.95fr_1.05fr] lg:items-start lg:gap-16 lg:pt-12">
        <div className="lg:sticky lg:top-10">
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

        <div className="overflow-hidden rounded-[2rem] border border-[#15233a]/10 bg-[#fffdf9] shadow-[0_24px_80px_rgba(34,46,68,0.12)]">
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
                        accept="audio/*"
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
              <div className="grid gap-7 xl:grid-cols-[1fr_0.86fr]">
                <div>
                  <h2 className="text-2xl font-semibold tracking-[-0.035em]">
                    Make it sound like you
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-[#697386]">
                    Fix names or wording. We’ll keep the captions matched to
                    your voice.
                  </p>
                  <label
                    className="mt-6 block text-xs font-bold uppercase tracking-[0.14em] text-[#697386]"
                    htmlFor="transcript"
                  >
                    Transcript
                  </label>
                  <textarea
                    id="transcript"
                    value={transcript}
                    onChange={(event) => setTranscript(event.target.value)}
                    maxLength={5000}
                    className="mt-2 min-h-48 w-full resize-y rounded-2xl border border-[#15233a]/12 bg-[#f8f6f1] p-4 text-lg leading-relaxed outline-none transition focus:border-[#007aff] focus:ring-4 focus:ring-[#007aff]/10"
                  />
                  <div className="mt-2 flex justify-between text-xs text-[#8b919d]">
                    <span>{words.length} words</span>
                    <span>Paragraph breaks become separate scenes.</span>
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
                  photo={photos.find((photo) => photo.status === "ready")}
                />
                <div className="flex items-center justify-between gap-4 xl:col-span-2">
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
                  <a
                    href={downloadUrl}
                    download="olog-voice-video.mp4"
                    className="flex items-center gap-2 rounded-full bg-[#007aff] px-7 py-3.5 font-semibold text-white"
                  >
                    <Download className="h-4 w-4" /> Download video
                  </a>
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

function VideoCard({
  ratio,
  theme,
  transcript,
  attribution,
  photo,
}: {
  ratio: Ratio;
  theme: Theme;
  transcript: string;
  attribution: string;
  photo?: PhotoAsset;
}) {
  const selectedTheme = themes.find((option) => option.value === theme)!;
  const previewPages = buildPreviewPages(transcript, ratio);
  const previewWords = previewPages[0] ?? [];
  const pageCount = Math.max(1, previewPages.length);
  return (
    <div
      className={`relative mx-auto flex w-full max-w-[310px] flex-col justify-center overflow-hidden rounded-[1.8rem] p-5 shadow-[0_18px_55px_rgba(24,50,86,0.16)] transition-colors ${ratioClasses[ratio]}`}
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
      {pageCount > 1 && (
        <span
          className="absolute right-3 top-3 z-30 rounded-full px-2 py-1 text-[10px] font-bold"
          style={{
            backgroundColor: selectedTheme.card,
            color: selectedTheme.muted,
          }}
        >
          Page 1 of {pageCount}
        </span>
      )}
      <div
        className="relative z-10 -rotate-1 rounded-[1.5rem] border-2 px-5 py-8 shadow-[0_12px_30px_rgba(0,72,150,0.14)] transition-colors"
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
            ? previewWords.map((word, index) => (
                <span
                  key={`${word}-${index}`}
                  className={index === 2 ? "rounded px-1 text-white" : ""}
                  style={
                    index === 2
                      ? { backgroundColor: selectedTheme.accent }
                      : undefined
                  }
                >
                  {word}{" "}
                </span>
              ))
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
      <div
        className="relative z-30 mt-5 self-center -rotate-3 rounded-lg border-4 border-white px-3 py-1.5 text-xs font-extrabold shadow-md"
        style={{
          backgroundColor: selectedTheme.sticker,
          color: theme === "midnight" ? "#14213D" : "#FFFFFF",
        }}
      >
        ologreader.com
      </div>
    </div>
  );
}
