"use client";

import React from "react";
import { motion, useInView } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Card, CardContent } from "@/components/ui/Card";
import { Zap, Mic, DollarSign, TrendingUp, CheckCircle } from "lucide-react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  accentColor: string;
  upcoming?: boolean;
}

const FeatureCard: React.FC<FeatureCardProps & { index: number }> = ({
  icon,
  title,
  description,
  accentColor,
  upcoming = false,
  index,
}) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 30,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: index * 0.1,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      variants={cardVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      whileHover={{
        scale: 1.02,
        y: -4,
        transition: {
          duration: 0.2,
          ease: "easeOut",
        },
      }}
      className="group relative"
    >
      <Card
        variant="feature"
        padding="lg"
        hover={false} // Disable default hover since we're using Framer Motion
        className={`
          relative overflow-hidden
          ${accentColor}
        `}
      >
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-current to-transparent rounded-full transform translate-x-16 -translate-y-16" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-current to-transparent rounded-full transform -translate-x-12 translate-y-12" />
        </div>

        <CardContent className="relative z-10 text-center space-y-6">
          {/* Icon container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{
              duration: 0.5,
              delay: index * 0.1 + 0.2,
              ease: "easeOut",
            }}
            whileHover={{
              scale: 1.05,
              transition: { duration: 0.2, ease: "easeOut" },
            }}
            className={`
              inline-flex items-center justify-center
              w-16 h-16 sm:w-20 sm:h-20 mx-auto
              rounded-2xl border-2 sm:border-4 border-current
              bg-gradient-to-br from-white to-gray-50
              shadow-2xl shadow-current/30
              transition-all duration-200
              ${
                accentColor.includes("primary")
                  ? "text-primary-500"
                  : accentColor.includes("accent")
                  ? "text-accent-500"
                  : accentColor.includes("emerald")
                  ? "text-emerald-500"
                  : "text-purple-500"
              }
            `}
          >
            <div className="text-2xl sm:text-3xl">
              {icon}
            </div>
          </motion.div>

          {/* Title */}
          <motion.h3
            className="text-xl sm:text-2xl lg:text-3xl font-black text-text-primary leading-tight tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={
              isInView
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: 20 }
            }
            transition={{
              duration: 0.5,
              delay: index * 0.1 + 0.3,
              ease: "easeOut",
            }}
          >
            {title}
          </motion.h3>

          {/* Description */}
          <motion.p
            className="text-sm sm:text-base lg:text-lg font-medium text-text-secondary leading-relaxed"
            initial={{ opacity: 0, y: 15 }}
            animate={
              isInView
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: 15 }
            }
            transition={{
              duration: 0.5,
              delay: index * 0.1 + 0.4,
              ease: "easeOut",
            }}
          >
            {description}
          </motion.p>

          {/* Upcoming badge */}
          {upcoming && (
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 bg-accent-500 text-white rounded-full text-sm font-bold uppercase tracking-wide"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={
                isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }
              }
              transition={{
                duration: 0.4,
                delay: index * 0.1 + 0.5,
                ease: "easeOut",
              }}
              whileHover={{
                scale: 1.05,
                transition: { duration: 0.2 },
              }}
            >
              <CheckCircle className="w-4 h-4" />
              Coming Soon
            </motion.div>
          )}
        </CardContent>

        {/* Corner accent */}
        <div
          className={`
            absolute top-4 right-4 w-6 h-6 rounded-full opacity-60
            ${
              accentColor.includes("primary")
                ? "bg-primary-500"
                : accentColor.includes("accent")
                ? "bg-accent-500"
                : accentColor.includes("emerald")
                ? "bg-emerald-500"
                : "bg-purple-500"
            }
          `}
        />
      </Card>
    </motion.div>
  );
};

const Features: React.FC = () => {
  const headerRef = React.useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-50px" });

  const features: FeatureCardProps[] = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: "One-tap conversion",
      description:
        "Transform any PDF into a natural-sounding audiobook instantly. No complex setup, no waiting - just tap and listen.",
      accentColor: "hover:border-primary-500 hover:shadow-primary-500/40",
    },
    {
      icon: <Mic className="w-8 h-8" />,
      title: "Natural AI voices",
      description:
        "Experience crystal-clear, human-like narration that makes every document engaging and easy to follow.",
      accentColor: "hover:border-accent-500 hover:shadow-accent-500/40",
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: "Truly affordable",
      description:
        "At just $5/month, get unlimited conversions and premium features - a fraction of what leading TTS tools charge.",
      accentColor: "hover:border-emerald-500 hover:shadow-emerald-500/40",
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Built for growth",
      description:
        "Start with PDFs today, expand to EPUB & DOCX tomorrow. Plus AI summaries, document chat, and auto-generated quizzes.",
      accentColor: "hover:border-purple-500 hover:shadow-purple-500/40",
      upcoming: true,
    },
  ];

  const headerVariants = {
    hidden: {
      opacity: 0,
      y: 40,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    },
  };

  return (
    <section className="py-16 lg:py-24 bg-background-content relative overflow-hidden">
      {/* Subtle background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500 rounded-full blur-3xl transform -translate-y-1/2" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-500 rounded-full blur-3xl transform translate-y-1/2" />
      </div>

      <Container className="relative z-10">
        {/* Section header with scroll-triggered animations */}
        <motion.div
          ref={headerRef}
          variants={headerVariants}
          initial="hidden"
          animate={isHeaderInView ? "visible" : "hidden"}
          className="text-center mb-16 lg:mb-20"
        >
          <motion.h2
            className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-text-primary mb-4 sm:mb-6 leading-tight tracking-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={
              isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
            }
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Powerful Features,
            <br />
            <motion.span
              className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-accent-500"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={
                isHeaderInView
                  ? { opacity: 1, scale: 1 }
                  : { opacity: 0, scale: 0.8 }
              }
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Bold Results
            </motion.span>
          </motion.h2>

          <motion.p
            className="text-base sm:text-lg lg:text-xl font-medium text-text-secondary max-w-3xl mx-auto leading-relaxed px-4 sm:px-0"
            initial={{ opacity: 0, y: 20 }}
            animate={
              isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
            }
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Everything you need to transform your reading experience, designed
            with bold simplicity and maximum impact.
          </motion.p>
        </motion.div>

        {/* Features grid with staggered animations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} index={index} />
          ))}
        </div>

        {/* Bottom CTA section with scroll-triggered animation */}
        <motion.div
          className="text-center mt-16 lg:mt-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.div
            className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-primary-50 to-accent-50 border-2 border-primary-500 rounded-2xl"
            whileHover={{
              scale: 1.02,
              boxShadow: "0 15px 30px rgba(0, 122, 255, 0.2)",
              transition: { duration: 0.2, ease: "easeOut" },
            }}
            whileTap={{ scale: 0.98 }}
          >
            <CheckCircle className="w-6 h-6 text-primary-500" />
            <span className="text-lg font-bold text-text-primary">
              Ready to experience the difference?
            </span>
          </motion.div>
        </motion.div>
      </Container>


    </section>
  );
};

export default Features;
