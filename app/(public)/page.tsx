"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Clock, MapPin, UtensilsCrossed } from "lucide-react";
import { motion } from "framer-motion";
import { Autoplay, EffectFade } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { TikTokIcon } from "@/components/ui/tiktok-icon";
import { usePublicCategories } from "@/lib/api/public/hooks";

import "swiper/css";
import "swiper/css/effect-fade";

export default function HomePage() {
  const { data: categories = [], isPending } = usePublicCategories();
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

  const slideOverlayClasses = (from: "left" | "right") => {
    const base =
      "relative overflow-hidden before:content-[''] before:absolute before:inset-px before:rounded-[inherit] before:pointer-events-none before:z-0 before:transition-transform before:duration-300 before:ease-out";
    const dir =
      from === "left"
        ? "before:-translate-x-full hover:before:translate-x-0 group-hover:before:translate-x-0"
        : "before:translate-x-full hover:before:translate-x-0 group-hover:before:translate-x-0";
    return `${base} ${dir}`;
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
    

          <div className="flex-1 flex flex-col items-center py-32 xl:py-40 text-center px-4">
            <motion.div
              variants={heroItem}
              initial="hidden"
              whileInView="show"
              viewport={heroViewport}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="text-white text-2xl font-semibold  uppercase font-serif"
            >
              Welcome to
            </motion.div>
            <motion.h1
              variants={heroItem}
              initial="hidden"
              whileInView="show"
              viewport={heroViewport}
              transition={{ duration: 0.55, ease: "easeOut", delay: 0.05 }}
              className="xl:mt-6 mt-4 font-serif text-5xl md:text-6xl font-bold text-white"
            >
              Pools & Pool Lounge
            </motion.h1>
           

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
                  {heroCategories.map((category, index) => {
                    const from = index === 0 ? "left" : "right";
                    return (
                      <Button
                        key={category.id}
                        asChild
                        variant="outline"
                        className={[
                          "rounded-[20px] p-2.5 text-[15px] border-dashed bg-white/10 border-white/20 text-white backdrop-blur-md hover:text-white hover:border-white/40 transition-colors before:bg-primary",
                          slideOverlayClasses(from),
                        ].join(" ")}
                      >
                        <Link href={`/menu/${category.slug}`}>
                          <span className="relative z-10 inline-flex items-center gap-2">
                            <UtensilsCrossed className="size-4" />
                            {category.name.toUpperCase()}
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
                className="text-xs uppercase text-[#FED75E] font-serif"
              >
                POOLS & POOL story
              </motion.div>
              <motion.h2
                variants={heroItem}
                initial="hidden"
                whileInView="show"
                viewport={heroViewport}
                transition={{ duration: 0.55, ease: "easeOut", delay: 0.05 }}
                className="mt-2 font-serif text-[50px] font-semibold text-white"
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

      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url("/unveil.png")' }}
        />
        <div className="absolute inset-0 bg-[#071b2f]/70" />

        <Container className="relative z-10 py-16 sm:py-20 xl:py-28">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2
              variants={heroItem}
              initial="hidden"
              whileInView="show"
              viewport={heroViewport}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="font-serif text-[50px] font-semibold text-white"
            >
              UNVEIL A WORLD OF DELIGHTS
            </motion.h2>

            <motion.div
              variants={heroItem}
              initial="hidden"
              whileInView="show"
              viewport={heroViewport}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.08 }}
              className="mt-6 mx-auto h-px w-28 bg-white"
            />

            <motion.div
              variants={heroItem}
              initial="hidden"
              whileInView="show"
              viewport={heroViewport}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.14 }}
              className="mt-6  text-sm sm:text-base text-white font-jost-sans"
            >
              Explore our enticing menu and unlock a realm of delectable offerings at Pools & Pool. From tantalizing
              appetizers to mouthwatering main courses and irresistible desserts, our menu is a gateway to a world of
              culinary delights.
            </motion.div>
          </div>
        </Container>
      </section>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url("/footer.png")' }} />
        <div className="absolute inset-0 bg-[#071b2f]/70" />

        <div className="relative z-10 p-4 max-h-[320px]">
          <div className="mx-auto overflow-hidden">
            <div className="relative aspect-video w-full">
              <iframe
                title="Pools & Pool location"
                className="absolute inset-0 h-full w-full"
                loading="eager"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3962.8122478285086!2d3.2627492108925615!3d6.6701723932970465!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b975c6616c2ad%3A0xd2332136489f232b!2s1%20Wuraola%20St%2C%20Alagbado%2C%20Lagos%20100271%2C%20Lagos!5e0!3m2!1sen!2sng!4v1770471518423!5m2!1sen!2sng"
              />
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
