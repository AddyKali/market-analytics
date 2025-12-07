import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

type EquityPoint = {
  date: string;
  value: number;
};

type RiskMetrics = {
  volatility_annual: number;
  max_drawdown: number;
  var_95: number;
  equity_curve: EquityPoint[];
};

export default function RiskPage() {
  const [risk, setRisk] = useState<RiskMetrics | null>(null);

  useEffect(() => {
    fetch("http://localhost:8000/risk/metrics")
      .then((res) => res.json())
      .then(setRisk)
      .catch(console.error);
  }, []);

  const chartData = risk
    ? {
        labels: risk.equity_curve.map((p) => p.date),
        datasets: [
          {
            label: "Equity Curve (₹)",
            data: risk.equity_curve.map((p) => p.value),
            borderWidth: 2,
            tension: 0.3,
          },
        ],
      }
    : undefined;

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: { color: "#e5e7eb" },
      },
    },
    scales: {
      x: {
        ticks: { color: "#9ca3af" },
        grid: { color: "#111827" },
      },
      y: {
        ticks: { color: "#9ca3af" },
        grid: { color: "#111827" },
      },
    },
  } as const;

  return (
    <div>
      <h1 className="section-title">Risk Analytics</h1>
      <p className="muted">
        Risk metrics calculated from historical NIFTY price data (CSV).
      </p>

      {risk ? (
        <>
          <div className="grid grid-3" style={{ marginTop: 16 }}>
            <div className="card">
              <div className="card-title">Annual Volatility</div>
              <div className="card-value">
                {(risk.volatility_annual * 100).toFixed(2)}%
              </div>
            </div>

            <div className="card">
              <div className="card-title">Max Drawdown</div>
              <div className="card-value">
                {(risk.max_drawdown * 100).toFixed(2)}%
              </div>
            </div>

            <div className="card">
              <div className="card-title">VaR 95% (1-Day)</div>
              <div className="card-value">
                {(risk.var_95 * 100).toFixed(2)}%
              </div>
            </div>
          </div>

          <div className="card" style={{ marginTop: 24 }}>
            <div className="card-title">Equity Curve</div>
            {chartData ? (
              <Line data={chartData} options={chartOptions} />
            ) : (
              <p className="muted">Loading chart...</p>
            )}
          </div>
        </>
      ) : (
        <p className="muted" style={{ marginTop: 16 }}>
          Loading risk metrics...
        </p>
      )}
    </div>
  );
}
