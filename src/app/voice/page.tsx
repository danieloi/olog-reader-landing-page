import type { Metadata } from "next";
import { VoiceVideoStudio } from "@/components/voice-video/VoiceVideoStudio";

export const metadata: Metadata = {
  title: "Voice to captioned video",
  description:
    "Record a thought, fix the transcript, and turn it into a captioned video for WhatsApp Status, Instagram, TikTok, and more.",
  alternates: { canonical: "https://voice.ologreader.com" },
  openGraph: {
    title: "Turn your voice into a video — Olog Reader",
    description:
      "Free captions for voice notes. Record, edit, and download a share-ready video.",
    url: "https://voice.ologreader.com",
  },
};

export default function VoiceVideoPage() {
  return <VoiceVideoStudio />;
}
