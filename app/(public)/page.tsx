"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Clock, Flame, GlassWater, MapPin, UtensilsCrossed } from "lucide-react";
import { motion } from "framer-motion";
import { Autoplay, EffectFade } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { MenuIcon } from "@/components/ui/menu-icon";
import { TikTokIcon } from "@/components/ui/tiktok-icon";
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
            <Link href="/" className="inline-flex items-center hover:opacity-95 transition-opacity">
              <Image
                src="/logo/logo.png"
                alt="PS & P"
                width={110}
                height={44}
                className="w-30 h-auto object-contain"
                priority
              />
            </Link>
            <Link
              href="/"
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

        <div className="relative z-10 p-4">
          <motion.div
            variants={heroItem}
            initial="hidden"
            whileInView="show"
            viewport={heroViewport}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="mx-auto max-w-6xl overflow-hidden rounded-3xl border border-white/15 bg-white/5"
          >
            <iframe
              title="Pools & Pool location"
              className="h-[320px] w-full md:h-[420px] lg:h-[480px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3962.8122478285086!2d3.2627492108925615!3d6.6701723932970465!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b975c6616c2ad%3A0xd2332136489f232b!2s1%20Wuraola%20St%2C%20Alagbado%2C%20Lagos%20100271%2C%20Lagos!5e0!3m2!1sen!2sng!4v1770471518423!5m2!1sen!2sng"
            />
          </motion.div>
        </div>
      </section>

      <section className="relative overflow-hidden ">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url("/footer.png")' }} />
        <div className="absolute inset-0 bg-[#071b2f]/70" />
       
        <Container className="relative z-10 py-40">
          <div className="max-w-4xl mx-auto text-center">
            

            <motion.div
              variants={heroItem}
              initial="hidden"
              whileInView="show"
              viewport={heroViewport}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="flex justify-center"
            >
              <Image
                src="/logo/logo.png"
                alt="PS & P"
                width={160}
                height={64}
                className="w-40 h-auto object-contain"
              />
            </motion.div>

            <motion.h2
              variants={heroItem}
              initial="hidden"
              whileInView="show"
              viewport={heroViewport}
              transition={{ duration: 0.55, ease: "easeOut", delay: 0.06 }}
              className="mt-4 font-serif text-[40px] font-semibold text-white"
            >
              AWAITING YOUR ARRIVAL. EVERY NIGHT
            </motion.h2>

            <motion.div
              variants={heroItem}
              initial="hidden"
              whileInView="show"
              viewport={heroViewport}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.12 }}
              className="mt-5 space-y-4 text-white text-lg md:text-xl font-serif"
            >
              <div>From 12:00 PM to 12:00 AM</div>
              <div className="">1 Wuraola Street off AIT ROAD behind Emmatos Superstores, Omoreghe Kola, Alagbado</div>
              <div>+234 703 973 6454</div>
            </motion.div>

            <motion.div
              variants={heroItem}
              initial="hidden"
              whileInView="show"
              viewport={heroViewport}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.18 }}
              className="mt-8 flex flex-col items-center gap-5"
            >
              <Button
                asChild
                variant="outline"
                className="h-12 rounded-xl font-serif uppercase border border-[#FED75E]/70 bg-[#FED75E] px-8 text-[#071b2f] shadow-lg shadow-black/30 hover:bg-[#f6c93d] hover:text-[#071b2f]"
              >
                <a
                  href="https://maps.app.goo.gl/pvEm6dvsytznFkN37"
                  target="_blank"
                  rel="noreferrer"
                >
                  <MapPin className="size-4" />
                  Find us on Google Maps
                </a>
              </Button>

              <div className="flex items-center gap-4 text-white">
                <Link href="https://www.tiktok.com/@poolsandpool" target="_blank">
                <button
                  type="button"
                  className="inline-flex items-center justify-center size-12  hover:text-[#FED75E]/70 transition-color cursor-pointer"
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
    </div>
  );
}
