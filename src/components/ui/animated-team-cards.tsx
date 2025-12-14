"use client";

import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";

type Testimonial = {
  quote?: string;
  name?: string;
  role?: string;
  image?: string;
  email?: string;
  phone?: string;
};

export const AnimatedTeamCards = ({
  testimonials,
  autoplay = false,
}: {
  testimonials: Testimonial[];
  autoplay?: boolean;
}) => {
  const [active, setActive] = useState(0);

  const handleNext = () => {
    if (testimonials.length > 0) setActive((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    if (testimonials.length > 0) setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const isActive = (index: number) => index === active;

  useEffect(() => {
    if (autoplay && testimonials.length > 1) {
      const interval = setInterval(handleNext, 5000);
      return () => clearInterval(interval);
    }
  }, [autoplay, testimonials.length]);

  const randomRotateY = () => Math.floor(Math.random() * 21) - 10;

  if (!testimonials.length) {
    return <p className="text-center text-gray-500">No team members available.</p>;
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-10 font-sans antialiased md:max-w-4xl md:px-8 lg:px-12">
      <div className="relative grid grid-cols-1 gap-11 md:grid-cols-2">
        <div>
          <div className="relative h-80 w-full">
            <AnimatePresence>
              {testimonials.map((testimonial, index) => {
                const imgSrc = testimonial.image ?? "/default-avatar.png";
                const altText = testimonial.name ?? "Unknown";

                return (
                  <motion.div
                    key={`${imgSrc}-${index}`}
                    initial={{
                      opacity: 0,
                      scale: 0.9,
                      z: -100,
                      rotate: randomRotateY(),
                    }}
                    animate={{
                      opacity: isActive(index) ? 1 : 0.7,
                      scale: isActive(index) ? 1 : 0.95,
                      z: isActive(index) ? 0 : -100,
                      rotate: isActive(index) ? 0 : randomRotateY(),
                      zIndex: isActive(index) ? 40 : testimonials.length + 2 - index,
                      y: isActive(index) ? [0, -80, 0] : 0,
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.9,
                      z: 100,
                      rotate: randomRotateY(),
                    }}
                    transition={{
                      duration: 0.4,
                      ease: "easeInOut",
                    }}
                    className="absolute inset-0 origin-bottom"
                  >
                    <img
                      src={imgSrc}
                      alt={altText}
                      width={500}
                      height={500}
                      draggable={false}
                      className="h-full w-full rounded-3xl object-cover object-center"
                    />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
        <div className="flex flex-col justify-between py-4">
          <motion.div
            key={active}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <h3 className="text-2xl font-bold text-black">
              {testimonials[active]?.name ?? "Unknown"}
            </h3>
            <p className="text-sm text-gray-500">
              {testimonials[active]?.role ?? "No role provided"}
            </p>
            <motion.p className="mt-8 text-lg text-gray-700">
              {(testimonials[active]?.quote ?? "")
                .split(" ")
                .map((word, index) => (
                  <motion.span
                    key={index}
                    initial={{ filter: "blur(10px)", opacity: 0, y: 5 }}
                    animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut", delay: 0.02 * index }}
                    className="inline-block"
                  >
                    {word}&nbsp;
                  </motion.span>
                ))}
            </motion.p>
          </motion.div>

          <div className="flex items-center justify-center pt-12 md:pt-0 gap-4">
            <button
              onClick={handlePrev}
              className="border border-[#333333] flex items-center justify-center rounded-full p-1.5 hover:scale-105 transition-transform duration-300 cursor-pointer"
              aria-label="Previous testimonial"
            >
              <IconArrowLeft className="h-6 w-6 text-black" />
            </button>
            <button
              onClick={handleNext}
              className="border border-[#333333] flex items-center justify-center rounded-full p-1.5 hover:scale-105 transition-transform duration-300 cursor-pointer"
              aria-label="Next testimonial"
            >
              <IconArrowRight className="h-6 w-6 text-black" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
