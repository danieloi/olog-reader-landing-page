import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

const faqs = [
  {
    question: "Is there an offline mode?",
    answer:
      "Yes! Once you've processed a PDF, you can download the audiobook for offline listening. Perfect for commutes or areas with poor internet connectivity.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Absolutely. Your documents are processed securely and we never store your personal files longer than necessary. We use enterprise-grade encryption and follow strict privacy protocols.",
  },
  {
    question: "Does it support other file types besides PDF?",
    answer:
      "Currently we support PDFs, but EPUB and DOCX support is coming in Q2 2025. We're constantly expanding format compatibility based on user feedback.",
  },
  {
    question: "How natural do the AI voices sound?",
    answer:
      "Our AI voices use advanced neural text-to-speech technology that sounds remarkably natural. You can choose from multiple voice options and adjust speaking speed to your preference.",
  },
  {
    question: "Can I use it on both iOS and Android?",
    answer:
      "Yes! Olog Reader is available on both iOS and Android. Your audiobooks sync across all your devices so you can start listening on one device and continue on another.",
  },
  {
    question: "What happens after my free trial?",
    answer:
      "After your 7-day free trial, you'll be charged $5/month to continue using all features. You can cancel anytime without penalty, and there are no hidden fees or complicated tiers.",
  },
  {
    question: "How long does it take to convert a PDF?",
    answer:
      "Most PDFs are converted to audiobooks in under 30 seconds, depending on length. Our processing is optimized for speed while maintaining high audio quality.",
  },
  {
    question: "Can I share audiobooks with others?",
    answer:
      "Due to copyright considerations, audiobooks created from your personal documents are for your personal use only. However, you can easily create playlists and organize your library.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="py-16 px-4 bg-white">
      <div className="container mx-auto max-w-3xl">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl">Frequently Asked Questions</h2>
          <p className="text-lg text-gray-600">
            Got questions? We've got answers. Can't find what you're looking
            for?
            <a
              href="mailto:support@ologreader.com"
              className="text-orange-500 hover:underline ml-1"
            >
              Contact us
            </a>
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-gray-50 rounded-lg px-6 border-none"
            >
              <AccordionTrigger className="text-left hover:no-underline py-6">
                <span className="text-lg">{faq.question}</span>
              </AccordionTrigger>
              <AccordionContent className="pb-6">
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
