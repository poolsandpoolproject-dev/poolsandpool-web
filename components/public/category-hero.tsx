"use client";

import { motion } from "framer-motion";

import { Container } from "@/components/ui/container";

type CategoryHeroProps = {
  title: string;
  imageUrl?: string | null;
};

const viewport = { once: true, amount: 0.7 } as const;

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
} as const;

export function CategoryHero({ title, imageUrl }: CategoryHeroProps) {
  return (
    <section className="relative overflow-hidden">

      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: imageUrl ? `url("${imageUrl}")` : 'url("/bar.jpg")' }}
      />
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 pt-[120px] pb-[80px] md:pb-[100px]">
        <Container>
        <div className="mt-6 text-center  p-2.5">
          <motion.div
            variants={item}
            initial="hidden"
            whileInView="show"
            viewport={viewport}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-white md:text-[25px] text-[20px] uppercase mb-5 font-serif"
          >
            Lounge
          </motion.div>
          <motion.h1
            variants={item}
            initial="hidden"
            whileInView="show"
            viewport={viewport}
            transition={{ duration: 0.55, ease: "easeOut", delay: 0.06 }}
            className="mt-3 font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-wide mb-5"
          >
            {title}
          </motion.h1>
        </div>
        </Container>
      </div>
    </section>
  );
}

