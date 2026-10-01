import { Fragment } from "react";
import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import StatBand from "@/components/StatBand";
import SectionHead from "@/components/SectionHead";
import ServiceCard from "@/components/ServiceCard";
import WhyCard from "@/components/WhyCard";
import AboutMedia from "@/components/AboutMedia";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import ProcessSweep from "@/components/ProcessSweep";
import Gallery from "@/components/Gallery";
import TestimonialCarousel from "@/components/TestimonialCarousel";
import TestimonialCard from "@/components/TestimonialCard";
import PricingCard from "@/components/PricingCard";
import FAQAccordion from "@/components/FAQAccordion";
import CTABanner from "@/components/CTABanner";
import ContactForm from "@/components/ContactForm";
import Button from "@/components/Button";
import dataRaw from "@/data/data.json";
import type { HomeData, IconCard, SiteData } from "@/data/types";

const home = dataRaw.home as HomeData;
const site = dataRaw.site as SiteData;

export const metadata: Metadata = {
  title: home.meta.title,
  description: home.meta.description,
  keywords: home.meta.keywords,
};

const { hero, stats, services, about, whyChoose, process, beforeAfter, gallery, testimonials, pricing, faq, cta, contact } = home;

const { items: serviceItems, ...servicesHead } = services;
const { items: whyItems, ...whyHead } = whyChoose;
const { items: processItems, ...processHead } = process;
const { items: testimonialItems, ...testimonialsHead } = testimonials;
const { items: faqItems, ...faqHead } = faq;
const { plans: pricingItems, ...pricingHead } = pricing;

function HeroTitle() {
  const lines = hero.title.pre.split("\n");
  return (
    <h1 className="hero-title">
      {lines.map((line, i) => (
        <Fragment key={i}>
          <span className="line">{line}</span>
          {i < lines.length - 1 && " "}
        </Fragment>
      ))}
      {hero.title.accent && (
        <span className="accent">
          <span className="shine">{hero.title.accent}</span>
          <svg
            className="squiggle"
            viewBox="0 0 220 14"
            fill="none"
            aria-hidden="true"
            preserveAspectRatio="none"
          >
            <path
              d="M4 10 C 40 3, 70 12, 108 8 S 180 4, 216 9"
              strokeLinecap="round"
              strokeWidth="5"
            />
          </svg>
        </span>
      )}
    </h1>
  );
}

function ContactList() {
  const items = [
    {
      icon: "fa-phone",
      label: "Call Us",
      value: <a href={site.phoneHref}>{site.phone}</a>,
    },
    {
      icon: "fa-envelope",
      label: "Email Us",
      value: <a href={site.emailHref}>{site.email}</a>,
    },
    {
      icon: "fa-location-dot",
      label: "Visit Us",
      value: (
        <>
          {site.addressLines[0]}
          <br />
          {site.addressLines[1]}
        </>
      ),
    },
    {
      icon: "fa-clock",
      label: "Working Hours",
      value: (
        <>
          {site.hoursShort.map((hour, i) => (
            <Fragment key={hour.days}>
              {i > 0 && <br />}
              {hour.days}: {hour.time}
            </Fragment>
          ))}
        </>
      ),
    },
  ];
  return (
    <ul className="contact-list">
      {items.map((item) => (
        <li key={item.label}>
          <span className="c-icon">
            <i className={`fa-solid ${item.icon}`}></i>
          </span>
          <div>
            <div className="c-label">{item.label}</div>
            <div className="c-value">{item.value}</div>
          </div>
        </li>
      ))}
    </ul>
  );
}

