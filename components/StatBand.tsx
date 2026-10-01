import Counter from "@/components/Counter";

type Stat = {
  icon?: string;
  label: string;
  count: number;
  suffix?: string;
};

export default function StatBand({ stats }: { stats: Stat[] }) {
  return (
    <section className="stat-band">
      <div className="container">
        <div className="row g-4">
          {stats.map((stat) => (
            <div className="col-6 col-lg-3" key={stat.label}>
              <div className="stat-card">
                <div className="num">
                  <Counter count={stat.count} />
                  {stat.suffix && <span className="suffix">{stat.suffix}</span>}
                </div>
                <div className="label">
                  {stat.icon && <i className={`fa-solid ${stat.icon}`}></i>} {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}