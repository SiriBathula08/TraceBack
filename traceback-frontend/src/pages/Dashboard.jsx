import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import itemService from '../services/itemService'
import claimService from '../services/claimService'
import ItemCard from '../components/ItemCard'
import toast from 'react-hot-toast'
import { RiAddCircleLine, RiMapPin2Line, RiFileListLine, RiShieldCheckLine } from 'react-icons/ri'
import { format } from 'date-fns'

export default function Dashboard() {
  const { user } = useAuth()
  const [myItems,  setMyItems]  = useState([])
  const [myClaims, setMyClaims] = useState([])
  const [tab,      setTab]      = useState('items')
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    Promise.all([
      itemService.getMine(0, 20),
      claimService.getMine(0, 20),
    ]).then(([items, claims]) => {
      setMyItems(items.content || [])
      setMyClaims(claims.content || [])
    }).catch(() => toast.error('Failed to load dashboard'))
      .finally(() => setLoading(false))
  }, [])

  const withdraw = async (id) => {
    try {
      await claimService.withdraw(id)
      setMyClaims(p => p.map(c => c.id === id ? { ...c, status: 'WITHDRAWN' } : c))
      toast.success('Claim withdrawn')
    } catch { toast.error('Failed to withdraw') }
  }

  const lost  = myItems.filter(i => i.type === 'LOST').length
  const found = myItems.filter(i => i.type === 'FOUND').length

  return (
    <div className="page-wrap">
      <div className="container">
        {/* Header */}
        <div className="db-head fade-up">
          <div>
            <span className="db-eyebrow mono">// DASHBOARD</span>
            <h1 className="db-title">
              {user?.fullName?.split(' ')[0] || user?.username}<span style={{color:'var(--amber)'}}>.</span>
            </h1>
          </div>
          <div className="db-head__btns">
            <Link to="/report-lost"  className="btn btn-sm" style={{background:'var(--red-glow)',color:'#f87171',border:'1px solid rgba(239,68,68,0.25)'}}>
              <RiAddCircleLine /> Report Lost
            </Link>
            <Link to="/report-found" className="btn btn-sm btn-primary">
              <RiMapPin2Line /> Report Found
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="db-stats fade-up delay-1">
          {[
            { n: myItems.length, l: 'Total Posted',  accent: false },
            { n: lost,           l: 'Lost Reports',  accent: 'red' },
            { n: found,          l: 'Found Reports', accent: 'green' },
            { n: myClaims.length,l: 'Claims Made',   accent: false },
          ].map((s, i) => (
            <div className="db-stat card" key={i}>
              <div className="db-stat__n"
                style={{ color: s.accent === 'red' ? '#f87171' : s.accent === 'green' ? '#34d399' : 'var(--amber)' }}>
                {s.n}
              </div>
              <div className="db-stat__l mono">{s.l}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="db-tabs fade-up delay-2">
          <button className={`db-tab${tab==='items'?'  active':''}`} onClick={() => setTab('items')}>
            <RiFileListLine /> My Items <span className="db-tab-count">{myItems.length}</span>
          </button>
          <button className={`db-tab${tab==='claims'?' active':''}`} onClick={() => setTab('claims')}>
            <RiShieldCheckLine /> My Claims <span className="db-tab-count">{myClaims.length}</span>
          </button>
        </div>

        {loading ? (
          <div className="page-loader"><div className="spinner" style={{width:32,height:32}} /></div>
        ) : tab === 'items' ? (
          myItems.length === 0 ? (
            <div className="empty">
              <h3>NO ITEMS YET</h3>
              <p>Report a lost or found item to get started</p>
              <div style={{display:'flex',gap:12,justifyContent:'center'}}>
                <Link to="/report-lost"  className="btn btn-sm btn-outline">Report Lost</Link>
                <Link to="/report-found" className="btn btn-sm btn-primary">Report Found</Link>
              </div>
            </div>
          ) : (
            <div className="grid-3" style={{marginTop:24}}>
              {myItems.map((item,i) => <ItemCard key={item.id} item={item} index={i} />)}
            </div>
          )
        ) : (
          myClaims.length === 0 ? (
            <div className="empty">
              <h3>NO CLAIMS YET</h3>
              <p>Browse items and claim one that belongs to you</p>
            </div>
          ) : (
            <div className="db-claims">
              {myClaims.map(c => (
                <div className="db-claim card" key={c.id}>
                  <div className="db-claim__left">
                    <Link to={`/items/${c.item?.id}`} className="db-claim__title">
                      {c.item?.title || 'Item #' + c.item?.id}
                    </Link>
                    <p className="db-claim__desc mono">{c.description}</p>
                    {c.createdAt && (
                      <span className="db-claim__date mono">
                        {format(new Date(c.createdAt), 'MMM d, yyyy')}
                      </span>
                    )}
                  </div>
                  <div className="db-claim__right">
                    <span className={`badge badge-${c.status?.toLowerCase()}`}>{c.status}</span>
                    {c.status === 'PENDING' && (
                      <button className="btn btn-ghost btn-sm" onClick={() => withdraw(c.id)}>
                        Withdraw
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
      <style>{`
        .db-head { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:32px; gap:16px; flex-wrap:wrap; }
        .db-eyebrow { font-size:11px; letter-spacing:0.12em; color:var(--amber); display:block; margin-bottom:8px; }
        .db-title { font-family:var(--font-display); font-size:52px; letter-spacing:2px; line-height:1; }
        .db-head__btns { display:flex; gap:8px; flex-shrink:0; }
        .db-stats { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; margin-bottom:28px; }
        .db-stat { padding:20px 24px; }
        .db-stat__n { font-family:var(--font-display); font-size:36px; letter-spacing:1px; line-height:1; margin-bottom:6px; }
        .db-stat__l { font-size:10px; letter-spacing:0.1em; text-transform:uppercase; color:var(--text-3); }
        .db-tabs { display:flex; gap:4px; margin-bottom:24px; border-bottom:1px solid var(--border-1); padding-bottom:0; }
        .db-tab {
          display:flex; align-items:center; gap:7px;
          padding:10px 18px 12px; background:none; border:none;
          font-family:var(--font-mono); font-size:12px; letter-spacing:0.06em;
          text-transform:uppercase; color:var(--text-3); cursor:pointer;
          border-bottom:2px solid transparent; transition:all 0.15s; margin-bottom:-1px;
        }
        .db-tab:hover { color:var(--text-1); }
        .db-tab.active { color:var(--amber); border-bottom-color:var(--amber); }
        .db-tab-count {
          background:var(--navy-3); border:1px solid var(--border-1);
          border-radius:3px; padding:1px 6px; font-size:10px;
        }
        .db-claims { display:flex; flex-direction:column; gap:10px; margin-top:24px; }
        .db-claim { display:flex; align-items:center; padding:16px 20px; gap:16px; justify-content:space-between; }
        .db-claim__left { flex:1; min-width:0; }
        .db-claim__title { font-family:var(--font-display); font-size:16px; letter-spacing:0.5px; color:var(--text-1); transition:color 0.15s; }
        .db-claim__title:hover { color:var(--amber); }
        .db-claim__desc { font-size:11px; color:var(--text-3); margin-top:4px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:500px; }
        .db-claim__date { font-size:10px; color:var(--text-4); display:block; margin-top:4px; letter-spacing:0.05em; }
        .db-claim__right { display:flex; align-items:center; gap:10px; flex-shrink:0; }
        @media (max-width:768px) { .db-stats{grid-template-columns:repeat(2,1fr);} .db-title{font-size:36px;} }
      `}</style>
    </div>
  )
}
