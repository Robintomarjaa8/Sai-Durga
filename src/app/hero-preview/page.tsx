import Link from "next/link";
import MetroHero from "@/components/ui/scroll-locked-video-hero";

export default function HeroPreviewPage() {
  return (
    <main>
      <MetroHero
        title="LEARN TODAY. DRIVE TOMORROW."
        tagline="Learn Safe and Confident Driving for a Better Tomorrow"
        scrollHint="SCROLL TO REVEAL"
      />
      <section style={{ minHeight: "55vh", display: "grid", alignContent: "center", justifyItems: "center", gap: 16, padding: "48px 24px", color: "#fff", background: "#071a30", textAlign: "center" }}>
        <h2 style={{ margin: 0, fontSize: "clamp(24px, 4vw, 38px)" }}>Continue your driving journey</h2>
        <p style={{ maxWidth: 560, margin: 0, color: "#c3d0df", lineHeight: 1.7 }}>Explore Sai Durga Motor Driving School’s training options, branches, and enquiry details.</p>
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", minHeight: 44, padding: "0 18px", borderRadius: 8, color: "#071a30", background: "#ffd34f", fontWeight: 700, textDecoration: "none" }}>Visit the main website</Link>
      </section>
    </main>
  );
}
