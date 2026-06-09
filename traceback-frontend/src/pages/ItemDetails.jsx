import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import itemService from '../services/itemService'
import claimService from '../services/claimService'
import { useAuth } from '../hooks/useAuth'
import ItemCard from '../components/ItemCard'
import toast from 'react-hot-toast'
import { RiArrowLeftLine, RiMapPin2Line, RiTimeLine, RiUserLine, RiGiftLine, RiCheckboxCircleLine, RiDeleteBinLine } from 'react-icons/ri'
import { format } from 'date-fns'

export default function ItemDetails() {
  const { id }   = useParams()
  const navigate = useNavigate()
  const { user, isAuthenticated, isAdmin } = useAuth()
  const [item, setItem] = useState(null)
  const [matches, setMatches] = useState([])
  const [claims,  setClaims]  = useState([])
  const [loading, setLoading] = useState(true)
  const [tab,     setTab]     = useState('details')

  const isOwner = item && user && item.postedBy?.email === user.email
  const imgs    = item?.imageUrls?.split(',').filter(Boolean) || []

  useEffect(() => {
    Promise.all([
      itemService.getById(id),
      itemService.getMatches(id, 6).catch(() => []),
    ]).then(([it, m]) => {
      setItem(it)
      setMatches(Array.isArray(m) ? m : [])
    }).catch(() => { toast.error('Not found'); navigate('/') })
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    if (!isOwner) return
    claimService.forItem(id).then(setClaims).catch(() => {})
  }, [isOwner, id])

  const doDelete = async () => {
    if (!window.confirm('Delete this item permanently?')) return
    try { await itemService.remove(id); toast.success('Deleted'); navigate('/dashboard') }
    catch { toast.error('Failed') }
  }

  const doStatus = async (s) => {
    try { setItem(await itemService.setStatus(id, s)); toast.success('Status updated') }
    catch { toast.error('Failed') }
  }

  const doReview = async (cid, approve) => {
    try {
      const updated = await claimService.review(cid, approve, '')
      setClaims(p => p.map(c => c.id === cid ? updated : c))
      if (approve) setItem(p => ({ ...p, status: 'CLAIMED' }))
      toast.success(approve ? 'Approved!' : 'Rejected')
    } catch { toast.error('Failed') }
  }

  if (loading) return <div className="page-loader" style={{minHeight:'60vh'}}><div className="spinner" style={{width:36,height:36}}/></div>
  if (!item)   return null

  const isLost  = item.type === 'LOST'
  const dateStr = item.dateOccurred ? format(new Date(item.dateOccurred), 'MMMM d, yyyy') : null

  return (
    <div className="page-wrap">
      <div className="container">
        <button className="btn btn-ghost btn-sm" style={{marginBottom:24}} onClick={() => navigate(-1)}>
          <RiArrowLeftLine /> Back
        </button>
        <div className="det-layout">
          {/* ── Left ── */}
          <div className="det-main">
            <div className="det-img">
              {imgs.length > 0 ? (
                <div className="det-img-grid">
                  {imgs.map((u,i) => (
                    <img key={i} src={`/api/uploads/${u}`} alt=""
                      className={i===0?'det-img-main':'det-img-thumb'} />
                  ))}
                </div>
              ) : (
                <div className="det-no-img">
                  {item.category?.[0] ?? '?'}
                </div>
              )}
            </div>

            <div className="det-tabs">
              {['details','matches',...(isOwner?['claims']:[])].map(t => (
                <button key={t} className={`det-tab${tab===t?' active':''}`} onClick={() => setTab(t)}>
                  {t === 'claims' ? `Claims (${claims.length})` : t === 'matches' ? `Matches (${matches.length})` : 'Details'}
                </button>
              ))}
            </div>

            {tab === 'details' && (
              <div className="det-info">
                {[['Color',item.color],['Brand',item.brand],['Model',item.model],['Category',item.category],['Sub-category',item.subCategory]].filter(([,v])=>v).map(([l,v]) => (
                  <div className="det-info-row" key={l}>
                    <span className="det-info-label mono">{l}</span>
                    <span className="det-info-val">{v}</span>
                  </div>
                ))}
                {item.uniqueIdentifiers && (
                  <div className="det-info-row det-info-row--full">
                    <span className="det-info-label mono">Unique Identifiers</span>
                    <span className="det-info-val">{item.uniqueIdentifiers}</span>
                  </div>
                )}
                {item.description && (
                  <div className="det-desc">
                    <span className="det-info-label mono">Description</span>
                    <p>{item.description}</p>
                  </div>
                )}
              </div>
            )}

            {tab === 'matches' && (
              matches.length === 0
                ? <div className="empty"><h3>NO MATCHES YET</h3><p>We'll notify you when a match is found</p></div>
                : <div className="grid-3" style={{marginTop:16}}>
                    {matches.map((m,i) => {
                      const itm = m.item || m
                      return (
                        <div key={i} style={{position:'relative'}}>
                          <div className="det-match-score mono">{m.scorePercent ?? Math.round((m.score||0)*100)}%</div>
                          <ItemCard item={itm} />
                        </div>
                      )
                    })}
                  </div>
            )}

            {tab === 'claims' && isOwner && (
              claims.length === 0
                ? <div className="empty"><h3>NO CLAIMS YET</h3><p>Claims will appear here when submitted</p></div>
                : <div className="det-claims">
                    {claims.map(c => (
                      <div className="det-claim card" key={c.id}>
                        <div className="det-claim__top">
                          <div className="det-claim__user">
                            <div className="det-claim__av">{c.claimant?.username?.[0]?.toUpperCase()}</div>
                            <div>
                              <strong>{c.claimant?.fullName || c.claimant?.username}</strong>
                              <span className="mono">{c.claimant?.email}</span>
                            </div>
                          </div>
                          <span className={`badge badge-${c.status?.toLowerCase()}`}>{c.status}</span>
                        </div>
                        <p className="det-claim__desc">{c.description}</p>
                        <div className="det-claim__foot">
                          <span className="mono" style={{fontSize:11,color:'var(--text-3)'}}>
                            Match: <span style={{color:'var(--amber)'}}>{Math.round((c.matchScore||0)*100)}%</span>
                          </span>
                          {c.status === 'PENDING' && (
                            <div style={{display:'flex',gap:8}}>
                              <button className="btn btn-sm btn-primary" onClick={() => doReview(c.id, true)}>
                                <RiCheckboxCircleLine /> Approve
                              </button>
                              <button className="btn btn-sm btn-danger" onClick={() => doReview(c.id, false)}>
                                Reject
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
            )}
          </div>

          {/* ── Sidebar ── */}
          <div className="det-sidebar">
            <div className="det-sidebar-card card">
              <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:16}}>
                <span className={`badge badge-${isLost?'lost':'found'}`}>{isLost?'◈ LOST':'◉ FOUND'}</span>
                <span className={`badge badge-${item.status?.toLowerCase()}`}>{item.status}</span>
              </div>
              <h1 className="det-title">{item.title}</h1>
              <div className="det-meta">
                {item.locationName && <div className="det-meta-row"><RiMapPin2Line/><span>{item.locationName}</span></div>}
                {dateStr && <div className="det-meta-row"><RiTimeLine/><span>{isLost?'Lost':'Found'} {dateStr}</span></div>}
                {item.postedBy && <div className="det-meta-row"><RiUserLine/><span>By <strong>{item.postedBy.fullName||item.postedBy.username}</strong></span></div>}
              </div>
              {item.rewardAmount > 0 && (
                <div className="det-reward"><RiGiftLine/>₹{item.rewardAmount} Reward</div>
              )}
              <div className="divider"/>
              {!isOwner && isAuthenticated && item.status === 'ACTIVE' && (
                <Link to={`/items/${id}/claim`} className="btn btn-primary btn-lg" style={{width:'100%',justifyContent:'center'}}>
                  <RiCheckboxCircleLine /> {isLost ? 'I Found This!' : 'This Is Mine!'}
                </Link>
              )}
              {!isAuthenticated && (
                <Link to="/login" state={{from:`/items/${id}`}} className="btn btn-outline btn-lg" style={{width:'100%',justifyContent:'center'}}>
                  Login to Claim
                </Link>
              )}
              {isOwner && (
                <div className="det-owner">
                  <p className="mono" style={{fontSize:10,color:'var(--amber)',letterSpacing:'0.1em',marginBottom:10}}>// OWNER CONTROLS</p>
                  {item.status==='ACTIVE' && (
                    <button className="btn btn-outline btn-sm" onClick={() => doStatus('RESOLVED')}>
                      <RiCheckboxCircleLine/> Mark Resolved
                    </button>
                  )}
                  <button className="btn btn-danger btn-sm" onClick={doDelete}>
                    <RiDeleteBinLine/> Delete
                  </button>
                </div>
              )}
              {isAdmin && !isOwner && (
                <div className="det-owner">
                  <p className="mono" style={{fontSize:10,color:'var(--amber)',letterSpacing:'0.1em',marginBottom:10}}>// ADMIN</p>
                  <select className="form-input" value={item.status} onChange={e=>doStatus(e.target.value)}>
                    {['ACTIVE','CLAIMED','RESOLVED','EXPIRED','ARCHIVED'].map(s=><option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .det-layout{display:grid;grid-template-columns:1fr 340px;gap:28px;align-items:start}
        .det-img{margin-bottom:20px}
        .det-img-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
        .det-img-main{grid-column:1/-1;width:100%;height:300px;object-fit:cover;border-radius:var(--r-md)}
        .det-img-thumb{width:100%;height:120px;object-fit:cover;border-radius:var(--r-sm)}
        .det-no-img{height:280px;background:var(--navy-3);border-radius:var(--r-md);display:flex;align-items:center;justify-content:center;font-family:var(--font-display);font-size:80px;letter-spacing:4px;color:var(--border-2)}
        .det-tabs{display:flex;gap:4px;margin-bottom:20px;border-bottom:1px solid var(--border-1)}
        .det-tab{padding:9px 16px 11px;background:none;border:none;font-family:var(--font-mono);font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:var(--text-3);cursor:pointer;border-bottom:2px solid transparent;transition:all 0.15s;margin-bottom:-1px;capitalize:none}
        .det-tab:hover{color:var(--text-1)}
        .det-tab.active{color:var(--amber);border-bottom-color:var(--amber)}
        .det-info{display:grid;grid-template-columns:1fr 1fr;gap:1px;background:var(--border-1);border:1px solid var(--border-1);border-radius:var(--r-md);overflow:hidden}
        .det-info-row{background:var(--navy-2);padding:14px 18px}
        .det-info-row--full{grid-column:1/-1}
        .det-info-label{font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:var(--text-3);display:block;margin-bottom:4px}
        .det-info-val{font-size:14px;color:var(--text-1);text-transform:capitalize}
        .det-desc{grid-column:1/-1;background:var(--navy-2);padding:18px}
        .det-desc p{font-size:14px;color:var(--text-2);line-height:1.7;margin-top:6px}
        .det-match-score{position:absolute;bottom:52px;right:10px;z-index:1;background:rgba(0,0,0,0.8);color:var(--amber);font-size:11px;font-weight:500;padding:3px 8px;border-radius:3px;pointer-events:none;letter-spacing:0.06em}
        .det-claims{display:flex;flex-direction:column;gap:12px;margin-top:16px}
        .det-claim{padding:18px}
        .det-claim__top{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px}
        .det-claim__user{display:flex;align-items:center;gap:10px}
        .det-claim__av{width:32px;height:32px;border-radius:50%;background:var(--amber);color:var(--navy);display:flex;align-items:center;justify-content:center;font-family:var(--font-display);font-size:16px;font-weight:700;letter-spacing:1px}
        .det-claim__user strong{font-size:14px;font-weight:600;display:block}
        .det-claim__user span{font-size:11px;color:var(--text-3)}
        .det-claim__desc{font-size:13px;color:var(--text-2);line-height:1.6;margin-bottom:12px}
        .det-claim__foot{display:flex;justify-content:space-between;align-items:center}
        .det-sidebar-card{padding:24px}
        .det-title{font-family:var(--font-display);font-size:24px;letter-spacing:1px;line-height:1.2;margin-bottom:16px}
        .det-meta{display:flex;flex-direction:column;gap:9px;margin-bottom:16px}
        .det-meta-row{display:flex;align-items:center;gap:8px;font-size:13px;color:var(--text-2)}
        .det-meta-row svg{flex-shrink:0;color:var(--text-3);font-size:14px}
        .det-reward{display:flex;align-items:center;gap:8px;color:var(--amber);font-weight:600;font-size:15px;background:var(--amber-glow2);border:1px solid rgba(245,158,11,0.15);border-radius:var(--r-sm);padding:10px 14px;margin-bottom:4px}
        .det-owner{display:flex;flex-direction:column;gap:8px}
        @media(max-width:900px){.det-layout{grid-template-columns:1fr}.det-sidebar{order:-1}}
      `}</style>
    </div>
  )
}
