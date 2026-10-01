import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import PageHeader from "@/components/PageHeader";
import Counter from "@/components/Counter";
import TestimonialCard from "@/components/TestimonialCard";
import dataRaw from "@/data/data.json";
import type { TestimonialsData } from "@/data/types";

const testimonials = dataRaw.testimonials as TestimonialsData;

export const metadata: Metadata = {
  title: testimonials.meta.title,
  description: testimonials.meta.description,
  keywords: testimonials.meta.keywords,
};

export default function TestimonialsPage() {
  const { pageHeader, rating, featured, stats, cta } = testimonials;

  return (
    <>
      <PageHeader title={pageHeader.title} crumb={pageHeader.crumb} variant={pageHeader.variant} />

      {/* Rating Snapshot Start */}
      <section className="section-py bg-light text-center">
        <div className="container">
          <Reveal delay={100}>
            <div className="rating-stars display-4 mb-2">
              {Array.from({ length: rating.stars }).map((_, i) => (
                <i className="fa fa-star text-warning" key={i}></i>
              ))}
            </div>
            <div className="h1 fw-bold mb-1">{rating.value}</div>
            <p className="text-muted">{rating.sub}</p>
          </Reveal>
        </div>
      </section>
      {/* Rating Snapshot End */}

      {/* Testimonials Start */}
      <section className="section-py">
        <div className="container">
          <Reveal delay={100}>
            <div className="text-center mb-5">
              <div className="section-title title-center">
                <span className="title-tag">{featured.tag}</span>
                <h2 className="title-main">{featured.title}</h2>
              </div>
            </div>
          </Reveal>
          <div className="row g-4">
            {featured.reviews.map((review, i) => (
              <div className="col-lg-4 col-md-6" key={review.name}>
                <Reveal delay={100 + i * 200}>
                  <TestimonialCard variant="grid" {...review} />
                </Reveal>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Testimonials End */}

      {/* Stats Start */}
      <section className="section-py bg-primary text-white text-center">
        <div className="container">
          <div className="row g-4">
            {stats.map((stat, i) => (
              <div className="col-6 col-md-3" key={stat.label}>
                <Reveal delay={100 + i * 200}>
                  <Counter count={stat.count} />
                  <span className="text-uppercase small d-block">{stat.label}</span>
                </Reveal>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Stats End */}

      {/* Call To Action Start */}
      <section className="section-py text-center">
        <div className="container">
          <Reveal delay={100}>
            <h2 className="display-5 fw-bold mb-3">{cta.title}</h2>
            <p className="text-muted mb-4">{cta.subtitle}</p>
            <a className="btn btn-primary" href={cta.href}>
              {cta.label}
            </a>
          </Reveal>
        </div>
      </section>
      {/* Call To Action End */}
    </>
  );
}
