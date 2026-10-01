export type SocialLink = {
  label: string;
  icon: string;
  href: string;
};

export type SiteData = {
  name: string;
  meta: { title: string; description: string };
  brandPrefix: string;
  brandAccent: string;
  brandIcon: string;
  tagline: string;
  phone: string;
  phoneHref: string;
  email: string;
  emailHref: string;
  addressLines: string[];
  hoursShort: { days: string; time: string }[];
  rating: { stars: number; value: string; countLabel: string };
  socials: SocialLink[];
  license: string;
  copyright: string;
  copyrightYear: number;
  notFound: { code: string; icon: string; title: string; text: string; cta: string };
};

export type NavLink = { href: string; label: string };

export type NavigationData = {
  homeLabel: string;
  links: NavLink[];
  cta: { label: string; href: string; icon: string };
};

export type FooterLink = { label: string; href: string };

export type FooterColumn =
  | { title: string; type?: "links"; links: FooterLink[] }
  | { title: string; type: "newsletter"; text: string };

export type FooterData = {
  about: string;
  ratingLabel: string;
  companyLinks: FooterLink[];
  companyLinksWide: FooterLink[];
  columns: FooterColumn[];
  newsletter: { placeholder: string };
};

export type SectionHeadData = {
  eyebrowIcon?: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
  center?: boolean;
};

export type MediaBlock = {
  mainImg: string;
  accentImg?: string;
  alt: string;
  accentAlt?: string;
  badgeIcon: string;
  badgeNum: string;
  badgeLabel: string;
};

export type CtaAction = {
  label: string;
  href: string;
  icon?: string;
  variant?: string;
};

export type IconCard = { icon: string; title: string; desc: string };

export type ServiceItem = {
  img: string;
  alt: string;
  icon: string;
  tag?: string;
  title: string;
  desc: string;
  price: string;
  note: string;
  ctaLabel: string;
  href?: string;
};

export type ProcessStep = { icon: string; title: string; desc: string };

export type TestimonialItem = {
  quote: string;
  name: string;
  role: string;
  avatar: string;
};

export type GalleryItem = {
  img: string;
  alt: string;
  label?: string;
  tag?: string;
  size?: "featured" | "wide";
};

export type PricingFeature = { text: string; muted?: boolean };

export type PricingPlan = {
  name: string;
  sub: string;
  price: string;
  period: string;
  features: PricingFeature[];
  cta: string;
  ctaVariant?: "primary" | "accent" | "outline-primary";
  popular?: boolean;
};

export type FaqItem = { icon: string; question: string; answer: string };

export type Stat = {
  icon?: string;
  label: string;
  count: number;
  suffix?: string;
};

export type CheckItem = { strong?: string; text: string };

export type CtaBlock = {
  title: string;
  subtitle: string;
  primaryLabel: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  secondaryIcon?: string;
  floats?: string[];
};

export type HomeData = {
  meta: { title: string; description: string; keywords: string };
  hero: {
    video: string;
    poster: string;
    title: { pre: string; accent?: string };
    subtitle: string;
    primaryCta: CtaAction;
    secondaryCta: CtaAction;
    trustItems: IconCard[];
    floatIcons: string[];
    scrollCue: string;
  };
  stats: Stat[];
  services: SectionHeadData & { items: ServiceItem[] };
  about: {
    heading: SectionHeadData;
    media: MediaBlock;
    checklist: CheckItem[];
    primaryCta: CtaAction;
    secondaryCta: CtaAction;
  };
  whyChoose: SectionHeadData & { items: IconCard[] };
  process: SectionHeadData & { items: ProcessStep[] };
  beforeAfter: {
    heading: SectionHeadData;
    beforeImg: string;
    afterImg: string;
    beforeAlt: string;
    afterAlt: string;
    beforeLabel: string;
    afterLabel: string;
  };
  testimonials: SectionHeadData & { items: TestimonialItem[] };
  gallery: SectionHeadData & { items: GalleryItem[] };
  pricing: SectionHeadData & { popularLabel: string; plans: PricingPlan[] };
  faq: SectionHeadData & { items: FaqItem[] };
  cta: CtaBlock;
  contact: {
    heading: SectionHeadData;
    panel: { title: string; sub: string };
    formCard: { title: string; sub: string };
  };
};

export type PageHeaderData = {
  title: string;
  crumb: string;
  variant?: "default" | "tall";
};

export type AboutData = {
  meta: { title: string; description: string; keywords: string };
  pageHeader: PageHeaderData;
  mission: {
    heading: SectionHeadData;
    body: string;
    points: string[];
    media: MediaBlock;
  };
  values: SectionHeadData & { items: IconCard[] };
  whyChoose: SectionHeadData & { items: IconCard[] };
  cta: CtaBlock;
};

export type ServicesData = {
  meta: { title: string; description: string; keywords: string };
  pageHeader: PageHeaderData;
  overview: SectionHeadData & { items: ServiceItem[] };
  moveOut: {
    heading: SectionHeadData;
    checklist: string[];
    cta: CtaAction;
    media: MediaBlock;
  };
  specialized: SectionHeadData & { items: ServiceItem[] };
  pricing: SectionHeadData & { popularLabel: string; plans: PricingPlan[] };
};

export type TeamMember = {
  img: string;
  alt: string;
  name: string;
  role: string;
  rating: string;
};

export type TeamData = {
  meta: { title: string; description: string; keywords: string };
  pageHeader: PageHeaderData;
  team: SectionHeadData & { members: TeamMember[] };
  certifications: SectionHeadData & { items: IconCard[] };
  cta: CtaBlock;
};

export type TestimonialsData = {
  meta: { title: string; description: string; keywords: string };
  pageHeader: PageHeaderData;
  rating: { stars: number; value: string; sub: string };
  featured: { tag: string; title: string; reviews: TestimonialItem[] };
  stats: Stat[];
  cta: { title: string; subtitle: string; label: string; href: string };
};

export type ContactInfoItem = {
  icon: string;
  link?: boolean;
  href?: string;
  text: string;
  note?: string;
};

export type ContactData = {
  meta: { title: string; description: string; keywords: string };
  pageHeader: PageHeaderData;
  intro: { tag: string; title: string; text: string };
  info: {
    heading: string;
    address: string[];
    items: ContactInfoItem[];
    hours: { days: string; time: string }[];
    socials: SocialLink[];
  };
  map: { src: string; title: string };
};

export type FormField = {
  name: string;
  type: "text" | "email" | "tel" | "select" | "textarea";
  label?: string;
  placeholder?: string;
  required?: boolean;
  col?: string;
  rows?: number;
  feedback?: string;
  options?: string[];
  selectPlaceholder?: string;
  selectPlaceholderDisabled?: boolean;
};

export type FormsData = {
  contact: {
    serviceOptions: string[];
    panel: { fields: FormField[]; submit: { label: string; icon?: string }; success: string };
    page: { fields: FormField[]; submit: { label: string; icon?: string }; success: string };
  };
};