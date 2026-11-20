"use client";

import { useMemo, useState } from "react";

type Side = "BUY" | "SELL";
type Position = { id: number; symbol: string; side: Side; volume: number; entry: number; openedAt: string };

const markets = [
  { symbol: "EURUSD", name: "Euro / US Dollar", bid: 1.08421, ask: 1.08435, change: "+0.24%" },
  { symbol: "GBPUSD", name: "British Pound / US Dollar", bid: 1.27108, ask: 1.27124, change: "+0.11%" },
  { symbol: "USDJPY", name: "US Dollar / Japanese Yen", bid: 154.382, ask: 154.397, change: "-0.08%" },
  { symbol: "XAUUSD", name: "Gold / US Dollar", bid: 2374.62, ask: 2374.91, change: "+0.63%" },
  { symbol: "BTCUSD", name: "Bitcoin / US Dollar", bid: 67420.5, ask: 67438.2, change: "+1.42%" },
];

const candleData = [
  [38, 54, 30, 66], [49, 66, 40, 73], [62, 48, 39, 70], [48, 42, 31, 58],
  [43, 58, 36, 64], [57, 73, 50, 78], [70, 62, 55, 80], [62, 46, 38, 68],
  [47, 55, 40, 64], [54, 69, 48, 75], [68, 60, 53, 76], [60, 43, 35, 66],
  [45, 52, 39, 60], [51, 65, 46, 71], [64, 77, 58, 83], [75, 67, 60, 84],
  [67, 58, 49, 73], [58, 70, 52, 76], [69, 81, 63, 88], [79, 72, 65, 86],
  [72, 61, 53, 78], [61, 69, 56, 75], [68, 84, 62, 90], [82, 76, 69, 89],
];

