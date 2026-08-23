"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SearchBar } from "@/components/SearchBar";
import type { HomepageHeroSlide } from "@/data";

export function Hero({ slides }: { slides: HomepageHeroSlide[] }) {
  const [active, setActive] = useState(0);
  const safeActive = Math.min(active, Math.max(slides.length - 1, 0));
  useEffect(() => {
    if (slides.length < 2) return;
    const id = window.setInterval(() => setActive((value) => (value + 1) % slides.length), 6000);
    return () => window.clearInterval(id);
  }, [slides.length]);
  if (!slides.length) return null;
  const slide = slides[safeActive];

  return <section className="bg-white px-4 pb-12 pt-3 md:px-8 md:pb-20"><div className="relative mx-auto h-[580px] max-w-7xl overflow-hidden rounded-[2rem] bg-[#f3f8ff] md:h-[470px] md:rounded-[1.4rem]"><div className="absolute inset-y-0 right-0 w-full md:w-[62%]"><Image key={`${slide.id}-desktop`} src={slide.desktopImageUrl} alt={slide.title} priority fill sizes="(min-width: 768px) 60vw, 100vw" className="hidden object-cover object-center md:block" /><Image key={`${slide.id}-mobile`} src={slide.mobileImageUrl ?? slide.desktopImageUrl} alt="" aria-hidden fill sizes="100vw" className="object-cover object-center md:hidden" /><div className="absolute inset-0 bg-[linear-gradient(90deg,#f3f8ff_0%,rgb(243_248_255_/_0.28)_55%,transparent_100%)]" /></div><div className="absolute inset-x-5 top-5 z-10 md:hidden"><SearchBar square placeholder="Search phones, laptops and more..." /></div><div className="relative flex h-full max-w-full items-start px-6 pt-36 md:max-w-[58%] md:items-center md:px-16 md:py-12"><div><p className="font-display text-[clamp(1.6rem,7vw,2.35rem)] font-extrabold leading-tight tracking-tight text-accent md:text-[clamp(2rem,4vw,3.8rem)]">{slide.kicker}</p><h1 className="mt-2 line-clamp-3 max-w-[16rem] font-display text-[clamp(2.3rem,10vw,3.2rem)] font-extrabold leading-[1.04] tracking-[-0.045em] text-primary md:max-w-none md:line-clamp-none md:text-[clamp(2.35rem,5vw,4.6rem)] md:leading-[.98]">{slide.title}</h1><div className="my-5 h-1 w-20 rounded-full bg-brand-pink" /><p className="line-clamp-2 max-w-md text-base leading-relaxed text-primary/75 md:line-clamp-none md:text-xl">{slide.subtitle}</p><Link href={slide.actionUrl} className="absolute bottom-16 left-6 inline-flex items-center gap-3 rounded-xl bg-brand-pink px-6 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-brand-pink/90 md:static md:mt-7">{slide.actionLabel}<ArrowRight className="h-4 w-4" /></Link></div></div><div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2">{slides.map((item, index) => <button key={item.id} onClick={() => setActive(index)} aria-label={`Go to campaign ${index + 1}`} className={`h-2.5 rounded-full ${safeActive === index ? "w-7 bg-brand-pink" : "w-2.5 bg-primary/25"}`} />)}</div></div></section>;
}
