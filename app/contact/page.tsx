import { Fragment } from "react";
import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import PageHeader from "@/components/PageHeader";
import ContactForm from "@/components/ContactForm";
import dataRaw from "@/data/data.json";
import type { ContactData } from "@/data/types";

const contact = dataRaw.contact as ContactData;

export const metadata: Metadata = {
  title: contact.meta.title,
  description: contact.meta.description,
  keywords: contact.meta.keywords,
};

export default function ContactPage() {
  const { pageHeader, intro, info, map } = contact;

  return (
    <>
      <PageHeader title={pageHeader.title} crumb={pageHeader.crumb} variant={pageHeader.variant} />

      {/* Contact Start */}
      <section className="section-py contact-section" id="contact-form">
        <div className="container">
          <Reveal delay={100}>
            <div className="text-center mb-5">
              <div className="section-title title-center">
                <span className="title-tag">{intro.tag}</span>
                <h2 className="title-main">{intro.title}</h2>
                <p className="title-text">{intro.text}</p>
              </div>
            </div>
          </Reveal>
          <div className="row g-5">
            <div className="col-lg-5">
              <Reveal delay={200}>
                <div className="contact-info h-100">
                  <div className="mb-4">
                    <h3 className="mb-3">{info.heading}</h3>
                    <p className="mb-0 text-muted">
                      {info.address[0]}
                      <br />
                      {info.address[1]}
                    </p>
                  </div>
                  <ul className="contact-list">
                    {info.items.map((item) => (
                      <li key={item.text}>
                        <i className={item.icon}></i>
                        <div>
                          {item.link ? <a href={item.href}>{item.text}</a> : item.text}
                          {item.note && <small className="d-block text-muted">{item.note}</small>}
                        </div>
                      </li>
                    ))}
                    <li>
                      <i className="fa fa-clock"></i>
                      <div>
                        {info.hours.map((hour, i) => (
                          <Fragment key={hour.days}>
                            {i > 0 && <br />}
                            <strong>{hour.days}:</strong> {hour.time}
                          </Fragment>
                        ))}
                      </div>
                    </li>
                  </ul>
                  <div className="social-links mt-4">
                    {info.socials.map((social) => (
                      <a className="social-link" href={social.href} aria-label={social.label} key={social.label}>
                        <i className={social.icon}></i>
                      </a>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>
            <div className="col-lg-7">
              <Reveal delay={400}>
                <div className="contact-form">
                  <ContactForm variant="page" />
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
      {/* Contact End */}

      {/* Map Start */}
      <div className="container">
        <div className="map-wrapper">
          <iframe
            src={map.src}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={map.title}
          />
        </div>
      </div>
      {/* Map End */}
    </>
  );
}
