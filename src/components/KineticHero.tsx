"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export function KineticHero() {
  const heroRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const lineOneX = useTransform(scrollYProgress, [0, 1], [0, -72]);
  const lineTwoX = useTransform(scrollYProgress, [0, 1], [0, 84]);
  const headlineScale = useTransform(scrollYProgress, [0, 1], [1, 0.96]);

  return (
    <section
      ref={heroRef}
      className="overflow-hidden border-b border-hairline bg-chalk px-5 py-8 sm:px-8 sm:py-11"
    >
      <div className="mx-auto max-w-[1400px]">
        <motion.div
          style={{ scale: headlineScale }}
          className="origin-left select-none"
        >
          <motion.h1
            style={{ x: lineOneX }}
            className="font-display text-[2.6rem] sm:text-[4.25rem] lg:text-[5.25rem] font-extrabold uppercase leading-[0.94] tracking-[-0.03em] text-obsidian"
          >
            SOLID MATTER IN MOTION
          </motion.h1>
          <motion.div
            style={{ x: lineTwoX }}
            className="mt-1 flex flex-wrap items-baseline justify-between gap-4"
          >
            <span className="font-display text-[2.2rem] sm:text-[3.75rem] lg:text-[4.5rem] font-bold uppercase leading-[0.96] tracking-[-0.03em] text-oxblood">
              ANTWERP / MILAN EDITION
            </span>
            <p className="max-w-[38ch] text-sm leading-relaxed text-pewter">
              Six architectural desk, acoustic, and lighting objects milled from stone, borosilicate, and billet aluminum.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
