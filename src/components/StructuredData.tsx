import { faqs } from "@/data/faqs";

const SITE_URL = "https://ologreader.com";

/**
 * JSON-LD structured data for SEO rich results and AEO (answer-engine
 * extraction). Rendered once in the root layout. Three graphs:
 *   - Organization      → knowledge panel + sameAs social profiles
 *   - SoftwareApplication → app rich result (platforms, price, links)
 *   - FAQPage           → FAQ rich result, sourced from the shared faqs[]
 *
 * To enable star-rating rich results later, add an `aggregateRating`
 * block to the SoftwareApplication using REAL App Store / Play Store
 * numbers (Google penalizes fabricated ratings):
 *   aggregateRating: {
 *     "@type": "AggregateRating",
 *     ratingValue: "4.9",
 *     ratingCount: "1234",
 *   }
 */
export default function StructuredData() {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: "Olog Reader",
    url: SITE_URL,
    logo: `${SITE_URL}/icon.png`,
    email: "contact@olog.me",
    sameAs: [
      "https://x.com/OlogReader",
      "https://instagram.com/ologreader",
      "https://www.linkedin.com/company/olog-me/",
    ],
  };

  const softwareApplication = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${SITE_URL}/#app`,
    name: "Olog Reader",
    applicationCategory: "ProductivityApplication",
    operatingSystem: "iOS, Android",
    description:
      "Olog Reader is an AI reading assistant that turns PDFs, EPUBs, Word docs, PowerPoint, web links, and scans into natural-sounding audio with real-time word highlighting, speed control, offline voices, and cross-device sync.",
    url: SITE_URL,
    image: `${SITE_URL}/LinkPreview.webp`,
    publisher: { "@id": `${SITE_URL}/#organization` },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      description: "Free tier with generous usage; premium plans from $4.99/month.",
    },
    downloadUrl: [
      "https://apps.apple.com/app/id6744651101",
      "https://play.google.com/store/apps/details?id=me.olog.reader",
    ],
  };

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${SITE_URL}/#faq`,
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const graphs = [organization, softwareApplication, faqPage];

  return (
    <>
      {graphs.map((graph, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
        />
      ))}
    </>
  );
}
