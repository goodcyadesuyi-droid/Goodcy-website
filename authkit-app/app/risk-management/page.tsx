"use client";
import {useMemo,useState} from "react";
export default function RiskManagementPage(){
 const [balance,setBalance]=useState("10000"),[risk,setRisk]=useState("1"),[stop,setStop]=useState("25"),[pipValue,setPipValue]=useState("10");
 const result=useMemo(()=>{const b=Number(balance),r=Number(risk),s=Number(stop),v=Number(pipValue);if(![b,r,s,v].every(Number.isFinite)||b<=0||r<=0||r>100||s<=0||v<=0)return null;const cash=b*r/100;return {cash,lots:cash/(s*v)}},[balance,risk,stop,pipValue]);
 const field={width:"100%",padding:13,borderRadius:10,border:"1px solid #2d7544",background:"#06130b",color:"#f3fff6",fontSize:15,marginTop:7};
 return <main className="mfx-module-page"><header><a href="/dashboard">← Mamba FX Academy</a><span>RISK MANAGER</span></header><section className="mfx-module-hero"><small>PROTECT YOUR CAPITAL</small><h1>Risk <em>Management</em></h1><p>Calculate a planned risk budget and estimate position size before a trade.</p><div className="mfx-module-status">Planning calculator · Does not control or execute broker orders</div></section>
 <section className="mfx-risk-calculator"><h2>Position Size Calculator</h2><div className="mfx-risk-fields">
 <label>Account balance (USD)<input style={field} inputMode="decimal" value={balance} onChange={e=>setBalance(e.target.value)}/></label>
 <label>Risk per trade (%)<input style={field} inputMode="decimal" value={risk} onChange={e=>setRisk(e.target.value)}/></label>
 <label>Stop distance (pips)<input style={field} inputMode="decimal" value={stop} onChange={e=>setStop(e.target.value)}/></label>
 <label>Assumed pip value per 1.00 lot (USD)<input style={field} inputMode="decimal" value={pipValue} onChange={e=>setPipValue(e.target.value)}/></label></div>
 {result?<div className="mfx-risk-result"><div><small>Maximum planned loss</small><strong>${result.cash.toFixed(2)}</strong></div><div><small>Estimated position size</small><strong>{result.lots.toFixed(3)} lots</strong></div></div>:<p>Enter positive values. Risk percentage must not exceed 100%.</p>}
 <p className="mfx-risk-note">Illustrative estimate using your assumed pip value. Actual pip value varies by instrument, quote currency, account currency, contract specification, spread and fees. This is not broker-validated lot sizing.</p></section>
 <section className="mfx-module-grid"><article><h2>Stop Loss & Take Profit</h2><p>Plan exit levels and understand slippage and gap risk.</p></article><article><h2>Daily Loss Limit</h2><p>Set a personal stop-trading threshold and follow it consistently.</p></article><article><h2>Exposure Control</h2><p>Review correlated instruments and avoid excessive combined exposure.</p></article><article><h2>Risk Checklist</h2><p>Know your entry, invalidation level, risk budget and event exposure before trading.</p></article></section>
 <a className="mfx-module-button" href="/terminal">Go to Trading Terminal →</a><footer>Risk tools cannot guarantee profits or prevent losses. Live account enforcement is not connected.</footer></main>;
}