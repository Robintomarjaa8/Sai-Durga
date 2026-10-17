import Image from "next/image";

export function CarHeroFallback() {
  return (
    <Image
      className="hero-car-fallback"
      src="/images/hero-car-premium.png"
      width={1792}
      height={1024}
      priority
      alt="A polished blue driving school car"
      draggable={false}
    />
  );
}
