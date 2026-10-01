import Reveal from "@/components/Reveal";
import dataRaw from "@/data/data.json";
import type { NavigationData } from "@/data/types";

const navigation = dataRaw.navigation as NavigationData;

type PageHeaderProps = {
  title: string;
  crumb: string;
  variant?: "default" | "tall";
};

export default function PageHeader({ title, crumb, variant = "default" }: PageHeaderProps) {
  const homeCrumb = (
    <li className="breadcrumb-item">
      <a className="text-white" href="/">
        {navigation.homeLabel}
      </a>
    </li>
  );

  if (variant === "tall") {
    return (
      <div className="page-header pb-5 d-flex align-items-center" style={{ minHeight: 460 }}>
        <div className="container text-center py-5">
          <h1 className="display-4 fw-bold text-uppercase mb-3 animated slideInDown">{title}</h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb justify-content-center text-uppercase mb-0">
              {homeCrumb}
              <li className="breadcrumb-item text-primary active" aria-current="page">
                {crumb}
              </li>
            </ol>
          </nav>
        </div>
      </div>
    );
  }

  return (
    <header className="page-header">
      <div className="container text-center">
        <Reveal>
          <h1>{title}</h1>
        </Reveal>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb justify-content-center">
            <li className="breadcrumb-item">
              <a href="/">{navigation.homeLabel}</a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {crumb}
            </li>
          </ol>
        </nav>
      </div>
    </header>
  );
}
