import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { RiAddLine, RiUserLine, RiShieldLine, RiLogoutBoxLine, RiMenuLine, RiCloseLine, RiSearchLine } from 'react-icons/ri'

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [drop,     setDrop]     = useState(false)
  const [mobile,   setMobile]   = useState(false)
  const dropRef = useRef(null)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => { setMobile(false); setDrop(false) }, [location.pathname])

  useEffect(() => {
    const fn = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setDrop(false) }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])

  return (
    <>
      <nav className={`nav${scrolled ? ' nav--scrolled' : ''}`}>
        <div className="container nav__inner">
          {/* Logo */}
          <Link to="/" className="nav__logo">
            <div className="nav__logo-icon">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="9" cy="9" r="8" stroke="#6366f1" strokeWidth="1.5"/>
                <circle cx="9" cy="9" r="4" fill="#6366f1" opacity="0.5"/>
                <circle cx="9" cy="9" r="1.5" fill="#818cf8"/>
              </svg>
            </div>
            <span className="nav__logo-text">TraceBack</span>
          </Link>

          {/* Center nav */}
          <div className="nav__links">
            {[['/', 'Browse'], ['/?type=LOST', 'Lost'], ['/?type=FOUND', 'Found']].map(([to, label]) => (
              <Link key={label} to={to}
                className={`nav__link${location.pathname === to || (to !== '/' && location.search.includes(label.toUpperCase())) ? ' active' : ''}`}>
                {label}
              </Link>
            ))}
          </div>

          {/* Right */}
          <div className="nav__right">
            {isAuthenticated ? (
              <>
                <Link to="/report-lost" className="btn btn-sm btn-outline nav__btn-lost">
                  <RiAddLine /> Report Lost
                </Link>
                <Link to="/report-found" className="btn btn-sm btn-primary">
                  <RiAddLine /> Report Found
                </Link>
                <div className="nav__avatar-wrap" ref={dropRef}>
                  <button className="nav__avatar" onClick={() => setDrop(p => !p)}>
                    <span>{user?.username?.[0]?.toUpperCase()}</span>
                    {isAdmin && <div className="nav__avatar-dot" />}
                  </button>
                  {drop && (
                    <div className="nav__dropdown">
                      <div className="nav__drop-user">
                        <div className="nav__drop-av">{user?.username?.[0]?.toUpperCase()}</div>
                        <div>
                          <div className="nav__drop-name">{user?.fullName || user?.username}</div>
                          <div className="nav__drop-email">{user?.email}</div>
                        </div>
                      </div>
                      {isAdmin && <span className="badge badge-admin" style={{margin:'4px 12px 8px'}}>Admin</span>}
                      <div className="nav__drop-sep" />
                      <Link to="/dashboard" className="nav__drop-item"><RiUserLine /> Dashboard</Link>
                      {isAdmin && <Link to="/admin" className="nav__drop-item"><RiShieldLine /> Admin Panel</Link>}
                      <div className="nav__drop-sep" />
                      <button className="nav__drop-item nav__drop-item--red"
                        onClick={() => { logout(); navigate('/') }}>
                        <RiLogoutBoxLine /> Sign out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login"    className="btn btn-sm btn-ghost">Sign in</Link>
                <Link to="/register" className="btn btn-sm btn-primary">Get started</Link>
              </>
            )}
            <button className="nav__ham" onClick={() => setMobile(p => !p)}>
              {mobile ? <RiCloseLine /> : <RiMenuLine />}
            </button>
          </div>
        </div>

        {mobile && (
          <div className="nav__mobile">
            <Link to="/" className="nav__m-item">Browse</Link>
            <Link to="/?type=LOST"  className="nav__m-item">Lost Items</Link>
            <Link to="/?type=FOUND" className="nav__m-item">Found Items</Link>
            {isAuthenticated ? (
              <>
                <div className="nav__m-sep" />
                <Link to="/report-lost"  className="nav__m-item">Report Lost</Link>
                <Link to="/report-found" className="nav__m-item">Report Found</Link>
                <Link to="/dashboard"    className="nav__m-item">Dashboard</Link>
                {isAdmin && <Link to="/admin" className="nav__m-item">Admin Panel</Link>}
                <button className="nav__m-item nav__m-item--red"
                  onClick={() => { logout(); navigate('/') }}>Sign out</button>
              </>
            ) : (
              <>
                <div className="nav__m-sep" />
                <Link to="/login"    className="nav__m-item">Sign in</Link>
                <Link to="/register" className="nav__m-item nav__m-item--accent">Get started</Link>
              </>
            )}
          </div>
        )}
      </nav>

      <style>{`
        .nav {
          position: sticky; top: 0; z-index: 200; height: 68px;
          background: rgba(8,8,16,0.5);
          backdrop-filter: blur(24px) saturate(180%);
          border-bottom: 1px solid transparent;
          transition: all 0.3s ease;
        }
        .nav--scrolled {
          background: rgba(8,8,16,0.92);
          border-bottom-color: var(--border-1);
          box-shadow: 0 1px 32px rgba(0,0,0,0.5);
        }
        .nav__inner {
          display: flex; align-items: center; height: 68px; gap: 16px;
        }
        .nav__logo {
          display: flex; align-items: center; gap: 10px; flex-shrink: 0;
        }
        .nav__logo-icon {
          width: 32px; height: 32px; border-radius: 8px;
          background: var(--indigo-glow2); border: 1px solid var(--border-accent);
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s;
        }
        .nav__logo:hover .nav__logo-icon { background: var(--indigo-glow); }
        .nav__logo-text {
          font-family: var(--font-display); font-size: 18px; font-weight: 700;
          color: var(--text-1); letter-spacing: -0.03em;
        }
        .nav__links {
          display: flex; gap: 2px; margin-left: 20px;
        }
        .nav__link {
          padding: 7px 14px; border-radius: var(--r-sm);
          font-size: 14px; font-weight: 500; color: var(--text-3);
          transition: all 0.15s; letter-spacing: -0.01em;
        }
        .nav__link:hover { color: var(--text-1); background: var(--surface-3); }
        .nav__link.active { color: var(--text-1); background: var(--surface-3); }
        .nav__right { display: flex; align-items: center; gap: 8px; margin-left: auto; }
        .nav__btn-lost { border-color: rgba(244,63,94,0.25); color: var(--red-soft) !important; }
        .nav__btn-lost:hover { background: var(--red-glow) !important; border-color: rgba(244,63,94,0.4) !important; }
        .nav__avatar-wrap { position: relative; }
        .nav__avatar {
          width: 36px; height: 36px; border-radius: 50%;
          background: var(--grad-indigo); color: white;
          font-family: var(--font-display); font-size: 15px; font-weight: 700;
          display: flex; align-items: center; justify-content: center;
          border: none; cursor: pointer; position: relative;
          box-shadow: 0 2px 12px rgba(99,102,241,0.3);
          transition: all 0.2s;
        }
        .nav__avatar:hover { transform: scale(1.08); box-shadow: 0 4px 20px rgba(99,102,241,0.45); }
        .nav__avatar-dot {
          position: absolute; top: -2px; right: -2px;
          width: 10px; height: 10px; border-radius: 50%;
          background: var(--gold); border: 2px solid var(--black);
        }
        .nav__dropdown {
          position: absolute; top: calc(100% + 12px); right: 0;
          min-width: 220px; background: var(--surface-2);
          border: 1px solid var(--border-2); border-radius: var(--r-md);
          box-shadow: var(--shadow-lg); overflow: hidden;
          animation: fadeUp 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .nav__drop-user {
          display: flex; align-items: center; gap: 12px; padding: 14px 16px 12px;
        }
        .nav__drop-av {
          width: 34px; height: 34px; border-radius: 50%; flex-shrink: 0;
          background: var(--grad-indigo); color: white;
          display: flex; align-items: center; justify-content: center;
          font-family: var(--font-display); font-weight: 700; font-size: 14px;
        }
        .nav__drop-name { font-size: 13px; font-weight: 600; color: var(--text-1); }
        .nav__drop-email { font-size: 11px; color: var(--text-3); font-family: var(--font-mono); margin-top: 1px; }
        .nav__drop-sep { height: 1px; background: var(--border-1); margin: 4px 0; }
        .nav__drop-item {
          display: flex; align-items: center; gap: 10px; width: 100%;
          padding: 10px 16px; font-size: 13px; font-weight: 500;
          color: var(--text-2); background: none; border: none; cursor: pointer;
          transition: all 0.15s; text-align: left;
        }
        .nav__drop-item:hover { color: var(--text-1); background: var(--surface-3); }
        .nav__drop-item--red { color: var(--red-soft) !important; }
        .nav__drop-item--red:hover { background: var(--red-glow) !important; }
        .nav__ham {
          display: none; background: none; border: 1px solid var(--border-1);
          color: var(--text-2); font-size: 20px; padding: 6px; border-radius: var(--r-sm);
          transition: all 0.15s;
        }
        .nav__ham:hover { background: var(--surface-3); color: var(--text-1); }
        .nav__mobile {
          background: var(--surface-1); border-top: 1px solid var(--border-1);
          padding: 8px 12px 16px; display: flex; flex-direction: column; gap: 2px;
        }
        .nav__m-item {
          padding: 10px 14px; border-radius: var(--r-sm); font-size: 14px; font-weight: 500;
          color: var(--text-2); transition: all 0.15s; background: none; border: none;
          cursor: pointer; text-align: left;
        }
        .nav__m-item:hover { color: var(--text-1); background: var(--surface-3); }
        .nav__m-item--red   { color: var(--red-soft); }
        .nav__m-item--accent { color: var(--indigo-light); }
        .nav__m-sep { height: 1px; background: var(--border-1); margin: 6px 0; }
        @media (max-width: 820px) {
          .nav__links { display: none; }
          .nav__right .btn, .nav__right .nav__avatar-wrap { display: none; }
          .nav__ham { display: flex; }
        }
      `}</style>
    </>
  )
}
