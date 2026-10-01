import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import PageHeader from "@/components/PageHeader";
import SectionHead from "@/components/SectionHead";
import ServiceCard from "@/components/ServiceCard";
import AboutMedia from "@/components/AboutMedia";
import PricingCard from "@/components/PricingCard";
import Button from "@/components/Button";
import dataRaw from "@/data/data.json";
import type { ServicesData } from "@/data/types";

const services = dataRaw.services as ServicesData;

export const metadata: Metadata = {
  title: services.meta.title,
  description: services.meta.description,
  keywords: services.meta.keywords,
};

export default function ServicesPage() {
  const { pageHeader, overview, moveOut, specialized, pricing } = services;
  const { items: overviewItems, ...overviewHead } = overview;
const { items: specializedItems, ...specializedHead } = specialized;
const { plans: pricingItems, ...pricingHead } = pricing;

  return (
    <>
      <PageHeader title={pageHeader.title} crumb={pageHeader.crumb} variant={pageHeader.variant} />

      {/* Services Overview Start */}
      <section className="section bg-soft" id="services">
        <div className="container">
          <Reveal>
            <SectionHead center {...overviewHead} />
          </Reveal>
          <div className="row g-4">
            {overviewItems.map((service, i) => (
              <div className="col-md-6 col-lg-4" key={service.title}>
                <Reveal delay={i * 100}>
                  <ServiceCard {...service} />
                </Reveal>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Services Overview End */}

      {/* Detailed Services Start */}
      <section className="section">
        <div className="container">
          <div className="row g-5 align-items-center">
            <div className="col-lg-6">
              <Reveal direction="left">
                <SectionHead className="mb-4" {...moveOut.heading} />
                <ul className="checklist mb-4">
                  {moveOut.checklist.map((item) => (
                    <li key={item}>
                      <i className="fa-solid fa-circle-check"></i> {item}
                    </li>
                  ))}
                </ul>
                <Button href={moveOut.cta.href} variant="primary">
                  {moveOut.cta.icon && <i className={`fa-solid ${moveOut.cta.icon}`}></i>}{" "}
                  {moveOut.cta.label}
                </Button>
              </Reveal>
            </div>
            <div className="col-lg-6">
              <Reveal direction="right">
                <AboutMedia {...moveOut.media} />
              </Reveal>
            </div>
          </div>
        </div>
      </section>
      {/* Detailed Services End */}

      {/* Specialized Services Start */}
      <section className="section bg-soft" id="interior">
        <div className="container">
          <Reveal>
            <SectionHead center {...specializedHead} />
          </Reveal>
          <div className="row g-4">
            {specializedItems.map((service, i) => (
              <div className="col-md-4" key={service.title}>
                <Reveal delay={i * 100}>
                  <ServiceCard {...service} />
                </Reveal>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Specialized Services End */}

      {/* Pricing Start */}
      <section className="section" id="pricing">
        <div className="container">
          <Reveal>
            <SectionHead center {...pricingHead} />
          </Reveal>
          <div className="row g-4 justify-content-center">
            {pricingItems.map((plan, i) => (
              <div className="col-lg-4 col-md-6" key={plan.name}>
                <Reveal delay={i * 120}>
                  <PricingCard {...plan} popularLabel={pricing.popularLabel} />
                </Reveal>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Pricing End */}
    </>
  );
}
