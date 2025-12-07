from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware   # ⬅️ add this line
from pydantic import BaseModel
from typing import List, Dict, Any
import pandas as pd
import numpy as np
from pathlib import Path

app = FastAPI(
    title="Market Analytics & Risk API",
    description="Simple API for Indian stock market analytics project",
    version="1.0.0",
)

# ---------- CORS so frontend (localhost:3000) can call backend (localhost:8000) ----------
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,      # or ["*"] if you want very open
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------- In-memory portfolio storage ----------

class HoldingCreate(BaseModel):
    symbol: str
    quantity: float
    buy_price: float

class Holding(BaseModel):
    id: int
    symbol: str
    quantity: float
    buy_price: float

class PortfolioSummary(BaseModel):
    total_invested: float
    current_value: float
    profit_loss: float
    profit_loss_pct: float

class RiskMetrics(BaseModel):
    volatility_annual: float
    max_drawdown: float
    var_95: float
    equity_curve: List[Dict[str, Any]]


holdings_db: List[Holding] = []
next_holding_id = 1

DATA_PATH = Path(__file__).parent / "data" / "nifty_sample.csv"


# ---------- Utility functions ----------

def load_price_data() -> pd.DataFrame:
    df = pd.read_csv(DATA_PATH, parse_dates=["date"])
    df = df.sort_values("date")
    return df


def calculate_volatility(df: pd.DataFrame) -> float:
    df = df.copy()
    df["returns"] = df["close"].pct_change()
    daily_vol = np.std(df["returns"].dropna())
    annual_vol = float(daily_vol * np.sqrt(252))
    return annual_vol


def calculate_max_drawdown(df: pd.DataFrame) -> float:
    df = df.copy()
    df["cummax"] = df["close"].cummax()
    df["drawdown"] = (df["close"] - df["cummax"]) / df["cummax"]
    max_dd = float(df["drawdown"].min())
    return max_dd


def calculate_var(df: pd.DataFrame, confidence: float = 0.95) -> float:
    df = df.copy()
    returns = df["close"].pct_change().dropna()
    percentile = (1 - confidence) * 100
    var = float(np.percentile(returns, percentile))
    return var


def build_equity_curve(df: pd.DataFrame, start_value: float = 100000.0):
    df = df.copy()
    df["returns"] = df["close"].pct_change().fillna(0)
    df["equity"] = start_value * (1 + df["returns"]).cumprod()
    curve = [
        {"date": d.strftime("%Y-%m-%d"), "value": float(v)}
        for d, v in zip(df["date"], df["equity"])
    ]
    return curve


# ---------- API endpoints ----------

@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/market/summary")
def market_summary():
    df = load_price_data()
    latest = df.iloc[-1]
    prev = df.iloc[-2] if len(df) > 1 else latest
    change = latest["close"] - prev["close"]
    change_pct = (change / prev["close"]) * 100 if prev["close"] != 0 else 0

    return {
        "symbol": str(latest["symbol"]),
        "date": latest["date"].strftime("%Y-%m-%d"),
        "close": float(latest["close"]),
        "change": float(change),
        "change_pct": float(change_pct),
    }


@app.get("/market/history")
def market_history():
    df = load_price_data()
    return [
        {"date": d.strftime("%Y-%m-%d"), "close": float(c)}
        for d, c in zip(df["date"], df["close"])
    ]


@app.get("/portfolio/holdings", response_model=List[Holding])
def list_holdings():
    return holdings_db


@app.post("/portfolio/holdings", response_model=Holding)
def add_holding(h: HoldingCreate):
    global next_holding_id
    holding = Holding(
        id=next_holding_id,
        symbol=h.symbol.upper(),
        quantity=h.quantity,
        buy_price=h.buy_price,
    )
    holdings_db.append(holding)
    next_holding_id += 1
    return holding


@app.get("/portfolio/summary", response_model=PortfolioSummary)
def portfolio_summary():
    if not holdings_db:
        return PortfolioSummary(
            total_invested=0, current_value=0, profit_loss=0, profit_loss_pct=0
        )

    df = load_price_data()
    latest_price = float(df.iloc[-1]["close"])

    total_invested = sum(h.quantity * h.buy_price for h in holdings_db)
    current_value = sum(h.quantity * latest_price for h in holdings_db)
    profit_loss = current_value - total_invested
    profit_loss_pct = (profit_loss / total_invested * 100) if total_invested != 0 else 0

    return PortfolioSummary(
        total_invested=total_invested,
        current_value=current_value,
        profit_loss=profit_loss,
        profit_loss_pct=profit_loss_pct,
    )


@app.get("/risk/metrics", response_model=RiskMetrics)
def risk_metrics():
    df = load_price_data()

    vol = calculate_volatility(df)
    mdd = calculate_max_drawdown(df)
    var_95 = calculate_var(df, confidence=0.95)
    curve = build_equity_curve(df)

    return RiskMetrics(
        volatility_annual=vol,
        max_drawdown=mdd,
        var_95=var_95,
        equity_curve=curve,
    )
