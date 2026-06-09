import React, { useState, useCallback } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import toast from 'react-hot-toast'
import { RiEyeLine, RiEyeOffLine, RiFlashlightLine } from 'react-icons/ri'

export default function Login() {
  const { login }  = useAuth()
  const navigate   = useNavigate()
  const location   = useLocation()
  const from       = location.state?.from || '/dashboard'
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPw,   setShowPw]   = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [errors,   setErrors]   = useState({})

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()
    const errs = {}
    if (!email.trim())    errs.email    = 'Required'
    if (!password.trim()) errs.password = 'Required'
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    try {
      const user = await login(email.trim(), password)
      toast.success(`Welcome back!`)
      navigate('/', { replace: true })
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid email or password'
      toast.error(msg)
      setErrors({ general: msg })
    } finally { setLoading(false) }
  }, [email, password, login, navigate, from])

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="orb orb-indigo" style={{width:500,height:500,top:-100,left:-100}} />
        <div className="orb orb-purple" style={{width:400,height:400,bottom:-150,right:-100}} />
        <div className="auth-grid-lines" />
      </div>

      <div className="auth-card card-glass fade-up">
        {/* Left panel */}
        <div className="auth-left">
          <Link to="/" className="auth-brand">
            <div className="auth-brand-icon">
              <svg width="20" height="20" viewBox="0 0 18 18" fill="none">
                <circle cx="9" cy="9" r="8" stroke="#818cf8" strokeWidth="1.5"/>
                <circle cx="9" cy="9" r="4" fill="#6366f1" opacity="0.5"/>
                <circle cx="9" cy="9" r="1.5" fill="#a5b4fc"/>
              </svg>
            </div>
            TraceBack
          </Link>

          <div className="auth-left-content">
            <h1 className="auth-left-title">Welcome<br/>back.</h1>
            <p className="auth-left-sub">Sign in to track your lost items and manage claims.</p>

            <div className="auth-features">
              {['Smart AI matching','Real-time notifications','Secure claim verification'].map(f => (
                <div key={f} className="auth-feature">
                  <div className="auth-feature-dot" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="auth-demo-box">
            <div className="auth-demo-label"><RiFlashlightLine style={{color:'var(--gold)'}} /> Demo credentials</div>
            <div className="auth-demo-row">
              <span>Admin</span>
              <code>admin@lostfound.com</code>
              <code>Admin1234</code>
            </div>
            <div className="auth-demo-row">
              <span>User</span>
              <code>test@lostfound.com</code>
              <code>Test1234</code>
            </div>
          </div>
        </div>

        {/* Right form */}
        <div className="auth-right">
          <h2 className="auth-form-title">Sign in</h2>
          <p className="auth-form-sub">
            New to TraceBack? <Link to="/register" className="auth-link">Create account</Link>
          </p>

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input type="email" className={`form-input${errors.email?' error':''}`}
                placeholder="you@example.com" value={email}
                onChange={e => setEmail(e.target.value)} autoComplete="email" autoFocus />
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="pw-wrap">
                <input type={showPw?'text':'password'}
                  className={`form-input${errors.password?' error':''}`}
                  placeholder="••••••••" value={password}
                  onChange={e => setPassword(e.target.value)} autoComplete="current-password" />
                <button type="button" className="pw-eye" onClick={() => setShowPw(p=>!p)} tabIndex={-1}>
                  {showPw ? <RiEyeOffLine /> : <RiEyeLine />}
                </button>
              </div>
              {errors.password && <span className="form-error">{errors.password}</span>}
            </div>

            {errors.general && (
              <div className="auth-error-box">{errors.general}</div>
            )}

            <button type="submit" className="btn btn-primary btn-lg auth-submit" disabled={loading}>
              {loading ? <><span className="spinner"/>Signing in...</> : 'Sign in →'}
            </button>
          </form>
        </div>
      </div>

      <style>{`
        .auth-page {
          min-height: calc(100vh - 68px);
          display: flex; align-items: center; justify-content: center;
          padding: 40px 16px; position: relative; overflow: hidden;
        }
        .auth-bg { position: absolute; inset: 0; pointer-events: none; }
        .auth-grid-lines {
          position: absolute; inset: 0;
          background-image: linear-gradient(var(--border-1) 1px, transparent 1px),
            linear-gradient(90deg, var(--border-1) 1px, transparent 1px);
          background-size: 60px 60px;
          mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black, transparent);
        }
        .auth-card {
          position: relative; z-index: 1;
          display: grid; grid-template-columns: 1fr 1fr;
          max-width: 900px; width: 100%;
          box-shadow: var(--shadow-lg), 0 0 0 1px var(--border-2);
          overflow: hidden;
        }
        .auth-left {
          padding: 48px 44px; background: var(--surface-2);
          border-right: 1px solid var(--border-1);
          display: flex; flex-direction: column; gap: 0;
          position: relative; overflow: hidden;
        }
        .auth-left::before {
          content: ''; position: absolute; top: -80px; right: -80px;
          width: 200px; height: 200px; border-radius: 50%;
          background: var(--indigo-glow); filter: blur(60px);
        }
        .auth-brand {
          display: flex; align-items: center; gap: 10px;
          font-family: var(--font-display); font-size: 17px; font-weight: 700;
          color: var(--text-1); letter-spacing: -0.03em; margin-bottom: 44px;
        }
        .auth-brand-icon {
          width: 34px; height: 34px; border-radius: 8px;
          background: var(--indigo-glow); border: 1px solid var(--border-accent);
          display: flex; align-items: center; justify-content: center;
        }
        .auth-left-content { flex: 1; }
        .auth-left-title {
          font-family: var(--font-display); font-size: 52px; font-weight: 700;
          letter-spacing: -0.04em; line-height: 1; color: var(--text-1); margin-bottom: 16px;
        }
        .auth-left-sub { font-size: 14px; color: var(--text-3); line-height: 1.7; margin-bottom: 32px; }
        .auth-features { display: flex; flex-direction: column; gap: 12px; }
        .auth-feature { display: flex; align-items: center; gap: 10px; font-size: 13px; color: var(--text-2); }
        .auth-feature-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--indigo-light); flex-shrink: 0; }
        .auth-demo-box {
          margin-top: 32px;
          background: var(--surface-3); border: 1px solid var(--border-2);
          border-radius: var(--r-md); padding: 16px 18px;
        }
        .auth-demo-label {
          display: flex; align-items: center; gap: 6px;
          font-size: 10px; font-weight: 700; letter-spacing: 0.08em;
          color: var(--gold); text-transform: uppercase; font-family: var(--font-mono); margin-bottom: 12px;
        }
        .auth-demo-row {
          display: flex; align-items: center; gap: 8px;
          font-size: 11px; margin-bottom: 8px;
        }
        .auth-demo-row:last-child { margin-bottom: 0; }
        .auth-demo-row span { color: var(--text-3); min-width: 36px; font-family: var(--font-mono); }
        .auth-demo-row code {
          background: var(--surface-1); padding: 2px 8px; border-radius: 4px;
          color: var(--indigo-light); font-family: var(--font-mono); font-size: 11px;
          border: 1px solid var(--border-1);
        }
        .auth-right { padding: 48px 44px; display: flex; flex-direction: column; justify-content: center; }
        .auth-form-title {
          font-family: var(--font-display); font-size: 32px; font-weight: 700;
          letter-spacing: -0.04em; margin-bottom: 6px;
        }
        .auth-form-sub { font-size: 14px; color: var(--text-3); margin-bottom: 36px; }
        .auth-link { color: var(--indigo-light); font-weight: 500; transition: opacity 0.15s; }
        .auth-link:hover { opacity: 0.8; }
        .auth-form { display: flex; flex-direction: column; gap: 20px; }
        .pw-wrap { position: relative; }
        .pw-eye {
          position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
          background: none; border: none; color: var(--text-3); font-size: 17px;
          cursor: pointer; display: flex; transition: color 0.15s;
        }
        .pw-eye:hover { color: var(--text-1); }
        .auth-error-box {
          background: var(--red-glow); border: 1px solid rgba(244,63,94,0.2);
          border-radius: var(--r-sm); padding: 12px 16px;
          font-size: 13px; color: var(--red-soft);
        }
        .auth-submit { width: 100%; justify-content: center; }
        @media (max-width: 700px) {
          .auth-card { grid-template-columns: 1fr; }
          .auth-left { display: none; }
          .auth-right { padding: 36px 24px; }
        }
      `}</style>
    </div>
  )
}
