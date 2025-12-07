📊 Real-Time Market Analytics & Risk Management Dashboard

A web-based dashboard designed to analyze Indian stock market data using historical price data.
Users can manage a portfolio and view essential risk metrics with interactive visualizations.<br>

🧿 Overview

This project enables users to:

✔ View market summary for NIFTY
✔ Add portfolio holdings manually
✔ Track Profit/Loss in real time (based on dataset’s latest close price)
✔ Analyze financial risks such as Volatility, VaR & Max Drawdown
✔ Visualize equity performance using line charts

Note: This project uses static CSV market data for academic demonstration and does not provide real-time trading signals.<br>

🏗️ Tech Stack
Component	Technology
Frontend	Next.js (React) + Chart.js
Backend	FastAPI (Python)
Data Processing	Pandas, NumPy
Storage	CSV-based dataset
📂 Project Structure

<img width="715" height="419" alt="Screenshot 2025-12-07 133756" src="https://github.com/user-attachments/assets/867df780-a121-42c7-ad20-f4b0fa9bc649" />
<br>

🚀 How to Run
1️⃣ Backend Setup
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000


Open API Docs:
👉 http://localhost:8000/docs<br>

2️⃣ Frontend Setup
cd frontend
npm install
npm run dev


Open Web App:
👉 http://localhost:3000/<br>

📈 Core Features
🔹 Dashboard

Displays index price, % change & last update

Pulls data from backend API<br>

🔹 Portfolio Analytics

Add stocks manually (symbol, qty, buy price)

Auto-calculates:

Total invested

Current value

Profit/Loss (₹ & %)<br>

🔹 Risk Analytics Page

Metrics computed with historical NIFTY data:

VaR 95%

Max Drawdown

Annualized Volatility

Interactive Equity Curve Chart (Charts.js)<br>

🧮 Risk Calculation Methods
Metric	Formula / Method
Volatility	σ × √252 based on daily return std deviation
VaR 95%	Historical percentile method
Max Drawdown	Peak-to-bottom decline in value
Equity Curve	Cumulative product of returns<br>

🎯 Purpose of the Project

This system is made for academic submission and learning:

B-Tech 5th Semester Project
MGM College of Engineering and Technology
Submitted by: Adarsh Kumar, Amit Rawat, Aditi Lodhi<br>

🛠 Future Enhancements
Feature	Status
Live Market Data via Broker APIs (Dhan/Zerodha)	Planned
User Login + Portfolio Sync	Planned
Price Alerts + Notifications	Planned
Support for multiple stocks	Planned<br>

📌 Disclaimer

This platform is meant for educational use only
and not for actual investment or trading decisions.<br>

⭐ Show Support

If you like the project:
⭐ Star it on GitHub (when uploaded)<br>

📍 License

MIT License — Free to modify & improve 🎓<br>
