import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import PageHeader from "@/components/PageHeader";
import SectionHead from "@/components/SectionHead";
import AboutMedia from "@/components/AboutMedia";
import WhyCard from "@/components/WhyCard";
import CTABanner from "@/components/CTABanner";
import dataRaw from "@/data/data.json";
import type { AboutData } from "@/data/types";

const about = dataRaw.about as AboutData;

export const metadata: Metadata = {
  title: about.meta.title,
  description: about.meta.description,
  keywords: about.meta.keywords,
};

const chunk = <T,>(arr: T[], size: number): T[][] =>
  Array.from({ length: Math.ceil(arr.length / size) }, (_, i) => arr.slice(i * size, i * size + size));

export default function AboutPage() {
  const { pageHeader, mission, values, whyChoose, cta } = about;
  const { items: valuesItems, ...valuesHead } = values;
  const { items: whyItems, ...whyHead } = whyChoose;

  return (
    <>
      <PageHeader title={pageHeader.title} crumb={pageHeader.crumb} variant={pageHeader.variant} />

      {/* Mission Start */}
      <section className="section">
        <div className="container">
          <div className="row g-5 align-items-center">
            <div className="col-lg-6">
              <Reveal direction="left">
                <SectionHead className="mb-4" {...mission.heading} />
                <p className="mb-4">{mission.body}</p>
                <div className="row g-3">
                  {chunk(mission.points, 2).map((group, gi) => (
                    <div className="col-sm-6" key={gi}>
                      {group.map((point, pi) => (
                        <div
                          className={pi < group.length - 1 ? "d-flex align-items-center gap-3 mb-2" : "d-flex align-items-center gap-3"}
                          key={point}
                        >
                          <i className="fa-solid fa-circle-check text-primary fa-lg"></i>{" "}
                          <span className="fw-semibold">{point}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
            <div className="col-lg-6">
              <Reveal direction="right">
                <AboutMedia {...mission.media} />
              </Reveal>
            </div>
          </div>
        </div>
      </section>
      {/* Mission End */}

      {/* Values Start */}
      <section className="section bg-soft" id="values">
        <div className="container">
          <Reveal>
            <SectionHead center {...valuesHead} />
          </Reveal>
          <div className="row g-4">
            {valuesItems.map((item, i) => (
              <div className="col-md-6 col-lg-3" key={item.title}>
                <Reveal delay={i * 80}>
                  <WhyCard {...item} />
                </Reveal>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Values End */}

      {/* Why Choose Start */}
      <section className="section">
        <div className="container">
          <Reveal>
            <SectionHead center {...whyHead} />
          </Reveal>
          <div className="row g-4">
            {whyItems.map((item, i) => (
              <div className="col-md-6 col-lg-3" key={item.title}>
                <Reveal delay={i * 80}>
                  <WhyCard {...item} />
                </Reveal>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Why Choose End */}

      <CTABanner {...cta} />
    </>
  );
}
