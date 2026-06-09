import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
export default function NotFound() {
  const navigate = useNavigate()
  return (
    <div className="nf">
      <div className="nf-content fade-up">
        <div className="nf-code mono">ERROR_404</div>
        <h1 className="nf-title">NOT<br/>FOUND</h1>
        <p>The page you're looking for has gone missing — just like a lost item.</p>
        <div className="nf-btns">
          <button className="btn btn-outline" onClick={() => navigate(-1)}>← Go Back</button>
          <Link to="/" className="btn btn-primary">Browse Items</Link>
        </div>
      </div>
      <style>{`
        .nf{min-height:calc(100vh - 64px);display:flex;align-items:center;justify-content:center;padding:40px 16px;
          background:radial-gradient(ellipse 50% 40% at 50% 40%,rgba(245,158,11,0.04),transparent)}
        .nf-content{text-align:center;max-width:440px}
        .nf-code{font-size:11px;letter-spacing:0.14em;color:var(--amber);margin-bottom:16px}
        .nf-title{font-family:var(--font-display);font-size:96px;letter-spacing:4px;line-height:0.9;margin-bottom:20px}
        .nf-content p{color:var(--text-3);font-size:15px;line-height:1.7;margin-bottom:32px}
        .nf-btns{display:flex;gap:12px;justify-content:center}
      `}</style>
    </div>
  )
}
