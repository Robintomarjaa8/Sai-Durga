import { Reveal } from "@/components/reveal";
import { Icon, type IconName } from "@/components/icon";
import { WhatsAppLink } from "@/components/whatsapp-link";
import { business, phoneHref } from "@/lib/business";
import { FaqSection, LearningProcessSection } from "@/components/learning-sections";
import { GowlidoddiMapSection } from "@/components/gowlidoddi-map-section";
import { EnquiryForm } from "@/components/enquiry-form";

const courses: { icon: IconName; number: string; title: string; description: string; whatsappMessage?: string }[] = [
  {
    icon: "CarFront" as IconName,
    number: "01",
    title: "Manual car training",
    description: "Learn in a manual car with training shaped around the way you want to drive.",
  },
  {
    icon: "CarFront" as IconName,
    number: "02",
    title: "Automatic car training",
    description: "Choose automatic car training and build familiarity behind the wheel.",
  },
  {
    icon: "MapPin" as IconName,
    number: "03",
    title: "Pick-up & Drop Service Available",
    description: "Ask us about pick-up and drop availability for your driving lessons.",
    whatsappMessage: "Hello Sai Durga Motor Driving School, I would like to know more about your pick-up and drop service.",
  },
];

const reasons = [
  { icon: "ShieldCheck" as IconName, title: "Safe driving habits", body: "Training focused on awareness and safer choices on the road." },
  { icon: "CarFront" as IconName, title: "Beginner-friendly learning", body: "A welcoming place to start learning the basics of driving." },
  { icon: "CarFront" as IconName, title: "Manual or automatic", body: "Choose the car training option that suits your learning goals." },
  { icon: "Check" as IconName, title: "Confidence and responsibility", body: "Build confidence while learning to behave responsibly on the road." },
];

