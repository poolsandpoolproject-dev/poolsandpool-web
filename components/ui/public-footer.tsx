"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { TikTokIcon } from "@/components/ui/tiktok-icon";

const viewport = { once: true, amount: 0.6 } as const;

const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0 },
} as const;

export function PublicFooter() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url("/footer.png")' }} />
      <div className="absolute inset-0 bg-[#071b2f]/70" />

      <Container className="relative z-10 py-40">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            variants={item}
            initial="hidden"
            whileInView="show"
            viewport={viewport}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex justify-center"
          >
            <Image src="/logo/logo.png" alt="PS & P" width={160} height={64} className="w-40 h-auto object-contain" />
          </motion.div>

          <motion.h2
            variants={item}
            initial="hidden"
            whileInView="show"
            viewport={viewport}
            transition={{ duration: 0.55, ease: "easeOut", delay: 0.06 }}
            className="mt-4 font-serif text-[40px] font-semibold text-white"
          >
            AWAITING YOUR ARRIVAL. EVERY NIGHT
          </motion.h2>

          <motion.div
            variants={item}
            initial="hidden"
            whileInView="show"
            viewport={viewport}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.12 }}
            className="mt-5 space-y-4 text-white text-lg md:text-xl font-serif"
          >
            <div>From 12:00 PM to 12:00 AM</div>
            <div>1 Wuraola Street off AIT ROAD behind Emmatos Superstores, Omoreghe Kola, Alagbado</div>
            <div>+234 703 973 6454</div>
          </motion.div>

          <motion.div
            variants={item}
            initial="hidden"
            whileInView="show"
            viewport={viewport}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.18 }}
            className="mt-8 flex flex-col items-center gap-5"
          >
            <Button
              asChild
              variant="outline"
              className="h-12 rounded-xl font-serif uppercase border border-[#FED75E]/70 bg-[#FED75E] px-8 text-[#071b2f] shadow-lg shadow-black/30 hover:bg-[#f6c93d] hover:text-[#071b2f]"
            >
              <a href="https://maps.app.goo.gl/pvEm6dvsytznFkN37" target="_blank" rel="noreferrer">
                <MapPin className="size-4" />
                Find us on Google Maps
              </a>
            </Button>

            <div className="flex flex-col items-center gap-3">
              <Image src="/qrcode.png" alt="Scan to open Pools & Pool" width={120} height={120} />
              <span className="text-sm text-white/80">Scan to open Pools & Pool</span>
            </div>

            <div className="flex items-center gap-4 text-white">
              <Link href="https://www.tiktok.com/@poolsandpool" target="_blank">
                <button
                  type="button"
                  className="inline-flex items-center justify-center size-12 hover:text-[#FED75E]/70 transition-color cursor-pointer"
                  aria-label="TikTok"
                >
                  <TikTokIcon className="size-7" />
                </button>
              </Link>
            </div>

            <div className="text-base text-white font-serif uppercase">© PoolS &amp; Pool Lounge {new Date().getFullYear()}</div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