function TrustGroup({ items, clone = false }: { items: IconCard[]; clone?: boolean }) {
  return (
    <div className={`trust-group${clone ? " trust-group--clone" : ""}`} aria-hidden={clone || undefined}>
      {items.map((item) => (
        <Fragment key={item.title}>
          <div className="trust-item">
            <span className="trust-icon">
              <i className={`fa-solid ${item.icon}`}></i>
            </span>
            {item.title}
          </div>
          <span className="trust-sep" aria-hidden="true"></span>
        </Fragment>
      ))}
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      {/* Hero Start */}
      <section className="hero">
        <video className="hero-video" autoPlay muted loop playsInline poster={hero.poster} aria-hidden="true">
          <source src={hero.video} type="video/mp4" />
        </video>
        <div className="hero-overlay" aria-hidden="true"></div>
        <div className="hero-aurora" aria-hidden="true"></div>
        <div className="hero-grid-lines" aria-hidden="true"></div>
        <div className="hero-orb o1" aria-hidden="true"></div>
        <div className="hero-orb o2" aria-hidden="true"></div>
        <div className="hero-orb o3" aria-hidden="true"></div>
        {hero.floatIcons.map((icon, i) => (
          <div className={`hero-float-icon fi${i + 1}`} key={icon} aria-hidden="true">
            <i className={`fa-solid ${icon}`}></i>
          </div>
        ))}
        <div className="container hero-inner">
          <div className="row align-items-center g-5">
            <div className="col-lg-7 hero-copy">
              <HeroTitle />
              <p className="hero-subtitle">{hero.subtitle}</p>
              <div className="hero-actions">
                <Button href={hero.primaryCta.href} variant="accent" size="lg" className="px-4 px-sm-5">
                  <i className={`fa-solid ${hero.primaryCta.icon}`}></i> {hero.primaryCta.label}{" "}
                  <i className="fa-solid fa-arrow-right arrow"></i>
                </Button>
                <Button href={hero.secondaryCta.href} variant="outline-light" size="lg" className="px-4 px-sm-5">
                  {hero.secondaryCta.label}
                </Button>
              </div>
              <div className="hero-trust">
                <div className="trust-marquee">
                  <div className="trust-track">
                    <TrustGroup items={hero.trustItems} />
                    <TrustGroup items={hero.trustItems} clone />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <a href="#services" className="scroll-cue" aria-label={hero.scrollCue}>
          <div className="mouse"></div>
          {hero.scrollCue}
        </a>
      </section>
      {/* Hero End */}

      <StatBand stats={stats} />

      {/* Services Start */}
      <section className="section" id="services">
        <div className="container">
          <Reveal>
            <SectionHead center {...servicesHead} />
          </Reveal>
          <div className="row g-4">
            {serviceItems.map((service, i) => (
              <div className="col-md-6 col-lg-3" key={service.title}>
                <Reveal delay={i * 80} className="h-100">
                  <ServiceCard {...service} />
                </Reveal>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Services End */}

      {/* About Start */}
      <section className="section bg-surface" id="about">
        <div className="container">
          <div className="row g-5 align-items-center">
            <div className="col-lg-6">
              <Reveal direction="left">
                <AboutMedia {...about.media} />
              </Reveal>
            </div>
            <div className="col-lg-6">
              <Reveal direction="right">
                <SectionHead className="mb-4" {...about.heading} />
                <ul className="checklist mb-4">
                  {about.checklist.map((item) => (
                    <li key={item.strong}>
                      <i className="fa-solid fa-circle-check"></i>{" "}
                      <span>
                        <strong>{item.strong}</strong> {item.text}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-4">
                  <Button href={about.primaryCta.href} variant="primary">
                    {about.primaryCta.icon && <i className={`fa-solid ${about.primaryCta.icon}`}></i>}{" "}
                    {about.primaryCta.label}
                  </Button>
                  <Button href={about.secondaryCta.href} variant="outline-primary">
                    {about.secondaryCta.label}
                  </Button>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
      {/* About End */}

      {/* Why Choose Start */}
      <section className="section" id="why-choose">
        <div className="container">
          <Reveal>
            <SectionHead center {...whyHead} />
          </Reveal>
          <div className="row g-4">
            {whyItems.map((item, i) => (
              <div className="col-md-6 col-lg-4" key={item.title}>
                <Reveal delay={(i % 3) * 80}>
                  <WhyCard {...item} />
                </Reveal>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Why Choose End */}

      {/* Process Start */}
      <section className="section bg-soft" id="process">
        <div className="container">
          <Reveal>
            <SectionHead center {...processHead} />
          </Reveal>
          <ProcessSweep>
            <div className="row process-wrap g-4">
              {processItems.map((step, i) => (
                <div className="col-md-4 process-step" key={step.title}>
                  <Reveal delay={i * 120}>
                    <div className="step-num">{i + 1}</div>
                    <div className="step-icon">
                      <i className={`fa-solid ${step.icon}`}></i>
                    </div>
                    <h4>{step.title}</h4>
                    <p>{step.desc}</p>
                  </Reveal>
                </div>
              ))}
            </div>
          </ProcessSweep>
        </div>
      </section>
      {/* Process End */}

      {/* Before / After Start */}
      <section className="section" id="before-after">
        <div className="container">
          <Reveal>
            <SectionHead center {...beforeAfter.heading} />
          </Reveal>
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <Reveal direction="zoom">
                <BeforeAfterSlider
                  beforeImg={beforeAfter.beforeImg}
                  afterImg={beforeAfter.afterImg}
                  beforeAlt={beforeAfter.beforeAlt}
                  afterAlt={beforeAfter.afterAlt}
                  beforeLabel={beforeAfter.beforeLabel}
                  afterLabel={beforeAfter.afterLabel}
                />
              </Reveal>
            </div>
          </div>
        </div>
      </section>
      {/* Before / After End */}

      {/* Gallery Start */}
      <section className="section bg-surface" id="gallery">
        <div className="container">
          <Gallery {...gallery} />
        </div>
      </section>
      {/* Gallery End */}

      {/* Testimonials Start */}
      <section className="section testimonial-section" id="testimonials">
        <div className="container">
          <Reveal>
            <SectionHead center {...testimonialsHead} />
          </Reveal>
          <TestimonialCarousel>
            {testimonialItems.map((item) => (
              <TestimonialCard key={item.name} {...item} />
            ))}
          </TestimonialCarousel>
        </div>
      </section>
      {/* Testimonials End */}

      {/* Pricing Start */}
      <section className="section" id="pricing">
        <div className="container">
          <Reveal>
            <SectionHead center {...pricingHead} />
          </Reveal>
          <div className="row g-4 justify-content-center align-items-stretch">
            {pricingItems.map((plan, i) => (
              <div className="col-md-6 col-lg-4" key={plan.name}>
                <Reveal delay={i * 120}>
                  <PricingCard {...plan} popularLabel={pricing.popularLabel} />
                </Reveal>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Pricing End */}

      {/* FAQ Start */}
      <section className="section bg-soft" id="faq">
        <div className="container">
          <Reveal>
            <SectionHead center {...faqHead} />
          </Reveal>
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <Reveal>
                <FAQAccordion items={faqItems} />
              </Reveal>
            </div>
          </div>
        </div>
      </section>
      {/* FAQ End */}

      <CTABanner {...cta} />

      {/* Contact Start */}
      <section className="section bg-surface" id="booking">
        <div className="container">
          <Reveal>
            <SectionHead center {...contact.heading} />
          </Reveal>
          <div className="row g-4">
            <div className="col-lg-5">
              <Reveal direction="left">
                <div className="contact-panel">
                   <h3>{contact.panel.title}</h3>
                   <p className="sub">{contact.panel.sub}</p>
                   <ContactList />
                   <Button href="/book" variant="accent" className="mt-4 w-100">
                     <i className="fa-solid fa-calendar-check me-2"></i> Book a Cleaning
                   </Button>
                   <div className="social-links">
                    {site.socials.map((social) => (
                      <a className="social-link" href={social.href} aria-label={social.label} key={social.label}>
                        <i className={social.icon}></i>
                      </a>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>
            <div className="col-lg-7">
              <Reveal direction="right">
                <div className="contact-form-card">
                  <h3 className="mb-1">{contact.formCard.title}</h3>
                  <p className="text-muted mb-4" style={{ fontSize: ".92rem" }}>
                    {contact.formCard.sub}
                  </p>
                  <ContactForm variant="panel" />
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
      {/* Contact End */}
    </>
  );
}
