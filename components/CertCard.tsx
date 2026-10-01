type CertCardProps = {
  icon: string;
  title: string;
  desc: string;
};

export default function CertCard({ icon, title, desc }: CertCardProps) {
  return (
    <div className="cert-card">
      <i className={`fa-solid ${icon}`}></i>
      <h4>{title}</h4>
      <p>{desc}</p>
    </div>
  );
}