"use client";

export function Mission() {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center space-y-8">
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif leading-tight">
              <div>Reading,</div>
              <div>Effortless,</div>
              <div>Accessible</div>
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
              We believe knowledge should flow freely, adapting to your life
              rather than demanding you adapt to it. Olog Reader transforms
              static documents into dynamic audio experiences, making learning
              possible anywhere, anytime.
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl max-w-3xl mx-auto">
            <p className="text-body text-gray-700 leading-relaxed font-medium">
              Our mission: Turn the world's static documents into on-the-go
              audio knowledge—so anyone, anywhere, can learn, grow, and thrive
              without the usual barriers of cost, time, or accessibility.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
