"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import banner from "../../../public/banner.jpg";
import banner2 from "../../../public/banner2.jpg";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    image: banner,
    tag: "New Collection 2026",
    title: "Discover Modern Fashion For Everyone",
    description:
      "Explore premium quality products with modern design and fast delivery.",
    btn: "Shop Now",
  },
  {
    image: banner2,
    tag: "Summer Sale — Up to 40% Off",
    title: "Style That Speaks For Itself",
    description:
      "Fresh arrivals every week. Find your look and own it with confidence.",
    btn: "Explore Deals",
  },
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);

  const goTo = (index) => {
    setCurrent((index + slides.length) % slides.length);
  };

  const prev = () => goTo(current - 1);
  const next = () => goTo(current + 1);

  // Auto-play
  const startTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);
  };

  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
  }, []);

  const handleManualNav = (fn) => {
    fn();
    startTimer(); // reset timer on manual click
  };

  return (
    <section className="relative md:max-h-[400px] mt-5 overflow-hidden">
      {/* SLIDES TRACK */}
      <div
        className="flex transition-transform duration-700 ease-in-out h-full"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide, i) => (
          <div key={i} className="relative min-w-full min-h-[600px]">
            {/* Image — no overlay, real colors */}
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover object-center"
              priority={i === 0}
            />

            {/* Light gradient only on left side for text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />

            {/* Content */}
            <div className="relative z-10 container mx-auto flex items-center px-4 min-h-[600px]">
              <div className="max-w-xl py-20">
                <p className="mb-4 text-sm font-medium uppercase tracking-widest text-white/80">
                  {slide.tag}
                </p>
                <h1 className="mb-6 text-5xl font-bold leading-tight text-white drop-shadow-md">
                  {slide.title}
                </h1>
                <p className="mb-8 text-white/80 text-lg">
                  {slide.description}
                </p>
                <Button
                  size="lg"
                  className="bg-white text-black hover:bg-gray-100"
                >
                  {slide.btn}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ARROW BUTTONS */}
      {/* <button
        onClick={() => handleManualNav(prev)}
        className="absolute left-4 top-1/2 z-20 -translate-y-1/2 bg-white/30 hover:bg-white/60 backdrop-blur-sm text-white rounded-full p-2 transition-all"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={() => handleManualNav(next)}
        className="absolute right-4 top-1/2 z-20 -translate-y-1/2 bg-white/30 hover:bg-white/60 backdrop-blur-sm text-white rounded-full p-2 transition-all"
      >
        <ChevronRight size={24} />
      </button> */}

      {/* DOT INDICATORS */}
      <div className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => handleManualNav(() => goTo(i))}
            className={`rounded-full transition-all duration-300 ${
              i === current ? "w-6 h-2 bg-white" : "w-2 h-2 bg-white/50"
            }`}
          />
        ))}
      </div>

      {/* PROGRESS BAR */}
      <div className="absolute bottom-0 left-0 right-0 z-20 h-[3px] bg-white/20">
        <div
          key={current}
          className="h-full bg-white animate-progress"
          style={{ animationDuration: "4000ms" }}
        />
      </div>
    </section>
  );
}
