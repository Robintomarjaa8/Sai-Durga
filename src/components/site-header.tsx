"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { business, phoneHref } from "@/lib/business";

const navigation = [
  { label: "Home", href: "#home" },
  { label: "About us", href: "#about" },
  { label: "Courses", href: "#courses" },
  { label: "Branches", href: "#branches" },
  { label: "RTO services", href: "#rto-services" },
];

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuToggleRef = useRef<HTMLButtonElement>(null);

  function closeMenu(restoreFocus = false) {
    setMenuOpen(false);
    if (restoreFocus) menuToggleRef.current?.focus();
  }

  useEffect(() => {
    if (!menuOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuToggleRef.current?.focus();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

  return (
    <>
      <div className="utility-bar">
        <div className="site-container utility-inner">
          <p className="utility-call">Call us <a href={phoneHref(business.phones[0])}>{business.phones[0]}</a></p>
          <p className="utility-branches">Hyderabad, Telangana <span aria-hidden="true">·</span> {business.branches.map((branch) => branch.name).join(" / ")}</p>
        </div>
      </div>
      <header className="site-header">
        <div className="site-container header-inner">
          <a className="brand" href="#home" aria-label="Sai Durga Motor Driving School home" onClick={() => closeMenu()}>
            <span className="brand-mark" aria-hidden="true"><span>SD</span><i /></span>
            <span className="brand-copy">
              <span className="brand-name">Sai Durga</span>
              <span className="brand-description">MOTOR DRIVING SCHOOL</span>
            </span>
          </a>

          <button
            ref={menuToggleRef}
            className={`menu-toggle${menuOpen ? " is-open" : ""}`}
            type="button"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            aria-controls="primary-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span /><span /><span />
          </button>

          <nav id="primary-navigation" className={`primary-nav${menuOpen ? " is-open" : ""}`} aria-label="Main navigation">
            {navigation.map((item) => (
              <a key={item.href} href={item.href} onClick={() => closeMenu(true)}>{item.label}</a>
            ))}
            <a className="nav-cta" href="#contact" onClick={() => closeMenu(true)}>
              Book a lesson <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </nav>
        </div>
      </header>
    </>
  );
}
