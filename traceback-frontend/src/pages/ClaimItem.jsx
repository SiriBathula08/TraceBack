import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import itemService from '../services/itemService'
import claimService from '../services/claimService'
import toast from 'react-hot-toast'
import { RiArrowLeftLine, RiShieldCheckLine } from 'react-icons/ri'
import { format } from 'date-fns'

export default function ClaimItem() {
  const { id }    = useParams()
  const navigate  = useNavigate()
  const [item,    setItem]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [submit,  setSubmit]  = useState(false)
  const [desc,    setDesc]    = useState('')
  const [error,   setError]   = useState('')

  useEffect(() => {
    itemService.getById(id)
      .then(setItem)
      .catch(() => { toast.error('Item not found'); navigate('/') })
      .finally(() => setLoading(false))
  }, [id])

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()
    if (!desc.trim() || desc.length < 20) { setError('Please write at least 20 characters'); return }
    setSubmit(true)
    try {
      await claimService.submit({ itemId: parseInt(id), description: desc })
      toast.success('Claim submitted! Owner will review shortly.')
      navigate(`/items/${id}`)
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit'
      toast.error(msg); setError(msg)
    } finally { setSubmit(false) }
  }, [desc, id, navigate])

  if (loading) return <div className="page-loader" style={{minHeight:'60vh'}}><div className="spinner" style={{width:32,height:32}}/></div>
  if (!item)   return null

  return (
    <div className="page-wrap">
      <div className="container" style={{maxWidth:640}}>
        <button className="btn btn-ghost btn-sm" style={{marginBottom:24}} onClick={() => navigate(-1)}>
          <RiArrowLeftLine /> Back
        </button>
        <div className="cl-header fade-up">
          <span className={`badge badge-${item.type?.toLowerCase()}`} style={{marginBottom:12,display:'inline-flex'}}>
            {item.type === 'LOST' ? '◈ LOST' : '◉ FOUND'}
          </span>
          <h1 className="cl-title">{item.type==='LOST'?'I FOUND THIS':'THIS IS MINE'}</h1>
          <p>Submit a claim for <strong>{item.title}</strong></p>
        </div>

        {/* Item preview */}
        <div className="cl-preview card fade-up">
          <div className="cl-preview__badge">ITEM</div>
          <h2 className="cl-preview__title">{item.title}</h2>
          <div className="cl-preview__meta mono">
            {item.locationName && <span>📍 {item.locationName}</span>}
            {item.dateOccurred && <span>📅 {format(new Date(item.dateOccurred),'MMM d, yyyy')}</span>}
            {item.category && <span>🏷 {item.category}</span>}
          </div>
        </div>

        <div className="cl-tips card fade-up">
          <span className="mono" style={{fontSize:10,color:'var(--amber)',letterSpacing:'0.1em',display:'block',marginBottom:10}}>// TIPS FOR A SUCCESSFUL CLAIM</span>
          <ul>
            <li>Mention details only the true owner would know (contents, serial no., unique marks)</li>
            <li>Explain when and where you lost it</li>
            <li>Avoid info already visible in the listing</li>
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="cl-form fade-up">
          <div className="cl-form-card card">
            <span className="mono" style={{fontSize:10,color:'var(--amber)',letterSpacing:'0.1em',display:'block',marginBottom:14}}>// YOUR CLAIM</span>
            <div className="form-group">
              <label className="form-label">
                Claim Description *
                <span style={{float:'right',fontWeight:400,textTransform:'none',letterSpacing:0,color:'var(--text-4)'}}>{desc.length}/500</span>
              </label>
              <textarea
                className={`form-input cl-ta${error?' error':''}`}
                placeholder="Describe proof of ownership: specific item details, contents, where and when you lost it exactly..."
                value={desc}
                maxLength={500}
                onChange={e => { setDesc(e.target.value); setError('') }}
              />
              {error && <span className="form-error">{error}</span>}
            </div>
          </div>
          <div style={{display:'flex',justifyContent:'flex-end',gap:12}}>
            <Link to={`/items/${id}`} className="btn btn-outline">Cancel</Link>
            <button type="submit" className="btn btn-primary btn-lg" disabled={submit}>
              {submit ? <><span className="spinner"/>Submitting...</> : <><RiShieldCheckLine/>Submit Claim</>}
            </button>
          </div>
        </form>
      </div>
      <style>{`
        .cl-header{margin-bottom:24px}
        .cl-title{font-family:var(--font-display);font-size:52px;letter-spacing:2px;line-height:0.95;margin-bottom:8px}
        .cl-header p{font-size:14px;color:var(--text-2)}
        .cl-preview{padding:20px 24px;margin-bottom:16px}
        .cl-preview__badge{font-family:var(--font-mono);font-size:9px;letter-spacing:0.12em;color:var(--text-3);margin-bottom:8px}
        .cl-preview__title{font-family:var(--font-display);font-size:20px;letter-spacing:0.5px;margin-bottom:10px}
        .cl-preview__meta{display:flex;gap:16px;flex-wrap:wrap;font-size:11px;color:var(--text-3)}
        .cl-tips{padding:16px 20px;margin-bottom:20px;background:var(--amber-glow2);border-color:rgba(245,158,11,0.15)!important}
        .cl-tips ul{padding-left:16px;display:flex;flex-direction:column;gap:6px}
        .cl-tips li{font-size:13px;color:var(--text-2);line-height:1.5}
        .cl-form{display:flex;flex-direction:column;gap:16px}
        .cl-form-card{padding:22px}
        .cl-ta{min-height:160px}
      `}</style>
    </div>
  )
}
