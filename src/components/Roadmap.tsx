import { FileText, Brain, MessageCircle, GraduationCap } from "lucide-react";

const roadmapItems = [
  {
    icon: FileText,
    title: "EPUB & DOCX Support",
    description: "Expand beyond PDFs to support more document formats",
    status: "Coming Q3 2025",
  },
  {
    icon: Brain,
    title: "AI Summaries",
    description: "Get instant summaries of your documents before listening",
    status: "Coming Q4 2025",
  },
  {
    icon: MessageCircle,
    title: "Chat with Document",
    description: "Ask questions about your documents and get instant answers",
    status: "Coming Q4 2025",
  },
  {
    icon: GraduationCap,
    title: "Quiz Generator",
    description: "Auto-generated quizzes to test your knowledge and retention",
    status: "Coming Q4 2025",
  },
];

export function Roadmap() {
  return (
    <section className="py-16 px-4 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl">What's Coming Next</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We're constantly evolving. Here's what's on our roadmap to make your
            learning experience even better.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {roadmapItems.map((item, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-sm border border-blue-100"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {item.description}
                  </p>
                  <span className="inline-block text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                    {item.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
