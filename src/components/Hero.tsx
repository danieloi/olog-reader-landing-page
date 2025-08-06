import { Button } from "./ui/button";
import { Play, ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="pt-32 pb-24 px-4 bg-white">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <div className="container mx-auto max-w-7xl">
        <div className="text-center space-y-12">
          {/* Headline */}
          <div className="space-y-8 max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight">
              Transform any PDF into an{" "}
              <span className="italic text-blue-600">audiobook</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-light">
              Listen while you commute, exercise, or relax. Premium
              text-to-speech technology makes any document an engaging audio
              experience.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="btn-primary text-lg px-8 py-4 h-auto touch-target"
              aria-label="Start your free trial"
            >
              <Play className="w-5 h-5 mr-2" aria-hidden="true" />
              Start Free Trial
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="btn-secondary text-lg px-8 py-4 h-auto touch-target"
              aria-label="Watch demo video"
            >
              Watch Demo
              <ArrowRight className="w-5 h-5 ml-2" aria-hidden="true" />
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-slate-500">
            <div className="flex items-center space-x-2">
              <div
                className="w-2 h-2 bg-green-500 rounded-full"
                aria-hidden="true"
              ></div>
              <span>7-day free trial</span>
            </div>
            <div className="flex items-center space-x-2">
              <div
                className="w-2 h-2 bg-green-500 rounded-full"
                aria-hidden="true"
              ></div>
              <span>No credit card required</span>
            </div>
            <div className="flex items-center space-x-2">
              <div
                className="w-2 h-2 bg-green-500 rounded-full"
                aria-hidden="true"
              ></div>
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>

        {/* Product showcase */}
        <div className="mt-20 relative">
          <div className="relative max-w-sm mx-auto">
            <div
              className="absolute -inset-4 bg-gradient-to-r from-blue-100 to-blue-50 rounded-3xl blur-2xl opacity-30"
              aria-hidden="true"
            ></div>
            <img
              src="/home-tab.png"
              alt="Olog Reader app interface showing personal library with audiobook collection"
              className="relative w-full rounded-2xl shadow-2xl border border-slate-200"
            />
          </div>

          {/* Floating feature cards */}
          <div className="hidden lg:block">
            <div className="absolute top-1/4 left-8 bg-white rounded-xl p-4 shadow-soft border border-slate-200 max-w-48">
              <div className="text-sm font-medium text-slate-900">
                One-tap upload
              </div>
              <div className="text-xs text-slate-600 mt-1">
                Instant PDF conversion
              </div>
            </div>
            <div className="absolute top-1/2 right-8 bg-white rounded-xl p-4 shadow-soft border border-slate-200 max-w-48">
              <div className="text-sm font-medium text-slate-900">
                Smart playback
              </div>
              <div className="text-xs text-slate-600 mt-1">
                Adjustable speed & navigation
              </div>
            </div>
            <div className="absolute bottom-1/4 left-16 bg-white rounded-xl p-4 shadow-soft border border-slate-200 max-w-48">
              <div className="text-sm font-medium text-slate-900">
                Background play
              </div>
              <div className="text-xs text-slate-600 mt-1">
                Listen while multitasking
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="main-content" className="sr-only">
        Main content starts here
      </div>
    </section>
  );
}
