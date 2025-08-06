import { Button } from "./ui/button";
import { Download, Mail } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-16 px-4 bg-gradient-to-r from-orange-500 to-red-500">
      <div className="container mx-auto text-center">
        <div className="space-y-10 text-white">
          <h2 className="text-h2 md:text-[2.5rem] font-semibold">
            Ready to Transform Your Reading?
          </h2>
          <p className="text-body opacity-90 max-w-2xl mx-auto">
            Join thousands of users who have already revolutionized their
            learning experience.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="text-lg px-8 bg-white text-orange-600 hover:bg-gray-100"
            >
              <Download className="w-5 h-5 mr-2" />
              Download App
            </Button>
            <Button
              size="lg"
              variant="secondary"
              className="text-lg px-8 bg-white text-orange-600 hover:bg-gray-100"
            >
              <Mail className="w-5 h-5 mr-2" />
              Join Waitlist
            </Button>
          </div>

          <div className="flex items-center justify-center space-x-8 text-sm opacity-75">
            {/* <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>7-day free trial</span>
            </div> */}
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>No setup fees</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
