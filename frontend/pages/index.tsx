import { useEffect, useState } from "react";

type MarketSummary = {
  symbol: string;
  date: string;
  close: number;
  change: number;
  change_pct: number;
};

export default function HomePage() {
  const [summary, setSummary] = useState<MarketSummary | null>(null);

  useEffect(() => {
    fetch("http://localhost:8000/market/summary")
      .then((res) => res.json())
      .then(setSummary)
      .catch(console.error);
  }, []);

  return (
    <div>
      <h1 className="section-title">Dashboard</h1>
      <p className="muted">
        Simple analytics using NIFTY sample data (not real-time).
      </p>

      <div className="grid grid-3" style={{ marginTop: 16 }}>
        <div className="card">
          <div className="card-title">Index</div>
          <div className="card-value">
            {summary ? summary.symbol : "Loading..."}
          </div>
          <div className="muted">
            Last update: {summary ? summary.date : "-"}
          </div>
        </div>

        <div className="card">
          <div className="card-title">Latest Close Price</div>
          <div className="card-value">
            {summary ? `₹${summary.close.toFixed(2)}` : "Loading..."}
          </div>
        </div>

        <div className="card">
          <div className="card-title">Change</div>
          <div className="card-value" style={{ display: "flex", gap: 8 }}>
            {summary ? (
              <>
                <span>{summary.change.toFixed(2)}</span>
                <span
                  className={
                    summary.change >= 0
                      ? "badge badge-positive"
                      : "badge badge-negative"
                  }
                >
                  {summary.change_pct.toFixed(2)}%
                </span>
              </>
            ) : (
              "Loading..."
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
