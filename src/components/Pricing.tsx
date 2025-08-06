import { Button } from "./ui/button";
import { Check } from "lucide-react";

const features = [
  "Unlimited PDF uploads",
  "Premium text-to-speech voices",
  "Variable speed control (0.5x - 3x)",
  "Background audio playback",
  "Smart chapter navigation",
  "Progress tracking & bookmarks",
  "iOS & Android apps",
  "Priority customer support",
];

export function Pricing() {
  return (
    <section
      id="pricing"
      className="py-24 px-4 gradient-subtle"
      aria-labelledby="pricing-heading"
    >
      <div className="container mx-auto max-w-4xl">
        <div className="text-center space-y-6 mb-16">
          <h2 id="pricing-heading" className="text-3xl sm:text-4xl md:text-5xl">
            Simple, transparent pricing
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Everything you need to transform your reading experience. Start
            free, upgrade when ready.
          </p>
        </div>

        <div className="max-w-lg mx-auto">
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-soft border border-slate-200 relative">
            {/* Popular badge */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-medium shadow-soft">
                Most Popular
              </div>
            </div>

            <div className="text-center space-y-8 mb-8">
              <div className="space-y-2">
                <h3 className="text-2xl font-semibold text-slate-900">
                  Pro Plan
                </h3>
                <p className="text-slate-600">Perfect for regular readers</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-baseline justify-center">
                  <span className="text-5xl font-semibold text-slate-900">
                    $5
                  </span>
                  <span className="text-xl text-slate-600 ml-2">/month</span>
                </div>
                <p className="text-slate-500">
                  7-day free trial, then $5/month
                </p>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <h4 className="font-semibold text-slate-900 mb-6">
                Everything included:
              </h4>
              <div className="grid gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                      <Check
                        className="w-3 h-3 text-green-600"
                        aria-hidden="true"
                      />
                    </div>
                    <span className="text-slate-700 leading-relaxed">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <Button
                size="lg"
                className="btn-primary w-full text-lg py-4 h-auto touch-target"
                aria-label="Start your free 7-day trial"
              >
                Start Free Trial
              </Button>
              <p className="text-center text-sm text-slate-500">
                No credit card required • Cancel anytime
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-12 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-slate-600">
            <div className="flex items-center space-x-2">
              <div
                className="w-2 h-2 bg-green-500 rounded-full"
                aria-hidden="true"
              ></div>
              <span>30-day money-back guarantee</span>
            </div>
            <div className="flex items-center space-x-2">
              <div
                className="w-2 h-2 bg-green-500 rounded-full"
                aria-hidden="true"
              ></div>
              <span>Secure payments via Stripe</span>
            </div>
          </div>
          <p className="text-slate-600">
            Questions about pricing?{" "}
            <a
              href="#faq"
              className="text-blue-600 hover:text-blue-700 underline decoration-blue-600/30 underline-offset-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
            >
              Check our FAQ
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
