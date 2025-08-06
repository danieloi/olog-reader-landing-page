"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const demoSteps = [
  {
    image: "/library-tab.png",
    title: "Import",
    description: "Upload your PDF from device storage or cloud services",
  },
  {
    image: "/home-tab.png",
    title: "Listen",
    description: "Start listening immediately with natural AI voices",
  },
  {
    image: "/reader-screen.png",
    title: "Highlight",
    description: "Follow along visually or close your eyes and absorb",
  },
  {
    image: "/speed-picker.png",
    title: "Quiz",
    description: "Customize speed and controls for your perfect experience",
  },
];

export function AppPreview() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [hasAutoPlayed, setHasAutoPlayed] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAutoPlayed) {
          setHasAutoPlayed(true);

          // Auto-play through slides once
          let slideIndex = 0;
          const autoPlayInterval = setInterval(() => {
            slideIndex++;
            if (slideIndex >= demoSteps.length) {
              clearInterval(autoPlayInterval);
              return;
            }
            setCurrentSlide(slideIndex);
          }, 2000);

          return () => clearInterval(autoPlayInterval);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasAutoPlayed]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % demoSteps.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + demoSteps.length) % demoSteps.length);
  };

  return (
    <section
      ref={sectionRef}
      className="py-16 px-4 bg-gradient-to-br from-indigo-50 to-purple-50"
    >
      <div className="container mx-auto">
        <div className="text-center space-y-6 mb-16">
          <h2 className="text-h2 md:text-[2.5rem]">See It In Action</h2>
          <p className="text-body text-gray-600 max-w-2xl mx-auto">
            Experience the complete Olog Reader workflow in four simple steps.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Main carousel */}
            <div className="flex justify-center items-center">
              <button
                onClick={prevSlide}
                className="absolute left-0 z-10 p-2 rounded-full bg-white shadow-lg hover:shadow-xl transition-shadow"
              >
                <ChevronLeft className="w-6 h-6 text-gray-600" />
              </button>

              <div className="text-center space-y-8 max-w-sm mx-auto">
                <div className="relative">
                  <img
                    src={demoSteps[currentSlide].image}
                    alt={demoSteps[currentSlide].title}
                    className="w-full max-w-xs mx-auto rounded-2xl shadow-2xl border border-gray-200 transition-all duration-500"
                  />
                  <div className="absolute -top-2 -right-2 bg-[#007AFF] text-white px-3 py-1 rounded-full text-xs shadow-lg">
                    Step {currentSlide + 1}
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-medium">
                    {demoSteps[currentSlide].title}
                  </h3>
                  <p className="text-body text-gray-600 leading-relaxed">
                    {demoSteps[currentSlide].description}
                  </p>
                </div>
              </div>

              <button
                onClick={nextSlide}
                className="absolute right-0 z-10 p-2 rounded-full bg-white shadow-lg hover:shadow-xl transition-shadow"
              >
                <ChevronRight className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* Slide indicators */}
            <div className="flex justify-center space-x-2 mt-8">
              {demoSteps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentSlide
                      ? "bg-[#007AFF]"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>

            {/* Step labels below */}
            <div className="grid grid-cols-4 gap-4 mt-12">
              {demoSteps.map((step, index) => (
                <div
                  key={index}
                  className={`text-center p-4 rounded-lg transition-colors ${
                    index === currentSlide
                      ? "bg-white shadow-md"
                      : "bg-transparent"
                  }`}
                >
                  <div
                    className={`w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center text-sm font-medium ${
                      index === currentSlide
                        ? "bg-[#007AFF] text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <p className="text-sm font-medium">{step.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
