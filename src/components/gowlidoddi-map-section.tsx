import { business } from "@/lib/business";

const placeQuery = encodeURIComponent(
  `${business.name}, ${business.gowlidoddiAddress}`,
);
// Google Maps' classic output=embed URL supports address queries without an API key.
const embedUrl = `https://maps.google.com/maps?q=${placeQuery}&z=16&output=embed`;

export function GowlidoddiMapSection() {
  return (
    <section className="gowlidoddi-map" aria-labelledby="gowlidoddi-map-title">
      <div className="gowlidoddi-map-copy">
        <p className="eyebrow eyebrow-on-dark"><span className="eyebrow-mark" /> GOWLIDODDI BRANCH</p>
        <h3 id="gowlidoddi-map-title">Find us in <span>Gowlidoddi.</span></h3>
        <p className="gowlidoddi-map-address">{business.name}<br />{business.gowlidoddiAddress}</p>
        <a
          className="action-button map-directions-button"
          href={business.gowlidoddiMapsLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          Get directions <span aria-hidden="true">↗</span>
        </a>
      </div>
      <div className="gowlidoddi-map-frame">
        <iframe
          title="Google Map search for Sai Durga Motor Driving School at the supplied Gowlidoddi address"
          src={embedUrl}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          aria-label="Interactive Google Map using the supplied Sai Durga Motor Driving School Gowlidoddi address"
        />
        <p className="map-address-note">Map search uses the supplied business name and address. The precise business marker has not been independently verified.</p>
      </div>
    </section>
  );
}
