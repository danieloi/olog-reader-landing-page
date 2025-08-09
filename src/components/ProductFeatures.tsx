import { Zap, Smartphone, Volume2, Navigation } from "lucide-react";
import { Button } from "./ui/button";

export function SimpleFeatures() {
  const features = [
    {
      icon: Zap,
      title: "One-tap Upload",
      description:
        "Turn any book, article, or document into an audiobook in minutes.",
    },
    {
      icon: Volume2,
      title: "Perfect Listening",
      description:
        "Crystal clear narration with customizable speed for your reading style.",
    },
    {
      icon: Navigation,
      title: "Smart Navigation",
      description:
        "Jump between chapters, bookmark favorites, and never lose your place.",
    },
    {
      icon: Smartphone,
      title: "Anywhere Access",
      description:
        "Listen while commuting, exercising, or relaxing - your library goes with you.",
    },
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-text-primary mb-4">
            For everyone who loves books
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Whether you're a busy reader, audiobook lover, or just want to
            consume more content - we've made listening effortless.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="text-center group p-6 rounded-2xl border border-gray-100 bg-white shadow-soft hover:shadow-medium hover:-translate-y-1 transition-all"
              >
                <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-100 transition-colors">
                  <Icon className="w-8 h-8 text-primary-500 transition-transform group-hover:scale-110" />
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  {feature.title}
                </h3>
                <p className="text-text-secondary">{feature.description}</p>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        {/* <div className="text-center mt-16">
          <div className="bg-brand-blue-50 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold text-text-primary mb-2">
              Ready to listen to your next great book?
            </h3>
            <p className="text-text-secondary mb-6">
              Join thousands of book lovers who've made the switch to audio.
            </p>
            <Button className="btn-primary px-8 py-3">
              Start Listening Free
            </Button>
          </div>
        </div> */}
      </div>
    </section>
  );
}
