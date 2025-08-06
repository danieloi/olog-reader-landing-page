"use client";
import { useState, useEffect, useRef } from "react";
import { Upload, Zap, Headphones, BookOpen } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Upload",
    description:
      "Simply select your PDF from phone storage or cloud services. No file size limits.",
  },
  {
    icon: Zap,
    title: "AI Analysis",
    description:
      "Our advanced AI processes the text and converts it to natural speech in seconds.",
  },
  {
    icon: Headphones,
    title: "Listen",
    description:
      "Press play and enjoy your personalized audiobook with professional narration.",
  },
  {
    icon: BookOpen,
    title: "Learn More",
    description:
      "Track progress, take notes, and absorb content while multitasking.",
  },
];

export function HowItWorks() {
  const [visibleSteps, setVisibleSteps] = useState<number[]>([]);
  const [focusedStep, setFocusedStep] = useState<number | null>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers = stepRefs.current.map((ref, index) => {
      if (!ref) return null;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleSteps((prev) =>
              prev.includes(index) ? prev : [...prev, index]
            );
            setFocusedStep(index);
          }
        },
        { threshold: 0.6 }
      );

      observer.observe(ref);
      return observer;
    });

    return () => {
      observers.forEach((observer) => observer?.disconnect());
    };
  }, []);

  return (
    <section id="how-it-works" className="py-16 px-4 bg-gray-50">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center space-y-6 mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl">How It Works</h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            From PDF to audiobook in four simple steps
          </p>
        </div>

        <div className="relative">
          {/* Vertical timeline line - hidden on mobile, visible on desktop */}
          <div className="hidden md:block absolute left-8 top-8 bottom-8 w-1 bg-gray-200">
            <div
              className="w-full bg-blue-600 transition-all duration-1000 ease-out"
              style={{
                height: `${(visibleSteps.length / steps.length) * 100}%`,
              }}
              aria-hidden="true"
            />
          </div>

          {/* Steps */}
          <div className="space-y-8 md:space-y-16">
            {steps.map((step, index) => (
              <div
                key={index}
                ref={(el) => {
                  if (el) {
                    stepRefs.current[index] = el;
                  }
                }}
                className="relative flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-8"
                role="article"
                aria-labelledby={`step-${index}-title`}
              >
                {/* Step node */}
                <div
                  className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 touch-target ${
                    visibleSteps.includes(index)
                      ? "bg-blue-600 scale-110 shadow-lg shadow-blue-600/25"
                      : "bg-white border-4 border-gray-200"
                  } ${focusedStep === index ? "timeline-node-pulse" : ""}`}
                >
                  <step.icon
                    className={`w-6 sm:w-7 h-6 sm:h-7 transition-colors ${
                      visibleSteps.includes(index)
                        ? "text-white"
                        : "text-gray-400"
                    }`}
                    aria-hidden="true"
                  />

                  {/* Step number for screen readers */}
                  <span className="sr-only">Step {index + 1}</span>
                </div>

                {/* Content */}
                <div
                  className={`flex-1 transition-all duration-700 ${
                    visibleSteps.includes(index)
                      ? "opacity-100 translate-x-0"
                      : "opacity-50 translate-x-4"
                  }`}
                >
                  <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
                    <h3
                      id={`step-${index}-title`}
                      className="text-xl sm:text-2xl font-serif mb-4"
                    >
                      {step.title}
                    </h3>
                    <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                      {step.description}
                    </p>
                    {visibleSteps.includes(index) && (
                      <div
                        className="w-12 h-1 bg-orange-500 rounded-full mt-4"
                        aria-hidden="true"
                      ></div>
                    )}
                  </div>
                </div>

                {/* Mobile step indicator */}
                <div className="md:hidden text-xs text-gray-500 font-medium px-3 py-1 bg-gray-200 rounded-full self-start">
                  Step {index + 1} of {steps.length}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Progress indicator for mobile */}
        <div className="md:hidden mt-8 flex justify-center space-x-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                visibleSteps.includes(index) ? "bg-blue-600" : "bg-gray-300"
              }`}
              aria-hidden="true"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
