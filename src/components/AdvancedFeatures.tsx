import { Gauge, BookOpen, Target, Brain } from "lucide-react";
// App images will be handled via public paths

const features = [
  {
    icon: Gauge,
    title: "Smart Speed Control",
    description: "AI-powered reading speed optimization",
    details: [
      "Variable speed from 0.5x to 3x",
      "Productivity insights and recommendations",
      "Words per minute tracking",
      "Adaptive speed based on content complexity",
    ],
    image: "/home-tab.png",
    stats: "30% productivity boost",
  },
  {
    icon: BookOpen,
    title: "Intelligent Navigation",
    description: "Auto-generated table of contents",
    details: [
      "Instant chapter and section jumping",
      "Smart content structure recognition",
      "Bookmark and note-taking integration",
      "Progress tracking per section",
    ],
    image: "/Screenshot_20250729-135514_olog-reader.jpg",
    stats: "Navigate 10x faster",
  },
];

export function AdvancedFeatures() {
  return (
    <section className="py-16 px-4 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl">Advanced Learning Technology</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Powered by AI to optimize your learning experience. Features that
            adapt to your reading style and content type.
          </p>
        </div>

        <div className="space-y-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`grid lg:grid-cols-2 gap-12 items-center ${
                index % 2 === 1 ? "lg:grid-flow-col-reverse" : ""
              }`}
            >
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl">{feature.title}</h3>
                    <p className="text-blue-600">{feature.description}</p>
                  </div>
                </div>

                <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full inline-block text-sm">
                  <Target className="w-4 h-4 inline mr-2" />
                  {feature.stats}
                </div>

                <div className="space-y-3">
                  {feature.details.map((detail, detailIndex) => (
                    <div
                      key={detailIndex}
                      className="flex items-center space-x-3"
                    >
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 text-xs">✓</span>
                      </div>
                      <span className="text-gray-700">{detail}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100">
                  <div className="flex items-center space-x-3 mb-3">
                    <Brain className="w-5 h-5 text-blue-500" />
                    <span className="text-sm">AI-Powered Insight</span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {index === 0
                      ? "Our AI analyzes your reading patterns and content complexity to suggest optimal speeds, helping you retain more information while saving time."
                      : "Machine learning algorithms automatically identify document structure, creating intelligent navigation that understands your content better than manual bookmarks."}
                  </p>
                </div>
              </div>

              <div className="flex justify-center">
                <div className="relative">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full max-w-sm rounded-2xl shadow-2xl border border-gray-200"
                  />
                  <div className="absolute -top-3 -right-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-3 py-1 rounded-full text-xs shadow-lg">
                    Live Feature
                  </div>
                  <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full opacity-20"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
