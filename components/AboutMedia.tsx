type AboutMediaProps = {
  mainImg: string;
  alt: string;
  accentImg?: string;
  accentAlt?: string;
  badgeIcon: string;
  badgeNum: string;
  badgeLabel: string;
};

export default function AboutMedia({
  mainImg,
  alt,
  accentImg,
  accentAlt,
  badgeIcon,
  badgeNum,
  badgeLabel,
}: AboutMediaProps) {
  return (
    <div className="about-media">
      <img className="img-main" src={mainImg} alt={alt} loading="lazy" />
      {accentImg && (
        <img className="img-accent" src={accentImg} alt={accentAlt ?? alt} loading="lazy" />
      )}
      <div className="about-badge">
        <span className="b-icon">
          <i className={`fa-solid ${badgeIcon}`}></i>
        </span>
        <div>
          <div className="b-num">{badgeNum}</div>
          <div className="b-label">{badgeLabel}</div>
        </div>
      </div>
    </div>
  );
}