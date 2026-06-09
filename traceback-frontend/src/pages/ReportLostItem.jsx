import React, { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import itemService from '../services/itemService'
import toast from 'react-hot-toast'
import { RiArrowLeftLine } from 'react-icons/ri'

const CATS = ['Electronics','Accessories','Clothing','Documents','Keys','Wallet / Purse','Bag / Luggage','Jewellery','Pet','Vehicle','Sports Equipment','Books','Other']

export default function ReportLostItem() {
  const navigate  = useNavigate()
  const [loading, setLoading] = useState(false)
  const [errors,  setErrors]  = useState({})
  const [title,   setTitle]   = useState('')
  const [desc,    setDesc]    = useState('')
  const [cat,     setCat]     = useState('')
  const [subCat,  setSubCat]  = useState('')
  const [loc,     setLoc]     = useState('')
  const [lat,     setLat]     = useState('')
  const [lng,     setLng]     = useState('')
  const [date,    setDate]    = useState('')
  const [color,   setColor]   = useState('')
  const [brand,   setBrand]   = useState('')
  const [model,   setModel]   = useState('')
  const [uniq,    setUniq]    = useState('')
  const [reward,  setReward]  = useState('')

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()
    const errs = {}
    if (!title.trim()) errs.title = 'Required'
    if (!cat)          errs.cat   = 'Required'
    if (!date)         errs.date  = 'Required'
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    try {
      const payload = {
        title, description: desc || null, category: cat,
        subCategory: subCat || null, type: 'LOST',
        locationName: loc || null,
        locationLat: lat ? parseFloat(lat) : null,
        locationLng: lng ? parseFloat(lng) : null,
        dateOccurred: date, color: color || null, brand: brand || null,
        model: model || null, uniqueIdentifiers: uniq || null,
        rewardAmount: reward ? parseFloat(reward) : null,
      }
      const item = await itemService.create(payload)
      toast.success('Lost item reported!')
      navigate(`/items/${item.id}`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit')
      if (err.response?.data?.errors) setErrors(err.response.data.errors)
    } finally { setLoading(false) }
  }, [title,desc,cat,subCat,loc,lat,lng,date,color,brand,model,uniq,reward,navigate])

  return (
    <div className="page-wrap">
      <div className="container rp-container">
        <button className="btn btn-ghost btn-sm rp-back" onClick={() => navigate(-1)}>
          <RiArrowLeftLine /> Back
        </button>
        <div className="rp-header fade-up">
          <span className="badge badge-lost" style={{marginBottom:12,display:'inline-flex'}}>◈ LOST ITEM REPORT</span>
          <h1 className="rp-title">REPORT<br/>LOST ITEM</h1>
          <p>More details = better matching accuracy</p>
        </div>
        <form onSubmit={handleSubmit} className="rp-form fade-up delay-1">
          <Section title="// IDENTIFICATION">
            <div className="rp-grid">
              <div className="form-group rp-full">
                <label className="form-label">Title *</label>
                <input className={`form-input${errors.title?' error':''}`} placeholder="e.g. Black Levis Wallet" value={title} onChange={e=>setTitle(e.target.value)} />
                {errors.title && <span className="form-error">{errors.title}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Category *</label>
                <select className={`form-input${errors.cat?' error':''}`} value={cat} onChange={e=>setCat(e.target.value)}>
                  <option value="">Select...</option>
                  {CATS.map(c=><option key={c} value={c}>{c}</option>)}
                </select>
                {errors.cat && <span className="form-error">{errors.cat}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Sub-category</label>
                <input className="form-input" placeholder="e.g. Leather bi-fold" value={subCat} onChange={e=>setSubCat(e.target.value)} />
              </div>
              <div className="form-group rp-full">
                <label className="form-label">Description</label>
                <textarea className="form-input" rows={3} placeholder="Describe the item in detail..." value={desc} onChange={e=>setDesc(e.target.value)} />
              </div>
            </div>
          </Section>
          <Section title="// ATTRIBUTES">
            <div className="rp-grid">
              <div className="form-group"><label className="form-label">Color</label><input className="form-input" placeholder="Black" value={color} onChange={e=>setColor(e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Brand</label><input className="form-input" placeholder="Samsung" value={brand} onChange={e=>setBrand(e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Model</label><input className="form-input" placeholder="Galaxy S23" value={model} onChange={e=>setModel(e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Reward (₹)</label><input className="form-input" type="number" placeholder="500" value={reward} onChange={e=>setReward(e.target.value)} /></div>
              <div className="form-group rp-full"><label className="form-label">Unique Identifiers</label><input className="form-input" placeholder="Serial no., IMEI, inscription..." value={uniq} onChange={e=>setUniq(e.target.value)} /></div>
            </div>
          </Section>
          <Section title="// LOCATION & TIME">
            <div className="rp-grid">
              <div className="form-group rp-full"><label className="form-label">Location name</label><input className="form-input" placeholder="City Mall, Hyderabad" value={loc} onChange={e=>setLoc(e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Latitude</label><input className="form-input" type="number" step="any" placeholder="17.3850" value={lat} onChange={e=>setLat(e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Longitude</label><input className="form-input" type="number" step="any" placeholder="78.4867" value={lng} onChange={e=>setLng(e.target.value)} /></div>
              <div className="form-group">
                <label className="form-label">Date Lost *</label>
                <input className={`form-input${errors.date?' error':''}`} type="date" max={new Date().toISOString().split('T')[0]} value={date} onChange={e=>setDate(e.target.value)} />
                {errors.date && <span className="form-error">{errors.date}</span>}
              </div>
            </div>
          </Section>
          <div className="rp-actions">
            <button type="button" className="btn btn-outline" onClick={() => navigate(-1)}>Cancel</button>
            <button type="submit" className="btn btn-lg" style={{background:'var(--red-glow)',color:'#f87171',border:'1px solid rgba(239,68,68,0.3)'}} disabled={loading}>
              {loading ? <><span className="spinner"/> Submitting...</> : '◈ Submit Lost Report'}
            </button>
          </div>
        </form>
      </div>
      <style>{`
        .rp-container{max-width:740px}
        .rp-back{margin-bottom:28px;color:var(--text-3)}
        .rp-header{margin-bottom:32px}
        .rp-title{font-family:var(--font-display);font-size:52px;letter-spacing:2px;line-height:0.95;margin-bottom:10px}
        .rp-header p{color:var(--text-3);font-size:14px}
        .rp-form{display:flex;flex-direction:column;gap:20px}
        .rp-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
        .rp-full{grid-column:1/-1}
        .rp-actions{display:flex;justify-content:flex-end;gap:12px;padding-top:8px}
        @media(max-width:560px){.rp-grid{grid-template-columns:1fr}.rp-actions{flex-direction:column}}
      `}</style>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div className="rp-section card">
      <div className="rp-section__title mono">{title}</div>
      {children}
      <style>{`
        .rp-section{padding:24px 28px}
        .rp-section__title{font-size:10px;letter-spacing:0.14em;color:var(--amber);margin-bottom:18px;text-transform:uppercase}
      `}</style>
    </div>
  )
}
