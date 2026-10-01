type TestimonialCardProps = {
  quote: string;
  name: string;
  role: string;
  avatar: string;
  variant?: "carousel" | "grid";
};

function Stars({ className = "stars" }: { className?: string }) {
  return (
    <div className={className}>
      <i className="fa-solid fa-star"></i>
      <i className="fa-solid fa-star"></i>
      <i className="fa-solid fa-star"></i>
      <i className="fa-solid fa-star"></i>
      <i className="fa-solid fa-star"></i>
    </div>
  );
}

export default function TestimonialCard({
  quote,
  name,
  role,
  avatar,
  variant = "carousel",
}: TestimonialCardProps) {
  if (variant === "grid") {
    return (
      <div className="testimonial-card h-100">
        <Stars className="rating-stars mb-3" />
        <p className="mb-4">{quote}</p>
        <div className="d-flex align-items-center">
          <div className="avatar-sm">
            <img src={avatar} alt="" className="img-fluid rounded-circle" />
          </div>
          <div className="ms-3">
            <strong className="fw-bold">{name}</strong>
            <small className="d-block text-muted">{role}</small>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="testimonial-card">
      <span className="quote-mark">&quot;</span>
      <Stars />
      <p className="text">&quot;{quote}&quot;</p>
      <div className="author">
        <img className="avatar" src={avatar} alt={name} loading="lazy" />
        <div>
          <div className="name">{name}</div>
          <div className="role">{role}</div>
        </div>
      </div>
    </div>
  );
}