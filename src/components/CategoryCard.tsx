import Image from "next/image";
import Link from "next/link";

export function CategoryCard({
  href,
  image,
  name,
  tagline,
}: {
  href: string;
  image?: string;
  name: string;
  tagline?: string;
}) {
  return (
    <Link
      href={href}
      className="group relative block aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-[#f8fafc] shadow-card transition duration-300 active:scale-[0.98] md:rounded-[2rem] md:hover:-translate-y-1 md:hover:shadow-elevated"
    >
      {image ? (
        <Image
          src={image}
          alt={tagline ? `${name} — ${tagline}` : name}
          fill
          loading="lazy"
          sizes="(min-width: 768px) 16vw, 50vw"
          className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-brand" />
      )}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-b from-[#1769dc]/0 via-[#1769dc]/75 to-[#06295f]"
      />
      <div
        aria-hidden
        className="absolute inset-x-[-20%] bottom-[-23%] h-[42%] rounded-[50%_50%_0_0/20%_20%_0_0] border-t border-[#00a84f]/35"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-[38%] opacity-[0.10] [background-image:repeating-linear-gradient(155deg,transparent_0,transparent_16px,rgba(255,255,255,.75)_17px,transparent_18px)]"
      />
      <div className="absolute inset-x-0 bottom-0 z-10 p-4 text-white md:p-5">
        <h3 className="line-clamp-2 break-words font-display text-[1.4rem] font-black leading-none tracking-tight drop-shadow-sm sm:text-[1.65rem] md:text-3xl">
          {name}
        </h3>
        <p className="mt-2 truncate text-xs font-medium leading-5 text-white/90 md:text-sm">
          {tagline ||
            (name === "Electronics"
              ? "Used tech you can trust."
              : "Quality pre-owned finds, made easy.")}
        </p>
      </div>
    </Link>
  );
}
