import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import PageHeader from "@/components/PageHeader";
import SectionHead from "@/components/SectionHead";
import TeamCard from "@/components/TeamCard";
import CertCard from "@/components/CertCard";
import CTABanner from "@/components/CTABanner";
import dataRaw from "@/data/data.json";
import type { TeamData } from "@/data/types";

const team = dataRaw.team as TeamData;

export const metadata: Metadata = {
  title: team.meta.title,
  description: team.meta.description,
  keywords: team.meta.keywords,
};

export default function TeamPage() {
  const { pageHeader, team: teamSection, certifications, cta } = team;
  const { members, ...teamHead } = teamSection;
  const { items: certItems, ...certHead } = certifications;

  return (
    <>
      <PageHeader title={pageHeader.title} crumb={pageHeader.crumb} variant={pageHeader.variant} />

      {/* Team Grid Start */}
      <section className="section">
        <div className="container">
          <Reveal>
            <SectionHead center {...teamHead} />
          </Reveal>
          <div className="row g-4">
            {members.map((member, i) => (
              <div className="col-md-6 col-lg-3" key={member.name}>
                <Reveal delay={i * 80}>
                  <TeamCard {...member} />
                </Reveal>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Team Grid End */}

      {/* Certifications Start */}
      <section className="section bg-soft">
        <div className="container">
          <Reveal>
            <SectionHead center {...certHead} />
          </Reveal>
          <div className="row g-4 justify-content-center">
            {certItems.map((cert, i) => (
              <div className="col-sm-6 col-lg-3" key={cert.title}>
                <Reveal delay={i * 80}>
                  <CertCard {...cert} />
                </Reveal>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Certifications End */}

      <CTABanner {...cta} />
    </>
  );
}