export default function TradingTerminalPage() {
  const [symbol, setSymbol] = useState("EURUSD");
  const [timeframe, setTimeframe] = useState("15m");
  const [side, setSide] = useState<Side>("BUY");
  const [volume, setVolume] = useState("0.01");
  const [stopLoss, setStopLoss] = useState("");
  const [takeProfit, setTakeProfit] = useState("");
  const [tab, setTab] = useState("Positions");
  const [positions, setPositions] = useState<Position[]>([]);
  const [notice, setNotice] = useState("Demo preview only. Orders here are simulated and never reach a broker.");
  const [showIndicators, setShowIndicators] = useState(false);
  const [mode, setMode] = useState<"DEMO" | "LIVE">("DEMO");

  const market = markets.find((item) => item.symbol === symbol) ?? markets[0];
  const price = side === "BUY" ? market.ask : market.bid;
  const chart = useMemo(() => candleData, []);

  function placeDemoOrder() {
    const parsed = Number(volume);
    if (!Number.isFinite(parsed) || parsed <= 0 || parsed > 100) {
      setNotice("Enter a valid demo volume between 0.01 and 100 lots.");
      return;
    }
    const position: Position = {
      id: Date.now(),
      symbol,
      side,
      volume: parsed,
      entry: price,
      openedAt: new Date().toLocaleTimeString(),
    };
    setPositions((current) => [position, ...current]);
    setTab("Positions");
    setNotice(`Demo ${side} order created for ${symbol} at ${price}. No real trade was placed.`);
  }

  function closePosition(id: number) {
    setPositions((current) => current.filter((position) => position.id !== id));
    setNotice("Demo position closed. No broker order was sent.");
  }

  return (
    <main className="terminal-shell">
      <header className="terminal-header">
        <a className="terminal-brand" href="/dashboard"><span className="terminal-mark">MFX</span><span>MAMBA FX <b>ACADEMY</b><small>TRADING TERMINAL</small></span></a>
        <nav className="terminal-header-links"><a href="/trading-os">AI Trading OS</a><a href="/dashboard">Dashboard</a></nav>
        <div className="terminal-mode"><span className="terminal-dot" /> EXNESS · NOT CONNECTED</div>
      </header>

      <div className="terminal-toolbar">
        <div><span className="terminal-eyebrow">ACCOUNT WORKSPACE</span><h1>Trading Terminal</h1></div>
        <div className="terminal-account"><span>ACCOUNT MODE</span><div><button className={mode === "DEMO" ? "active" : ""} onClick={() => setMode("DEMO")}>DEMO</button><button disabled title="Live trading is not enabled until broker integration and authorization are complete" className={mode === "LIVE" ? "active" : ""} onClick={() => setMode("LIVE")}>LIVE <small>LOCKED</small></button></div></div>
      </div>

      <div className="terminal-warning"><strong>DEMO SIMULATOR</strong><span>This is an interactive interface preview with illustrative market data. It is not connected to Exness or MT5. Live trading is disabled.</span></div>

      <section className="terminal-layout">
        <aside className="terminal-watchlist">
          <div className="terminal-panel-title"><h2>Market Watch</h2><span>DEMO DATA</span></div>
          {markets.map((item) => <button key={item.symbol} onClick={() => setSymbol(item.symbol)} className={symbol === item.symbol ? "market-row selected" : "market-row"}><span><b>{item.symbol}</b><small>{item.name}</small></span><span className="market-quote"><b>{item.bid}</b><small className={item.change.startsWith("+") ? "positive" : "negative"}>{item.change}</small></span></button>)}
          <div className="terminal-connection"><span className="terminal-dot" /><div><b>Exness connection</b><small>Awaiting approved integration</small></div></div>
        </aside>

        <section className="terminal-main">
          <div className="terminal-chart-head"><div><span className="terminal-eyebrow">SELECTED INSTRUMENT</span><h2>{symbol} <small>{market.name}</small></h2><strong>{market.bid}</strong><span className="positive"> {market.change}</span></div><div className="terminal-timeframes">{["1m", "5m", "15m", "1H", "4H", "1D"].map((frame) => <button key={frame} className={timeframe === frame ? "active" : ""} onClick={() => setTimeframe(frame)}>{frame}</button>)}</div></div>
          <div className="terminal-chart">
            <div className="chart-grid"><span>1.0870</span><span>1.0860</span><span>1.0850</span><span>1.0840</span><span>1.0830</span></div>
            <svg viewBox="0 0 720 330" role="img" aria-label={`Illustrative ${symbol} candlestick chart`} preserveAspectRatio="none">
              {[50, 110, 170, 230, 290].map((y) => <line key={y} x1="0" y1={y} x2="720" y2={y} stroke="#26384b" strokeDasharray="3 5" />)}
              {chart.map(([open, close, low, high], index) => {
                const x = 18 + index * 29;
                const up = close >= open;
                const color = up ? "#20b783" : "#e36e70";
                return <g key={index}><line x1={x + 7} y1={330 - high * 3.3} x2={x + 7} y2={330 - low * 3.3} stroke={color} strokeWidth="1.5" /><rect x={x} y={330 - Math.max(open, close) * 3.3} width="14" height={Math.max(4, Math.abs(close - open) * 3.3)} fill={color} rx="1" /></g>;
              })}
              <polyline points="18,190 75,205 132,170 189,184 246,145 303,155 360,132 417,149 474,108 531,120 588,94 645,103 710,78" fill="none" stroke="#e5bb5a" strokeWidth="2" opacity=".9" />
            </svg>
            <div className="chart-watermark">MAMBA FX · SIMULATED CHART</div>
            <div className="chart-current-price">{market.bid}</div>
            <div className="chart-bottom-labels"><span>09:00</span><span>10:00</span><span>11:00</span><span>12:00</span><span>13:00</span><span>14:00</span></div>
          </div>
          <div className="terminal-chart-tools"><button onClick={() => setShowIndicators((value) => !value)}>{showIndicators ? "Hide indicators" : "Indicators +"}</button><button onClick={() => setNotice("Drawing tools are part of the chart integration milestone.")}>Drawing tools</button><span>{showIndicators ? "RSI · MACD · Moving Average (preview controls)" : "Candles · " + timeframe + " · Illustrative prices"}</span></div>
          <div className="terminal-trades">
            <div className="terminal-tabs">{["Positions", "Pending", "History"].map((item) => <button key={item} className={tab === item ? "active" : ""} onClick={() => setTab(item)}>{item}{item === "Positions" ? ` (${positions.length})` : ""}</button>)}</div>
            {tab === "Positions" ? positions.length ? <div className="position-table"><div className="position-row position-head"><span>Instrument</span><span>Side</span><span>Volume</span><span>Entry</span><span>Action</span></div>{positions.map((position) => <div className="position-row" key={position.id}><b>{position.symbol}</b><span className={position.side === "BUY" ? "positive" : "negative"}>{position.side}</span><span>{position.volume.toFixed(2)}</span><span>{position.entry}</span><button onClick={() => closePosition(position.id)}>Close demo</button></div>)}</div> : <div className="terminal-empty">No demo positions open. Use the order ticket to simulate a trade.</div> : <div className="terminal-empty">{tab === "Pending" ? "No pending demo orders." : "Demo trade history will appear here after positions are closed."}</div>}
          </div>
        </section>

        <aside className="terminal-ticket">
          <div className="terminal-panel-title"><h2>Order Ticket</h2><span>SIMULATION</span></div>
          <label>Instrument<select value={symbol} onChange={(event) => setSymbol(event.target.value)}>{markets.map((item) => <option key={item.symbol} value={item.symbol}>{item.symbol}</option>)}</select></label>
          <div className="ticket-side"><button className={side === "BUY" ? "buy active" : "buy"} onClick={() => setSide("BUY")}>BUY <small>{market.ask}</small></button><button className={side === "SELL" ? "sell active" : "sell"} onClick={() => setSide("SELL")}>SELL <small>{market.bid}</small></button></div>
          <label>Volume (lots)<input type="number" min="0.01" max="100" step="0.01" value={volume} onChange={(event) => setVolume(event.target.value)} /></label>
          <label>Stop Loss <input value={stopLoss} onChange={(event) => setStopLoss(event.target.value)} placeholder="Optional price" inputMode="decimal" /></label>
          <label>Take Profit <input value={takeProfit} onChange={(event) => setTakeProfit(event.target.value)} placeholder="Optional price" inputMode="decimal" /></label>
          <div className="ticket-summary"><span>Estimated entry</span><b>{price}</b><span>Account</span><b>Demo simulator</b></div>
          <button className="ticket-submit" onClick={placeDemoOrder}>Place demo {side} order</button>
          <p className="ticket-disclaimer">This button only creates a local simulated position. It does not send an order to Exness, MT5 or any broker. SL/TP fields are UI inputs only in this preview.</p>
        </aside>
      </section>
      <div className="terminal-notice" role="status">{notice}</div>
      <footer className="terminal-footer">Mamba FX Academy · Trading involves risk. This simulator is for interface testing and education only.</footer>
    </main>
  );
}
