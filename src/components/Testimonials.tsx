import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Medical Student",
    image:
      "https://images.unsplash.com/photo-1494790108755-2616b612b74c?w=128&h=128&fit=crop&crop=face",
    quote:
      "Olog Reader saves me 3+ hours daily. I listen to medical textbooks during my commute and retain everything better.",
  },
  {
    name: "Michael Rodriguez",
    role: "Business Analyst",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128&h=128&fit=crop&crop=face",
    quote:
      "Game-changer for consuming research papers. The AI voice is so natural, I forget I'm not listening to an audiobook.",
  },
  {
    name: "Dr. Amara Okafor",
    role: "Professor",
    image:
      "https://images.unsplash.com/photo-1594824111215-0ffbffd2b9f0?w=128&h=128&fit=crop&crop=face",
    quote:
      "Perfect for students with dyslexia. The visual-audio combination dramatically improves comprehension and focus.",
  },
];

export function Testimonials() {
  return (
    <section className="py-16 px-4 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto">
        <div className="text-center space-y-6 mb-16">
          <h2 className="text-h2 md:text-[2.5rem]">Loved by Learners</h2>
          <p className="text-body text-gray-600 max-w-2xl mx-auto">
            See how Olog Reader is transforming the way people learn and consume
            content.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Stars */}
              <div className="flex space-x-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-body text-gray-600 leading-relaxed mb-6">
                "{testimonial.quote}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center space-x-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-medium text-gray-900">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
