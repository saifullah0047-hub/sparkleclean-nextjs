import { Fragment } from "react";
import Reveal from "@/components/Reveal";
import dataRaw from "@/data/data.json";
import type { SiteData } from "@/data/types";

const site = dataRaw.site as SiteData;

export default function NotFound() {
  const nf = site.notFound;
  return (
    <section className="flex items-center justify-center min-h-[70vh]">
      <div className="container text-center">
        <Reveal delay={100}>
          <div className="error-code display-1 fw-bold text-primary mb-0">{nf.code}</div>
          <div className="error-icon mb-4">
            <i className={`fa ${nf.icon} fa-4x text-primary`}></i>
          </div>
          <h1 className="display-4 fw-bold mb-3">{nf.title}</h1>
          <p className="lead text-muted mb-4">
            {nf.text.split("\n").map((line, i) => (
              <Fragment key={i}>
                {i > 0 && <br />}
                {line}
              </Fragment>
            ))}
          </p>
          <a className="btn btn-primary btn-lg" href="/">
            {nf.cta}
          </a>
        </Reveal>
      </div>
    </section>
  );
}
