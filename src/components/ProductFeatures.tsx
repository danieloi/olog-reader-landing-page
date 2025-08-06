"use client";

import { ImageWithFallback } from "./figma/ImageWithFallback";

// Import figma assets
import appHomeImage from "figma:asset/980c1aa18781a2fcbc4f69e4f6519b66e9669953.png";
import appLibraryImage from "figma:asset/4ca8a421f8a0ec2b28231661c7b275c93c8cec3a.png";
import appSpeedControlImage from "figma:asset/9a41e18f1e9f6584febdd61da27750468a83066d.png";
import appContentsImage from "figma:asset/cd1f14c81dc97db1ad779066dd5df0da17038ebe.png";
import appReadingImage from "figma:asset/7f92a8cca19f761c38a2b3c893c09caec3f8d3ed.png";

const features = [
  {
    image: "/home-tab.png",
    title: "One-Tap Upload",
    description:
      "Simply upload any PDF from your device and start listening instantly. No complex setup required.",
  },
  {
    image: "/speed-picker.png",
    title: "Smart Playback",
    description:
      "Adjust speed from 0.5x to 3x, with intelligent pacing that adapts to your learning style.",
  },
  {
    image: "/Screenshot_20250729-130300_olog-reader (1).jpg",
    title: "Intelligent Navigation",
    description:
      "Auto-generated table of contents lets you jump to any section with a single tap.",
  },
  {
    image: "/library-tab.png",
    title: "Background Play",
    description:
      "Continue listening while using other apps or when your screen is locked.",
  },
  {
    image: "/reader-screen.png",
    title: "Mobile Optimized",
    description:
      "Native iOS and Android apps designed specifically for on-the-go learning.",
  },
];

export function ProductFeatures() {
  return (
    <section
      id="features"
      className="py-24 px-4 bg-white"
      aria-labelledby="features-heading"
    >
      <div className="container mx-auto max-w-7xl">
        <div className="text-center space-y-6 mb-20">
          <h2
            id="features-heading"
            className="text-3xl sm:text-4xl md:text-5xl max-w-3xl mx-auto"
          >
            Everything you need for effortless listening
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Five powerful features that transform how you consume written
            content.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* First two features side by side */}
          <div className="lg:col-span-2 grid sm:grid-cols-2 gap-8">
            {features.slice(0, 2).map((feature, index) => (
              <article
                key={index}
                className="group space-y-6"
                aria-labelledby={`feature-${index}-title`}
              >
                <div className="aspect-[9/16] overflow-hidden rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center">
                  <ImageWithFallback
                    src={feature.image}
                    alt={`${feature.title} interface`}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="space-y-3">
                  <h3
                    id={`feature-${index}-title`}
                    className="text-xl font-semibold text-slate-900"
                  >
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </article>
            ))}
          </div>

          {/* Third feature takes full height */}
          <div className="space-y-6">
            <article
              className="group space-y-6"
              aria-labelledby="feature-2-title"
            >
              <div className="aspect-[9/16] overflow-hidden rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center">
                <ImageWithFallback
                  src={features[2].image}
                  alt={`${features[2].title} interface`}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="space-y-3">
                <h3
                  id="feature-2-title"
                  className="text-xl font-semibold text-slate-900"
                >
                  {features[2].title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {features[2].description}
                </p>
              </div>
            </article>
          </div>
        </div>

        {/* Bottom two features */}
        <div className="grid sm:grid-cols-2 gap-8 mt-8 max-w-4xl mx-auto">
          {features.slice(3).map((feature, index) => (
            <article
              key={index + 3}
              className="group space-y-6"
              aria-labelledby={`feature-${index + 3}-title`}
            >
              <div className="aspect-[9/16] overflow-hidden rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center">
                <ImageWithFallback
                  src={feature.image}
                  alt={`${feature.title} interface`}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="space-y-3">
                <h3
                  id={`feature-${index + 3}-title`}
                  className="text-xl font-semibold text-slate-900"
                >
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