export function HomeSections() {
  return (
    <>
      <section className="courses-section section-space" id="courses" aria-labelledby="courses-title">
        <div className="content-container">
          <Reveal className="section-heading-row">
            <div>
              <p className="eyebrow"><span className="eyebrow-mark" /> WHAT WE DO</p>
              <h2 id="courses-title">Practical help for<br /><span>every next step.</span></h2>
            </div>
            <p className="section-intro">From choosing a transmission to getting RTO guidance, Sai Durga is here to help you take the next step.</p>
          </Reveal>
          <div className="course-grid">
            {courses.map(({ icon, number, title, description, whatsappMessage }, index) => (
              <Reveal className="course-card-wrap" key={number} delay={index * 0.08}>
                <article className="course-card">
                  <div className="course-card-top"><span className="course-icon"><Icon name={icon} size={22} /></span><span className="course-number">{number}</span></div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                  {whatsappMessage ? (
                    <WhatsAppLink className="course-card-link" message={whatsappMessage} label="Ask Sai Durga Motor Driving School about pick-up and drop service on WhatsApp">
                      Ask about this service <Icon name="ArrowUpRight" size={16} />
                    </WhatsAppLink>
                  ) : (
                    <a href="#contact" className="course-card-link">Ask about this service <Icon name="ArrowUpRight" size={16} /></a>
                  )}
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="branches-section section-space" id="branches" aria-labelledby="branches-title">
        <div className="content-container branches-layout">
          <Reveal className="branches-copy">
            <p className="eyebrow eyebrow-on-dark"><span className="eyebrow-mark" /> TWO LOCAL BRANCHES</p>
            <h2 id="branches-title">Your driving journey,<br /><span>closer to home.</span></h2>
            <p>Find Sai Durga Motor Driving School in Kondapur or Gowlidoddi, Hyderabad, Telangana. Get in touch to discuss your preferred branch.</p>
            <a className="branch-contact-link" href="#contact">Contact the school <Icon name="ArrowUpRight" size={16} /></a>
          </Reveal>
          <div className="branch-card-grid">
            {business.branches.map((branch, index) => (
              <Reveal key={branch.name} delay={index * 0.1}>
                <article className={`branch-card branch-card-${index + 1}`}>
                  <span className="branch-card-index">0{index + 1} / 02</span>
                  <Icon name="MapPin" size={21} />
                  <h3>
                    {branch.name === "Gowlidoddi" ? (
                      <a
                        className="branch-map-name"
                        href={business.gowlidoddiMapsLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Open the Gowlidoddi branch in Google Maps"
                      >
                        {branch.name} <Icon name="ArrowUpRight" size={14} />
                      </a>
                    ) : branch.name}
                  </h3>
                  <p className="branch-card-location">{branch.location}</p>
                  <span className="branch-card-rule" />
                  <p>Manual &amp; automatic car training</p>
                  <div className="branch-card-actions">
                    <WhatsAppLink
                      className="branch-card-link"
                      message={`Hello, I would like to enquire about car training at the ${branch.location} branch.`}
                      label={`Enquire about car training at the ${branch.location} branch on WhatsApp`}
                    >
                      WhatsApp enquiry <Icon name="ArrowUpRight" size={15} />
                    </WhatsAppLink>
                    <a className="branch-call-link" href={phoneHref(business.phones[0])} aria-label={`Call Sai Durga Motor Driving School about the ${branch.location} branch`}>Call school</a>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
          <GowlidoddiMapSection />
        </div>
      </section>

      <section className="why-section section-space" id="about" aria-labelledby="why-title">
        <div className="content-container why-layout">
          <Reveal>
            <p className="eyebrow"><span className="eyebrow-mark" /> WHY SAI DURGA</p>
            <h2 id="why-title">Why choose<br /><span>Sai Durga Motor<br />Driving School?</span></h2>
            <p className="why-description">Learn Safe and Confident Driving for a Better Tomorrow.</p>
          </Reveal>
          <div className="reason-list">
            {reasons.map(({ icon, title, body }, index) => (
              <Reveal key={title} delay={index * 0.07}>
                <div className="reason-item">
                  <span className="reason-icon"><Icon name={icon} size={19} /></span>
                  <div><h3>{title}</h3><p>{body}</p></div>
                  <span className="reason-index">0{index + 1}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="rto-section" id="rto-services" aria-labelledby="rto-title">
        <div className="content-container rto-panel">
          <div className="rto-emblem"><Icon name="ShieldCheck" size={28} /></div>
          <div className="rto-copy">
            <p className="eyebrow"><span className="eyebrow-mark" /> NEED RTO GUIDANCE?</p>
            <h2 id="rto-title">All RTO work<br /><span>and consultation.</span></h2>
            <p>Speak with Sai Durga Motor Driving School about RTO work and consultation.</p>
          </div>
          <WhatsAppLink
            className="action-button action-outline"
            message="Hello, I would like to enquire about RTO work and consultation in Hyderabad, Telangana."
            label="Enquire about RTO work and consultation on WhatsApp"
          >
            Talk to our team <Icon name="ArrowUpRight" size={17} />
          </WhatsAppLink>
        </div>
      </section>

      <LearningProcessSection />
      <FaqSection />

      <section className="contact-section section-space" id="contact" aria-labelledby="contact-title">
        <div className="content-container contact-layout">
          <Reveal className="contact-copy">
            <p className="eyebrow eyebrow-on-dark"><span className="eyebrow-mark" /> YOUR NEXT STEP</p>
            <h2 id="contact-title">Let’s get<br /><span>you moving.</span></h2>
            <p>Call Sai Durga Motor Driving School or send a WhatsApp enquiry about training or RTO consultation.</p>
            <div className="contact-cta-group">
              <WhatsAppLink
                className="action-button action-whatsapp contact-whatsapp"
                message="Hello, I would like to enquire about manual or automatic car training, or RTO work and consultation at Sai Durga Motor Driving School in Hyderabad, Telangana."
                label="Enquire with Sai Durga Motor Driving School on WhatsApp"
              >
                <span className="whatsapp-dot" aria-hidden="true" /> Send a WhatsApp enquiry <Icon name="ArrowUpRight" size={17} />
              </WhatsAppLink>
              <WhatsAppLink
                className="action-button pickup-contact-link"
                message="Hello Sai Durga Motor Driving School, I would like to know more about your pick-up and drop service."
                label="Ask about pick-up and drop service on WhatsApp"
              >
                Ask about pick-up &amp; drop <Icon name="ArrowUpRight" size={17} />
              </WhatsAppLink>
            </div>
          </Reveal>
          <div className="contact-details">
            <div className="contact-detail-heading"><span>CALL THE SCHOOL</span><span>INDIA</span></div>
            {business.phones.map((phone) => (
              <a className="phone-row" href={phoneHref(phone)} key={phone}>
              <span>{phone}</span><Icon name="ArrowUpRight" size={16} />
              </a>
            ))}
            <div className="contact-branches"><span>BRANCHES</span><p>{business.branches.map((branch) => branch.location).join("  ·  ")}</p></div>
          </div>
          <EnquiryForm />
        </div>
      </section>
    </>
  );
}
