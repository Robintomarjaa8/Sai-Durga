import { Icon } from "@/components/icon";
import MetroHero from "@/components/ui/scroll-locked-video-hero";
import { WhatsAppLink } from "@/components/whatsapp-link";
import { business } from "@/lib/business";

export function HeroSection() {
  return (
    <MetroHero
      className="homepage-video-hero"
      fallbackImageSrc="/images/hero-car-premium.png"
      fallbackImageAlt="A blue car ready for a driving lesson"
      labelledBy="home-heading"
      scrubDistance={620}
      scrollHint="SCROLL TO EXPLORE"
      signature={false}
    >
      <div className="homepage-hero-copy">
          <p className="homepage-hero-brand">{business.name}</p>
          <h1 id="home-heading">Learn Safe and Confident Driving <span>for a Better Tomorrow.</span></h1>
          <p className="homepage-hero-tagline">{business.tagline}</p>
          <p className="homepage-hero-description">
            Manual and automatic car training, all RTO work and consultation, and pick-up &amp; drop service. Serving Kondapur and Gowlidoddi, Hyderabad.
          </p>
          <div className="homepage-hero-actions">
            <a className="homepage-hero-primary" href="#contact">Enquire about lessons <Icon name="ArrowUpRight" size={17} /></a>
            <WhatsAppLink
              className="homepage-hero-whatsapp"
              message="Hello, I would like to enquire about driving training or RTO consultation at Sai Durga Motor Driving School. My preferred branch is Kondapur or Gowlidoddi, Hyderabad."
              label="Enquire with Sai Durga Motor Driving School on WhatsApp"
            >
              <WhatsAppGlyph /> WhatsApp enquiry
            </WhatsAppLink>
          </div>
          <div className="homepage-hero-services" aria-label="Driving school services">
            <span><Icon name="Check" size={14} /> Manual training</span>
            <span><Icon name="Check" size={14} /> Automatic training</span>
            <span><Icon name="Check" size={14} /> RTO consultation</span>
          </div>
          <a className="homepage-hero-branches" href="#branches"><Icon name="MapPin" size={15} /> Kondapur <i /> Gowlidoddi, Hyderabad <Icon name="ArrowDown" size={13} /></a>
      </div>
    </MetroHero>
  );
}

function WhatsAppGlyph() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="17" height="17" fill="currentColor">
      <path d="M20.52 3.48A11.78 11.78 0 0 0 12.13 0C5.6 0 .28 5.31.28 11.85c0 2.09.55 4.12 1.6 5.91L.18 24l6.39-1.67a11.85 11.85 0 0 0 5.56 1.42h.01c6.53 0 11.85-5.31 11.85-11.85 0-3.17-1.23-6.14-3.47-8.42ZM12.14 21.7h-.01a9.84 9.84 0 0 1-5.02-1.38l-.36-.21-3.79.99 1.01-3.69-.23-.38a9.84 9.84 0 0 1-1.51-5.18c0-5.45 4.44-9.89 9.9-9.89a9.82 9.82 0 0 1 7 2.9 9.82 9.82 0 0 1 2.89 7c0 5.45-4.44 9.89-9.88 9.89Zm5.43-7.41c-.3-.15-1.78-.88-2.06-.98-.28-.1-.48-.15-.68.15-.2.3-.78.98-.95 1.18-.18.2-.35.23-.65.08-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.77-1.66-2.07-.18-.3-.02-.46.13-.61.14-.13.3-.35.45-.53.15-.17.2-.3.3-.5.1-.2.05-.38-.03-.53-.07-.15-.68-1.63-.93-2.23-.24-.58-.49-.5-.68-.51l-.58-.01c-.2 0-.53.08-.8.38-.28.3-1.05 1.03-1.05 2.5s1.08 2.9 1.23 3.1c.15.2 2.12 3.23 5.14 4.53.72.31 1.29.49 1.73.63.73.23 1.39.2 1.91.12.58-.09 1.78-.73 2.03-1.43.25-.7.25-1.3.18-1.43-.08-.13-.28-.2-.58-.35Z" />
    </svg>
  );
}
