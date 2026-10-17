import { CarHeroFallback } from "@/components/car-hero-fallback";

export function CarHeroShowcase() {
  return (
    <div className="hero-car-stage" aria-label="Blue driving school sedan">
      <div className="stage-grid" aria-hidden="true" />
      <div className="stage-glow" aria-hidden="true" />
      <CarHeroFallback />
      <div className="stage-label stage-label-top"><span className="stage-status" /> SAFE STARTS HERE</div>
      <div className="stage-label stage-label-bottom"><strong>Manual &amp; automatic</strong><span>Training to suit your journey</span></div>
      <span className="stage-number" aria-hidden="true">SD / 01</span>
    </div>
  );
}
