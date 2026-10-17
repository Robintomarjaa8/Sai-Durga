import { WhatsAppLink } from "@/components/whatsapp-link";
import { business, phoneHref } from "@/lib/business";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="content-container footer-main">
        <div className="footer-brand-column">
          <a className="footer-brand" href="#home">{business.name}</a>
          <p>{business.tagline}</p>
          <span className="footer-slogan">{business.slogan}</span>
        </div>
        <div className="footer-services">
          <span className="footer-heading">SERVICES</span>
          {business.services.map((service) => <span key={service}>{service}</span>)}
        </div>
        <nav className="footer-nav" aria-label="Footer navigation">
          <span className="footer-heading">EXPLORE</span>
          <a href="#courses">Courses</a>
          <a href="#branches">Branches</a>
          <a href="#rto-services">RTO services</a>
          <a href="#faqs">FAQs</a>
          <a href="#about">About</a>
        </nav>
        <div className="footer-contact">
          <span className="footer-heading">CALL OR MESSAGE</span>
          {business.phones.map((phone) => (
            <a href={phoneHref(phone)} key={phone}>{phone}</a>
          ))}
          <WhatsAppLink
            className="footer-whatsapp"
            message="Hello, I would like to enquire with Sai Durga Motor Driving School in Hyderabad, Telangana."
            label="Contact Sai Durga Motor Driving School on WhatsApp"
          >
            WhatsApp us <span aria-hidden="true">↗</span>
          </WhatsAppLink>
        </div>
      </div>
      <div className="content-container footer-bottom">
        <span>© {business.name}</span>
        <span>{business.branches.map((branch) => branch.location).join("  ·  ")}</span>
      </div>
    </footer>
  );
}
