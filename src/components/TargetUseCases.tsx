import { GraduationCap, Briefcase, Eye, BookOpen } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const useCases = [
  {
    icon: GraduationCap,
    title: "Students",
    description:
      "Transform textbooks and research papers into audio for study sessions on-the-go.",
    image:
      "https://images.unsplash.com/photo-1550246520-56dedb9b4a1e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxzdHVkZW50JTIwc3R1ZHlpbmclMjBjb21tdXRlfGVufDF8fHx8MTc1NDQwMjEwM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    icon: Briefcase,
    title: "Busy Professionals",
    description:
      "Listen to reports, contracts, and industry documents during commutes or workouts.",
    image:
      "https://images.unsplash.com/photo-1633369930096-d78e5108c29d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBjb21tdXRpbmclMjB0cmFpbnxlbnwxfHx8fDE3NTQ0MDIxMTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    icon: Eye,
    title: "Accessibility Needs",
    description:
      "Support for visual impairments, dyslexia, and attention challenges through multi-modal learning.",
    image:
      "https://images.unsplash.com/photo-1584160390777-01f8d88f98c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhcHAlMjBhdWRpb2Jvb2slMjBoZWFkcGhvbmVzfGVufDF8fHx8MTc1NDQwMjA5N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    icon: BookOpen,
    title: "Book Lovers",
    description:
      "Turn any PDF book or document into a personalized audiobook library.",
    image:
      "https://images.unsplash.com/photo-1593501695590-e441e6170c2e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxQREYlMjBkb2N1bWVudCUyMG1vYmlsZSUyMHBob25lfGVufDF8fHx8MTc1NDQwMjEwOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
];

export function TargetUseCases() {
  return (
    <section className="py-16 px-4 bg-gradient-to-br from-green-50 to-teal-50">
      <div className="container mx-auto">
        <div className="text-center space-y-6 mb-16">
          <h2 className="text-h2 md:text-[2.5rem]">Perfect For Everyone</h2>
          <p className="text-body text-gray-600 max-w-2xl mx-auto">
            Whether you're studying, working, or just love learning, Olog Reader
            fits seamlessly into your lifestyle.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {useCases.map((useCase, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="h-48 overflow-hidden">
                <ImageWithFallback
                  src={useCase.image}
                  alt={useCase.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8 space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
                    <useCase.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-medium">{useCase.title}</h3>
                </div>
                <p className="text-body text-gray-600 leading-relaxed">
                  {useCase.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
