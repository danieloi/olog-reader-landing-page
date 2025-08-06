"use client";
import { useEffect, useRef, useState } from "react";

const stats = [
  {
    number: "85%",
    description: "improved retention rate",
  },
  {
    number: "25min",
    description: "average time saved per chapter",
  },
  {
    number: "10K+",
    description: "documents processed daily",
  },
];

function AnimatedCounter({
  target,
  isVisible,
}: {
  target: string;
  isVisible: boolean;
}) {
  const [count, setCount] = useState("0");

  useEffect(() => {
    if (!isVisible) return;

    const numericTarget = parseInt(target.replace(/[^\d]/g, ""));
    const hasPercent = target.includes("%");
    const hasMin = target.includes("min");
    const hasK = target.includes("K");
    const hasPlus = target.includes("+");

    let currentCount = 0;
    const increment = Math.ceil(numericTarget / 40);
    const duration = 1500;
    const stepTime = duration / (numericTarget / increment);

    const timer = setInterval(() => {
      currentCount += increment;
      if (currentCount >= numericTarget) {
        currentCount = numericTarget;
        clearInterval(timer);
      }

      let displayValue = currentCount.toString();
      if (hasK && currentCount >= 1000) {
        displayValue = (currentCount / 1000).toFixed(0) + "K";
      }
      if (hasPercent) {
        displayValue += "%";
      }
      if (hasMin) {
        displayValue += "min";
      }
      if (hasPlus) {
        displayValue += "+";
      }

      setCount(displayValue);
    }, stepTime);

    return () => clearInterval(timer);
  }, [isVisible, target]);

  return (
    <span className="text-4xl md:text-5xl font-semibold text-slate-900 dark:text-white">
      {count}
    </span>
  );
}

export function StatsRow() {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="py-20 px-4 bg-slate-50 dark:bg-gray-900">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-3 gap-16 text-center">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`space-y-4 ${
                isVisible ? "fade-in-up visible" : "fade-in-up"
              }`}
            >
              <div>
                <AnimatedCounter target={stat.number} isVisible={isVisible} />
              </div>
              <p className="text-slate-600 dark:text-gray-300 text-lg leading-relaxed font-medium">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
