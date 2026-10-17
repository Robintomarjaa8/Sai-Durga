"use client";

import { useState } from "react";
import { Reveal } from "@/components/reveal";
import { Icon, type IconName } from "@/components/icon";

const learningSteps = [
  { number: "01", icon: "MessageCircle" as IconName, title: "Send an enquiry", description: "Call or message Sai Durga Motor Driving School with your question." },
  { number: "02", icon: "CarFront" as IconName, title: "Choose your course", description: "Discuss manual or automatic car training and your preferred Hyderabad branch." },
  { number: "03", icon: "CalendarDays" as IconName, title: "Coordinate training", description: "Talk with the team about arranging the next steps for your training." },
  { number: "04", icon: "ShieldCheck" as IconName, title: "Learn safe habits", description: "Focus on confidence, awareness and responsible behaviour on the road." },
];

const faqs = [
  { question: "What is the difference between manual and automatic training?", answer: "Manual training is in a manual car, and automatic training is in an automatic car. Both options are available; contact the school to discuss which you prefer." },
  { question: "Where are the branches?", answer: "The branches are in Kondapur, Hyderabad, Telangana, and Gowlidoddi, Hyderabad, Telangana. Contact the team to discuss your preferred branch." },
  { question: "How can I enquire about training?", answer: "Call any of the three listed school numbers or use a WhatsApp enquiry button on this page." },
  { question: "What RTO support is available?", answer: "The school offers all RTO work and consultation. Contact the team to discuss your enquiry." },
];

export function LearningProcessSection() {
  return (
    <section className="process-section section-space" aria-labelledby="process-title">
      <div className="content-container">
        <Reveal className="section-heading-row">
          <div>
            <p className="eyebrow"><span className="eyebrow-mark" /> GETTING STARTED</p>
            <h2 id="process-title">A clear path to<br /><span>your next drive.</span></h2>
          </div>
        <p className="section-intro">Start with an enquiry, choose a training option, coordinate next steps with the team, and focus on safe driving habits.</p>
        </Reveal>
        <div className="process-grid">
          {learningSteps.map(({ number, icon, title, description }, index) => (
            <Reveal className="process-card-wrap" key={number} delay={index * 0.08}>
              <article className="process-card">
                <div className="process-card-top"><span className="process-icon"><Icon name={icon} size={21} /></span><span className="process-number">STEP {number}</span></div>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FaqSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <section className="faq-section section-space" id="faqs" aria-labelledby="faq-title">
      <div className="content-container faq-layout">
        <Reveal className="faq-intro">
          <p className="eyebrow"><span className="eyebrow-mark" /> GOOD TO KNOW</p>
          <h2 id="faq-title">Questions before<br /><span>you get started?</span></h2>
          <p>For details about your training or RTO enquiry, contact the team directly.</p>
          <a className="faq-contact-link" href="#contact">Talk to Sai Durga <Icon name="ArrowUpRight" size={16} /></a>
        </Reveal>
        <div className="faq-list">
          {faqs.map(({ question, answer }, index) => {
            const isOpen = openFaq === index;
            const triggerId = `faq-trigger-${index}`;
            const panelId = `faq-panel-${index}`;

            return (
              <Reveal key={question} delay={index * 0.045}>
                <div className={`faq-item${isOpen ? " is-open" : ""}`}>
                  <button
                    className="faq-question"
                    id={triggerId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                  >
                    <span>{question}</span><span className="faq-toggle" aria-hidden="true" />
                  </button>
                  <div className="faq-answer" id={panelId} role="region" aria-labelledby={triggerId} hidden={!isOpen}>
                    <p>{answer}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
