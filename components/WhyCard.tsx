type WhyCardProps = {
  icon: string;
  title: string;
  desc: string;
};

export default function WhyCard({ icon, title, desc }: WhyCardProps) {
  return (
    <div className="why-card">
      <div className="w-icon">
        <i className={`fa-solid ${icon}`}></i>
      </div>
      <h3>{title}</h3>
      <p>{desc}</p>
    </div>
  );
}