type TeamCardProps = {
  img: string;
  alt: string;
  name: string;
  role: string;
  rating: string;
};

export default function TeamCard({ img, alt, name, role, rating }: TeamCardProps) {
  return (
    <div className="team-card">
      <div className="photo">
        <img src={img} alt={alt} loading="lazy" />
      </div>
      <div className="team-info">
        <h3>{name}</h3>
        <p className="role">{role}</p>
        <p className="rating">
          <i className="fa-solid fa-star"></i>
          <i className="fa-solid fa-star"></i>
          <i className="fa-solid fa-star"></i>
          <i className="fa-solid fa-star"></i>
          <i className="fa-solid fa-star"></i> {rating}
        </p>
      </div>
    </div>
  );
}