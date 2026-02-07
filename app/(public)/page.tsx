"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Clock, Flame, GlassWater, UtensilsCrossed } from "lucide-react";
import { motion } from "framer-motion";
import { Autoplay, EffectFade } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { MenuIcon } from "@/components/ui/menu-icon";
import { getEnabledCategories } from "@/lib/data";

import "swiper/css";
import "swiper/css/effect-fade";

export default function HomePage() {
  const categories = getEnabledCategories();
  const heroCategories = categories.slice(0, 3);

  const heroViewport = { once: true, amount: 0.7 } as const;

  const heroItem = {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0 },
  } as const;

  const heroButtons = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { staggerChildren: 0.08 } },
  } as const;

  const aboutMedia = {
    hidden: { opacity: 0, x: 18 },
    show: { opacity: 1, x: 0 },
  } as const;

  const hoverBgForCategory = (slug: string) => {
    if (slug === "drinks") return "before:bg-sky-500";
    if (slug === "food") return "before:bg-amber-500";
    if (slug === "smoke") return "before:bg-amber-400";
    return "before:bg-primary";
  };

  const slideOverlayClasses = (from: "left" | "right") => {
    const base =
      "relative overflow-hidden before:content-[''] before:absolute before:inset-px before:rounded-[inherit] before:pointer-events-none before:z-0 before:transition-transform before:duration-300 before:ease-out";
    const dir =
      from === "left"
        ? "before:-translate-x-full hover:before:translate-x-0 group-hover:before:translate-x-0"
        : "before:translate-x-full hover:before:translate-x-0 group-hover:before:translate-x-0";
    return `${base} ${dir}`;
  };

  const iconForSlug = (slug: string) => {
    if (slug === "drinks") return GlassWater;
    if (slug === "food") return UtensilsCrossed;
    if (slug === "smoke") return Flame;
    return Flame;
  };

  const labelForSlug = (slug: string, name: string) => {
    if (slug === "drinks") return "DRINK MENU";
    if (slug === "food") return "FOOD MENU";
    if (slug === "smoke") return "TOBACCO";
    return name.toUpperCase();
  };

  const scrollToSections = () => {
    document.getElementById("about-us")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bg-background">
      <section className="relative min-h-screen overflow-hidden">
        <Container>
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url("/pattern.jpg"), url("/barpat.jpg")' }}
        />
        <div className="absolute inset-0 bg-black/75" />

        <div className="relative z-10 min-h-screen flex flex-col">
          <div className="px-4 pt-6 flex items-center justify-between gap-3">
            <Link href="/" className="text-white font-serif text-2xl tracking-wide hover:text-white transition-colors">
              Ps & P
            </Link>
            <Link
              href="/#about-us"
              aria-label="Main menu"
              className="inline-flex items-center justify-center text-white hover:text-white transition-colors"
            >
              <MenuIcon className="sm:hidden" />
              <span className="hidden sm:inline text-sm font-medium tracking-[0.35em] underline-offset-8 hover:underline decoration-white/70 whitespace-nowrap">
                MAIN MENU
              </span>
            </Link>
          </div>

          <div className="flex-1 flex flex-col items-center py-20 xl:py-32 text-center px-4">
            <motion.div
              variants={heroItem}
              initial="hidden"
              whileInView="show"
              viewport={heroViewport}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="text-white text-2xl font-medium tracking-[0.45em] uppercase"
            >
              Welcome to
            </motion.div>
            <motion.h1
              variants={heroItem}
              initial="hidden"
              whileInView="show"
              viewport={heroViewport}
              transition={{ duration: 0.55, ease: "easeOut", delay: 0.05 }}
              className="xl:mt-6 mt-4 font-serif xl:text-[50px] text-[40px] sm:text-5xl md:text-6xl font-bold text-white tracking-wide"
            >
              Pools & Pool Lounge
            </motion.h1>
            <motion.div
              variants={heroItem}
              initial="hidden"
              whileInView="show"
              viewport={heroViewport}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
              className="mt-2 text-white text-sm sm:text-base tracking-[0.25em] uppercase"
            >
              Resto Lounge
            </motion.div>

            <div className="mt-14 md:mt-24 lg:mt-22 xl:mt-20 w-full max-w-[200px] md:max-w-[300px] lg:max-w-[500px] xl:max-w-4xl">
              {heroCategories.length > 0 ? (
                <motion.div
                  variants={heroButtons}
                  initial="hidden"
                  whileInView="show"
                  viewport={heroViewport}
                  transition={{ duration: 0.55, ease: "easeOut", delay: 0.15 }}
                  className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 xl:gap-12 justify-center items-center"
                >
                  {heroCategories.map((category) => {
                    const Icon = iconForSlug(category.slug);
                    const label = labelForSlug(category.slug, category.name);
                    const from = category.slug === "food" ? "left" : "right";

                    return (
                      <Button
                        key={category.id}
                        asChild
                        variant="outline"
                        className={[
                          "rounded-[20px] p-2.5 text-[15px] border-dashed bg-white/10 border-white/20 text-white backdrop-blur-md hover:text-white hover:border-white/40 transition-colors",
                          slideOverlayClasses(from),
                          hoverBgForCategory(category.slug),
                        ].join(" ")}
                      >
                        <Link href={`/menu/${category.slug}`}>
                          <span className="relative z-10 inline-flex items-center gap-2">
                            <Icon className="size-4" />
                            {label}
                          </span>
                        </Link>
                      </Button>
                    );
                  })}
                </motion.div>
              ) : (
                <div className="text-white/75 text-sm">Menu categories will appear here once configured.</div>
              )}
            </div>

            <div className="mt-10 md:mt-28 lg:mt-24 xl:mt-32 flex flex-col items-center gap-4">
              <div className="inline-flex items-center gap-2  text-sm font-medium text-white">
                <Clock className="size-4 text-white" />
                Opening Hours: <span className="text-white/95">24 Hours</span>
              </div>

              <motion.button
                type="button"
                onClick={scrollToSections}
                whileHover={{ y: 4, scale: 1.06 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="inline-flex items-center justify-center size-10 text-white hover:text-white transition-colors cursor-pointer"
                aria-label="Scroll"
              >
                <ChevronDown className="size-5" />
              </motion.button>
            </div>
          </div>
        </div>
        </Container>
      </section>

      <section id="about-us" className="bg-linear-to-b from-[#071b2f] to-[#04101d] py-16 sm:py-20">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="max-w-2xl">
              <motion.div
                variants={heroItem}
                initial="hidden"
                whileInView="show"
                viewport={heroViewport}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="text-xs tracking-[0.35em] uppercase text-[#FED75E] font-serif"
              >
                POOLS & POOL story
              </motion.div>
              <motion.h2
                variants={heroItem}
                initial="hidden"
                whileInView="show"
                viewport={heroViewport}
                transition={{ duration: 0.55, ease: "easeOut", delay: 0.05 }}
                className="mt-2 font-serif text-4xl sm:text-5xl font-bold text-white"
              >
                About Us
              </motion.h2>
              <motion.p
                variants={heroItem}
                initial="hidden"
                whileInView="show"
                viewport={heroViewport}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
                className="mt-5 text-white text-sm sm:text-base xl:text-[20px] leading-relaxed font-serif"
              >
                Welcome to Pools & Pool — our lounge bar experience is built around great food, creative cocktails, and a
                vibrant atmosphere. In the heart of the city, join us for an unforgettable culinary journey and a
                memorable social experience.
              </motion.p>
            </div>

            <motion.div
              variants={aboutMedia}
              initial="hidden"
              whileInView="show"
              viewport={heroViewport}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
              className="w-full lg:justify-self-end"
            >
            <div className="w-full lg:max-w-xl xl:max-w-2xl mx-auto lg:mx-0 rounded-3xl overflow-hidden shadow-2xl shadow-black/30 p-2.5">

                <div className="relative aspect-4/5 w-full">
                  <Swiper
                    modules={[Autoplay, EffectFade]}
                    effect="fade"
                    slidesPerView={1}
                    loop
                    allowTouchMove={false}
                    autoplay={{ delay: 3500, disableOnInteraction: false }}
                    className="absolute inset-0 h-full w-full rounded-3xl"
                  >
                    {["/about1.jpg", "/about2.png", "/about3.jpg", "/about4.png"].map((src) => (
                      <SwiperSlide key={src} className="h-full w-full">
                        <div className="relative h-full w-full">
                          <Image src={src} alt="Pools & Pool" fill className="object-cover" priority={false} />
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>
    </div>
  );
}
