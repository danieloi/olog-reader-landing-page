import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Redeem Your Gift Code - Olog Reader",
  description:
    "You've received a gift! Download Olog Reader to redeem your Premium subscription.",
  openGraph: {
    title: "Redeem Your Gift Code - Olog Reader",
    description:
      "You've received a gift! Download Olog Reader to redeem your Premium subscription.",
    images: [
      {
        url: "/LinkPreview.png",
        width: 1200,
        height: 630,
        alt: "Olog Reader - Redeem your gift code",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Redeem Your Gift Code - Olog Reader",
    description:
      "You've received a gift! Download Olog Reader to redeem your Premium subscription.",
    images: ["/LinkPreview.png"],
  },
};

export default function RedeemLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
