import React, { useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import toast from 'react-hot-toast'
import { RiEyeLine, RiEyeOffLine } from 'react-icons/ri'

export default function Register() {
  const { register } = useAuth()
  const navigate     = useNavigate()
  const [username,    setUsername]    = useState('')
  const [email,       setEmail]       = useState('')
  const [fullName,    setFullName]    = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [password,    setPassword]    = useState('')
  const [showPw,      setShowPw]      = useState(false)
  const [loading,     setLoading]     = useState(false)
  const [errors,      setErrors]      = useState({})

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()
    const errs = {}
    if (!fullName.trim())               errs.fullName = 'Required'
    if (!username.trim()||username.length<3) errs.username = 'Min 3 chars'
    if (!email.trim())                  errs.email    = 'Required'
    if (!password||password.length<8)   errs.password = 'Min 8 characters'
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setLoading(true)
    try {
      const user = await register({ username, email, password, fullName, phoneNumber })
      toast.success(`Welcome to TraceBack, ${user.username}!`)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      console.error('Register error:', err.response?.data)
      const data = err.response?.data || {}
      const fe   = data.errors || {}
      if (Object.keys(fe).length) {
        setErrors(fe)
        toast.error('Please fix the errors below')
      } else {
        const msg = data.message || 'Registration failed'
        toast.error(msg)
        setErrors({ general: msg })
      }
    } finally { setLoading(false) }
  }, [username, email, fullName, phoneNumber, password, register, navigate])

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="orb orb-indigo" style={{width:500,height:500,top:-150,right:-100}} />
        <div className="orb orb-gold"   style={{width:300,height:300,bottom:-100,left:-50}} />
        <div className="auth-grid-lines" />
      </div>

      <div className="auth-card card-glass fade-up">
        {/* Left */}
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
            <h1 className="auth-left-title">Start your<br/>journey.</h1>
            <p className="auth-left-sub">Join thousands recovering lost items with AI-powered matching.</p>
            <div className="auth-steps">
              {[
                ['01', 'Create account', 'Takes less than 60 seconds'],
                ['02', 'Report your item', 'Lost or found — describe it in detail'],
                ['03', 'Get matched', 'AI connects you with the right person'],
              ].map(([n, t, s]) => (
                <div key={n} className="auth-step">
                  <div className="auth-step-num">{n}</div>
                  <div>
                    <div className="auth-step-title">{t}</div>
                    <div className="auth-step-sub">{s}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right form */}
        <div className="auth-right">
          <h2 className="auth-form-title">Create account</h2>
          <p className="auth-form-sub">
            Already have one? <Link to="/login" className="auth-link">Sign in</Link>
          </p>

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <div className="auth-row">
              <div className="form-group">
                <label className="form-label">Full name *</label>
                <input type="text" className={`form-input${errors.fullName?' error':''}`}
                  placeholder="Ravi Kumar" value={fullName}
                  onChange={e => setFullName(e.target.value)} autoFocus />
                {errors.fullName && <span className="form-error">{errors.fullName}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Username *</label>
                <input type="text" className={`form-input${errors.username?' error':''}`}
                  placeholder="ravikumar" value={username}
                  onChange={e => setUsername(e.target.value)} />
                {errors.username && <span className="form-error">{errors.username}</span>}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email address *</label>
              <input type="email" className={`form-input${errors.email?' error':''}`}
                placeholder="ravi@example.com" value={email}
                onChange={e => setEmail(e.target.value)} autoComplete="email" />
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Phone <span style={{color:'var(--text-4)',textTransform:'none',letterSpacing:0}}>optional</span></label>
              <input type="tel" className="form-input"
                placeholder="+91 98765 43210" value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value)} />
            </div>

            <div className="form-group">
              <label className="form-label">Password * <span style={{color:'var(--text-4)',textTransform:'none',letterSpacing:0,fontWeight:400}}>min 8 chars</span></label>
              <div className="pw-wrap">
                <input type={showPw?'text':'password'}
                  className={`form-input${errors.password?' error':''}`}
                  placeholder="Create a strong password" value={password}
                  onChange={e => setPassword(e.target.value)} autoComplete="new-password" />
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
              {loading ? <><span className="spinner"/>Creating account...</> : 'Create account →'}
            </button>

            <p className="auth-terms">By registering you agree to our Terms of Service.</p>
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
          max-width: 940px; width: 100%;
          box-shadow: var(--shadow-lg), 0 0 0 1px var(--border-2);
          overflow: hidden;
        }
        .auth-left {
          padding: 44px 40px; background: var(--surface-2);
          border-right: 1px solid var(--border-1);
          display: flex; flex-direction: column; position: relative; overflow: hidden;
        }
        .auth-left::before {
          content: ''; position: absolute; bottom: -60px; left: -60px;
          width: 200px; height: 200px; border-radius: 50%;
          background: var(--indigo-glow); filter: blur(60px);
        }
        .auth-brand {
          display: flex; align-items: center; gap: 10px;
          font-family: var(--font-display); font-size: 17px; font-weight: 700;
          color: var(--text-1); letter-spacing: -0.03em; margin-bottom: 40px;
        }
        .auth-brand-icon {
          width: 34px; height: 34px; border-radius: 8px;
          background: var(--indigo-glow); border: 1px solid var(--border-accent);
          display: flex; align-items: center; justify-content: center;
        }
        .auth-left-content { flex: 1; }
        .auth-left-title {
          font-family: var(--font-display); font-size: 44px; font-weight: 700;
          letter-spacing: -0.04em; line-height: 1.05; color: var(--text-1); margin-bottom: 14px;
        }
        .auth-left-sub { font-size: 14px; color: var(--text-3); line-height: 1.7; margin-bottom: 36px; }
        .auth-steps { display: flex; flex-direction: column; gap: 20px; }
        .auth-step { display: flex; align-items: flex-start; gap: 14px; }
        .auth-step-num {
          font-family: var(--font-mono); font-size: 11px; font-weight: 700;
          color: var(--indigo-light); background: var(--indigo-glow2);
          border: 1px solid rgba(99,102,241,0.2); border-radius: 6px;
          padding: 4px 8px; flex-shrink: 0; margin-top: 2px;
        }
        .auth-step-title { font-size: 13px; font-weight: 600; color: var(--text-1); margin-bottom: 2px; }
        .auth-step-sub   { font-size: 12px; color: var(--text-3); line-height: 1.5; }
        .auth-right { padding: 44px 40px; display: flex; flex-direction: column; justify-content: center; overflow-y: auto; }
        .auth-form-title {
          font-family: var(--font-display); font-size: 28px; font-weight: 700;
          letter-spacing: -0.04em; margin-bottom: 6px;
        }
        .auth-form-sub { font-size: 14px; color: var(--text-3); margin-bottom: 28px; }
        .auth-link { color: var(--indigo-light); font-weight: 500; }
        .auth-link:hover { opacity: 0.8; }
        .auth-form { display: flex; flex-direction: column; gap: 16px; }
        .auth-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
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
        .auth-terms { font-size: 11px; color: var(--text-4); text-align: center; }
        @media (max-width: 700px) {
          .auth-card { grid-template-columns: 1fr; }
          .auth-left { display: none; }
          .auth-right { padding: 32px 20px; }
          .auth-row { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  )
}
