import React, { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import itemService from '../services/itemService'
import toast from 'react-hot-toast'
import { RiArrowLeftLine } from 'react-icons/ri'

const CATS = ['Electronics','Accessories','Clothing','Documents','Keys','Wallet / Purse','Bag / Luggage','Jewellery','Pet','Vehicle','Sports Equipment','Books','Other']

export default function ReportFoundItem() {
  const navigate  = useNavigate()
  const [loading, setLoading] = useState(false)
  const [errors,  setErrors]  = useState({})
  const [title, setTitle] = useState('')
  const [desc,  setDesc]  = useState('')
  const [cat,   setCat]   = useState('')
  const [subCat,setSubCat] = useState('')
  const [loc,   setLoc]   = useState('')
  const [lat,   setLat]   = useState('')
  const [lng,   setLng]   = useState('')
  const [date,  setDate]  = useState('')
  const [color, setColor] = useState('')
  const [brand, setBrand] = useState('')
  const [model, setModel] = useState('')
  const [uniq,  setUniq]  = useState('')

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
        title, description: desc||null, category: cat, subCategory: subCat||null,
        type: 'FOUND', locationName: loc||null,
        locationLat: lat ? parseFloat(lat) : null,
        locationLng: lng ? parseFloat(lng) : null,
        dateOccurred: date, color: color||null, brand: brand||null,
        model: model||null, uniqueIdentifiers: uniq||null,
      }
      const item = await itemService.create(payload)
      toast.success('Found item reported! Owner will be notified if matched.')
      navigate(`/items/${item.id}`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit')
    } finally { setLoading(false) }
  }, [title,desc,cat,subCat,loc,lat,lng,date,color,brand,model,uniq,navigate])

  return (
    <div className="page-wrap">
      <div className="container rp-container">
        <button className="btn btn-ghost btn-sm rp-back" onClick={() => navigate(-1)}>
          <RiArrowLeftLine /> Back
        </button>
        <div className="rp-header fade-up">
          <span className="badge badge-found" style={{marginBottom:12,display:'inline-flex'}}>◉ FOUND ITEM REPORT</span>
          <h1 className="rp-title">REPORT<br/>FOUND ITEM</h1>
          <p>Help someone get their belonging back</p>
        </div>
        <div className="rp-notice fade-up">
          <span className="mono" style={{color:'var(--amber)',fontSize:10,letterSpacing:'0.1em'}}>// NOTE</span>
          <p>Our AI matching system will automatically scan for matching lost reports and notify potential owners.</p>
        </div>
        <form onSubmit={handleSubmit} className="rp-form fade-up delay-1">
          <div className="rp-section card">
            <div className="rp-section__title mono">// ITEM DESCRIPTION</div>
            <div className="rp-grid">
              <div className="form-group rp-full">
                <label className="form-label">Title *</label>
                <input className={`form-input${errors.title?' error':''}`} placeholder="Found Black Wallet Near Metro" value={title} onChange={e=>setTitle(e.target.value)} />
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
                <input className="form-input" placeholder="e.g. Brown leather" value={subCat} onChange={e=>setSubCat(e.target.value)} />
              </div>
              <div className="form-group rp-full">
                <label className="form-label">Description</label>
                <textarea className="form-input" rows={3} placeholder="Describe what you found..." value={desc} onChange={e=>setDesc(e.target.value)} />
              </div>
              <div className="form-group"><label className="form-label">Color</label><input className="form-input" placeholder="Brown" value={color} onChange={e=>setColor(e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Brand</label><input className="form-input" placeholder="Levis" value={brand} onChange={e=>setBrand(e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Model</label><input className="form-input" placeholder="..." value={model} onChange={e=>setModel(e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Unique Identifiers</label><input className="form-input" placeholder="Serial no., engravings" value={uniq} onChange={e=>setUniq(e.target.value)} /></div>
            </div>
          </div>
          <div className="rp-section card">
            <div className="rp-section__title mono">// WHERE & WHEN FOUND</div>
            <div className="rp-grid">
              <div className="form-group rp-full"><label className="form-label">Location</label><input className="form-input" placeholder="Gate 3, Hyderabad Airport" value={loc} onChange={e=>setLoc(e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Latitude</label><input className="form-input" type="number" step="any" placeholder="17.3850" value={lat} onChange={e=>setLat(e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Longitude</label><input className="form-input" type="number" step="any" placeholder="78.4867" value={lng} onChange={e=>setLng(e.target.value)} /></div>
              <div className="form-group">
                <label className="form-label">Date Found *</label>
                <input className={`form-input${errors.date?' error':''}`} type="date" max={new Date().toISOString().split('T')[0]} value={date} onChange={e=>setDate(e.target.value)} />
                {errors.date && <span className="form-error">{errors.date}</span>}
              </div>
            </div>
          </div>
          <div className="rp-actions">
            <button type="button" className="btn btn-outline" onClick={() => navigate(-1)}>Cancel</button>
            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
              {loading ? <><span className="spinner"/> Submitting...</> : '◉ Submit Found Report'}
            </button>
          </div>
        </form>
      </div>
      <style>{`
        .rp-container{max-width:740px}
        .rp-back{margin-bottom:28px;color:var(--text-3)}
        .rp-header{margin-bottom:24px}
        .rp-title{font-family:var(--font-display);font-size:52px;letter-spacing:2px;line-height:0.95;margin-bottom:10px}
        .rp-header p{color:var(--text-3);font-size:14px}
        .rp-notice{background:var(--amber-glow2);border:1px solid rgba(245,158,11,0.15);border-radius:var(--r-sm);padding:14px 18px;margin-bottom:20px}
        .rp-notice p{font-size:13px;color:var(--text-2);margin-top:4px}
        .rp-form{display:flex;flex-direction:column;gap:20px}
        .rp-section{padding:24px 28px}
        .rp-section__title{font-size:10px;letter-spacing:0.14em;color:var(--amber);margin-bottom:18px;text-transform:uppercase}
        .rp-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
        .rp-full{grid-column:1/-1}
        .rp-actions{display:flex;justify-content:flex-end;gap:12px;padding-top:8px}
        @media(max-width:560px){.rp-grid{grid-template-columns:1fr}.rp-actions{flex-direction:column}}
      `}</style>
    </div>
  )
}
