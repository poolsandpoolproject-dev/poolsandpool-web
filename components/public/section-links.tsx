"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import { MenuIcon } from "@/components/ui/menu-icon";

type SectionLink = { id: string; name: string };

type SectionLinksProps = {
  sections: SectionLink[];
  title: string;
  className?: string;
};

const viewport = { once: true, amount: 0.6 } as const;

const container = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { staggerChildren: 0.05 } },
} as const;

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
} as const;

export function SectionLinks({ sections, title, className }: SectionLinksProps) {
  if (sections.length === 0) return null;

  const [open, setOpen] = React.useState(false);

  const scrollToSection = React.useCallback((id: string) => {
    setOpen(false);
    const runScroll = () => {
      const el = document.getElementById(`section-${id}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    setTimeout(runScroll, 400);
  }, []);

  return (
    <section className={cn("sticky top-0 z-40", className)}>
      <div className="relative overflow-hidden border-b-2 border-[#fbff26] sm:border-b-0 shadow-sm">
  
        <div className="absolute inset-0 bg-cover bg-center " style={{ backgroundImage: 'url("/pattern.png")' }} />
        <div className="absolute inset-0 bg-black/55" />

        <Container className="relative z-10">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={viewport}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="py-5"
          >
            <div className="sm:hidden flex flex-col items-center gap-3">
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                className="w-full flex flex-col items-center justify-center gap-2 text-white"
              >
                <div className="text-sm font-bold capitalize font-serif text-center">
                  Click Here to Browse {title}
                </div>
                <div className="flex items-center justify-center gap-4 w-full max-w-sm">
                  <div className="h-px bg-white/70 flex-1" />
                  <MenuIcon className="text-white" />
                  <div className="h-px bg-white/70 flex-1" />
                </div>
              </button>
            </div>

            <div className="hidden sm:flex flex-wrap lg:items-center lg:justify-center gap-x-6 gap-y-3 px-4">
              {sections.map((s) => (
                <motion.button
                  key={s.id}
                  variants={item}
                  type="button"
                  onClick={() => scrollToSection(s.id)}
                  className="text-[#fbff26] hover:text-primary font-bold transition-colors uppercase font-serif text-sm sm:text-base tracking-wide cursor-pointer"
                >
                  {s.name}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </Container>
      </div>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            key="sections-panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="sm:hidden overflow-hidden"
          >
            <div className="relative overflow-hidden border-b-2 border-primary">
              <div className="absolute inset-0 bg-cover bg-center " style={{ backgroundImage: 'url("/pattern.png")' }} />
              <div className="absolute inset-0 bg-black/55" />

              <Container className="relative z-10 py-5">
                <div className="max-h-[70vh] overflow-y-auto">
                  <div className="flex flex-col">
                    {sections.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => scrollToSection(s.id)}
                        className="py-4 text-center font-bold font-serif uppercase tracking-wide text-[#fbff26] text-xl border-b border-white/10 cursor-pointer"
                      >
                        {s.name}
                      </button>
                    ))}
                  </div>
                </div>
              </Container>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}

