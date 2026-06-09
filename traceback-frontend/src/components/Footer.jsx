import React from 'react'
import { Link } from 'react-router-dom'
export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <div className="footer__logo">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle cx="9" cy="9" r="8" stroke="#6366f1" strokeWidth="1.5"/>
              <circle cx="9" cy="9" r="4" fill="#6366f1" opacity="0.5"/>
              <circle cx="9" cy="9" r="1.5" fill="#818cf8"/>
            </svg>
            <span>TraceBack</span>
          </div>
          <p>AI-powered lost & found recovery platform. Connecting owners with their belongings.</p>
          <span className="footer__version">v2.0 · Spring Boot + React</span>
        </div>
        <div className="footer__nav">
          <div className="footer__col">
            <h4>Platform</h4>
            <Link to="/?type=LOST">Lost Items</Link>
            <Link to="/?type=FOUND">Found Items</Link>
            <Link to="/report-lost">Report Lost</Link>
            <Link to="/report-found">Report Found</Link>
          </div>
          <div className="footer__col">
            <h4>Account</h4>
            <Link to="/login">Sign In</Link>
            <Link to="/register">Get Started</Link>
            <Link to="/dashboard">Dashboard</Link>
          </div>
        </div>
      </div>
      <div className="footer__bottom">
        <div className="container">© {new Date().getFullYear()} TraceBack. All rights reserved.</div>
      </div>
      <style>{`
        .footer { background: var(--surface-1); border-top: 1px solid var(--border-1); margin-top: auto; }
        .footer__inner { display: flex; gap: 80px; padding: 56px 0; }
        .footer__brand { flex: 1; max-width: 280px; }
        .footer__logo { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; }
        .footer__logo span { font-family: var(--font-display); font-size: 17px; font-weight: 700; letter-spacing: -0.03em; }
        .footer__brand p { font-size: 13px; color: var(--text-3); line-height: 1.7; margin-bottom: 12px; }
        .footer__version { font-size: 10px; color: var(--text-4); font-family: var(--font-mono); }
        .footer__nav { display: flex; gap: 56px; }
        .footer__col { display: flex; flex-direction: column; gap: 10px; }
        .footer__col h4 { font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-3); font-family: var(--font-mono); margin-bottom: 4px; }
        .footer__col a { font-size: 13px; color: var(--text-3); transition: color 0.15s; }
        .footer__col a:hover { color: var(--indigo-light); }
        .footer__bottom { border-top: 1px solid var(--border-1); padding: 16px 0; font-size: 12px; color: var(--text-4); font-family: var(--font-mono); }
        @media (max-width: 640px) { .footer__inner { flex-direction: column; gap: 36px; padding: 40px 0; } }
      `}</style>
    </footer>
  )
}
