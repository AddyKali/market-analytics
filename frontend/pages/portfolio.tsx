import { FormEvent, useEffect, useState } from "react";

type Holding = {
  id: number;
  symbol: string;
  quantity: number;
  buy_price: number;
};

type PortfolioSummary = {
  total_invested: number;
  current_value: number;
  profit_loss: number;
  profit_loss_pct: number;
};

export default function PortfolioPage() {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [summary, setSummary] = useState<PortfolioSummary | null>(null);

  const [symbol, setSymbol] = useState("");
  const [qty, setQty] = useState("");
  const [buyPrice, setBuyPrice] = useState("");

  const fetchData = () => {
    fetch("http://localhost:8000/portfolio/holdings")
      .then((res) => res.json())
      .then(setHoldings);

    fetch("http://localhost:8000/portfolio/summary")
      .then((res) => res.json())
      .then(setSummary);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!symbol || !qty || !buyPrice) return;

    fetch("http://localhost:8000/portfolio/holdings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        symbol,
        quantity: Number(qty),
        buy_price: Number(buyPrice),
      }),
    })
      .then((res) => res.json())
      .then(() => {
        setSymbol("");
        setQty("");
        setBuyPrice("");
        fetchData();
      });
  };

  return (
    <div>
      <h1 className="section-title">Portfolio</h1>
      <p className="muted">
        Add your holdings manually. Current price is taken from the sample NIFTY CSV.
      </p>

      <form onSubmit={handleSubmit} style={{ marginTop: 16 }}>
        <div className="form-row">
          <input
            className="input"
            placeholder="Symbol (e.g. NIFTY)"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
          />
          <input
            className="input"
            placeholder="Quantity"
            type="number"
            step="1"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
          />
          <input
            className="input"
            placeholder="Buy Price"
            type="number"
            step="0.01"
            value={buyPrice}
            onChange={(e) => setBuyPrice(e.target.value)}
          />
          <button className="button button-primary" type="submit">
            Add
          </button>
        </div>
      </form>

      <div className="card" style={{ marginTop: 16 }}>
        <div className="card-title">Summary</div>
        {summary ? (
          <div className="grid grid-3">
            <div>
              <div className="muted">Invested</div>
              <div className="card-value">
                ₹{summary.total_invested.toFixed(2)}
              </div>
            </div>
            <div>
              <div className="muted">Current Value</div>
              <div className="card-value">
                ₹{summary.current_value.toFixed(2)}
              </div>
            </div>
            <div>
              <div className="muted">P/L</div>
              <div className="card-value">
                ₹{summary.profit_loss.toFixed(2)}{" "}
                <span
                  className={
                    summary.profit_loss >= 0
                      ? "badge badge-positive"
                      : "badge badge-negative"
                  }
                  style={{ marginLeft: 8 }}
                >
                  {summary.profit_loss_pct.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        ) : (
          "Loading..."
        )}
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <div className="card-title">Holdings</div>
        {holdings.length === 0 ? (
          <p className="muted">No holdings yet. Add something above 👆</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Qty</th>
                <th>Buy Price</th>
              </tr>
            </thead>
            <tbody>
              {holdings.map((h) => (
                <tr key={h.id}>
                  <td>{h.symbol}</td>
                  <td>{h.quantity}</td>
                  <td>₹{h.buy_price.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
