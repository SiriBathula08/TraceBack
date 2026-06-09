import React, { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import itemService from '../services/itemService'
import ItemCard from '../components/ItemCard'
import { useAuth } from '../hooks/useAuth'
import { RiSearchLine, RiCloseLine, RiAddLine, RiArrowRightLine, RiFlashlightLine } from 'react-icons/ri'

const CATS = ['Electronics','Accessories','Clothing','Documents','Keys','Wallet / Purse','Bag / Luggage','Jewellery','Pet','Vehicle','Sports Equipment','Books','Other']

export default function Browse() {
  const { isAuthenticated } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const [items,   setItems]   = useState([])
  const [loading, setLoading] = useState(true)
  const [page,    setPage]    = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [total,   setTotal]   = useState(0)
  const [stats,   setStats]   = useState(null)
  const [query,   setQuery]   = useState('')
  const [type,    setType]    = useState(searchParams.get('type') || '')
  const [cat,     setCat]     = useState('')

  const fetchItems = async (pg = 0, append = false, t = type, c = cat, q = query) => {
    setLoading(true)
    try {
      let r = q.trim()
        ? await itemService.search(q, pg, 12)
        : await itemService.getItems({ type: t || undefined, category: c || undefined, page: pg, size: 12 })
      console.log('API response:', r)
      // Handle both Page object and plain array
      const content = Array.isArray(r) ? r : (r?.content || r?.items || [])
      const total   = r?.totalElements ?? r?.total ?? content.length
      const last    = r?.last ?? (content.length < 12)
      setItems(prev => append ? [...prev, ...content] : content)
      setHasMore(!last); setTotal(total); setPage(pg)
    } catch(err) {
      console.error('fetchItems error:', err)
    } finally { setLoading(false) }
  }

  useEffect(() => { fetchItems(0, false, type, cat, query) }, [type, cat])
  useEffect(() => { itemService.getStats().then(setStats).catch(() => {}) }, [])
  useEffect(() => {
    const t = searchParams.get('type') || ''
    if (t !== type) {
      setType(t)
      fetchItems(0, false, t)
    }
  }, [searchParams])

  const setTypeFilter = (t) => { setType(t); setSearchParams(t ? { type: t } : {}) }
  const handleSearch  = (e) => { e.preventDefault(); fetchItems(0) }

  return (
    <div className="browse">
      {/* ── Hero ── */}
      <div className="browse__hero">
        <div className="orb orb-indigo" style={{width:600,height:600,top:-200,left:-100}} />
        <div className="orb orb-purple" style={{width:400,height:400,top:-100,right:0}} />

        <div className="container browse__hero-body">
          <div className="browse__hero-badge fade-up">
            <RiFlashlightLine style={{color:'var(--gold)'}} />
            <span>AI-Powered Matching Platform</span>
          </div>

          <h1 className="browse__hero-title fade-up delay-1">
            {type === 'LOST'
              ? <><span className="grad-text">Lost</span> Items</>
              : type === 'FOUND'
              ? <><span className="grad-text">Found</span> Items</>
              : <>Recover<br /><span className="grad-text">What's Lost</span></>
            }
          </h1>

          <p className="browse__hero-sub fade-up delay-2">
            {type === 'LOST'
              ? 'Browse lost item reports. Claim yours and get it back.'
              : type === 'FOUND'
              ? 'Someone found these. Submit a claim if one is yours.'
              : 'Smart matching connects lost items with their rightful owners using AI.'}
          </p>

          {/* Search */}
          <form className="browse__search fade-up delay-3" onSubmit={handleSearch}>
            <RiSearchLine className="browse__search-ico" />
            <input
              className="browse__search-inp"
              placeholder="Search by item name, brand, location..."
              value={query} onChange={e => setQuery(e.target.value)}
            />
            {query && (
              <button type="button" className="browse__search-clr"
                onClick={() => { setQuery(''); fetchItems(0) }}>
                <RiCloseLine />
              </button>
            )}
            <button type="submit" className="btn btn-primary" style={{margin:5,borderRadius:'var(--r-sm)'}}>
              Search
            </button>
          </form>

          {/* Stats pills */}
          {stats && (
            <div className="browse__stats fade-up delay-4">
              <div className="browse__stat-pill">
                <span style={{color:'var(--red-soft)',fontWeight:700}}>{stats.totalLost ?? 0}</span>
                Lost reports
              </div>
              <div className="browse__stat-div" />
              <div className="browse__stat-pill">
                <span style={{color:'var(--green-soft)',fontWeight:700}}>{stats.totalFound ?? 0}</span>
                Found reports
              </div>
              <div className="browse__stat-div" />
              <div className="browse__stat-pill">
                <span style={{color:'var(--indigo-light)',fontWeight:700}}>{stats.total ?? 0}</span>
                Total items
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Filters + Grid ── */}
      <div className="container browse__body">
        {/* Filter row */}
        <div className="browse__filters fade-up">
          <div className="browse__type-tabs">
            {[['', 'All'], ['LOST', 'Lost'], ['FOUND', 'Found']].map(([val, lbl]) => (
              <button key={val}
                className={`browse__type-tab${type === val ? ' active' : ''} ${val.toLowerCase()}`}
                onClick={() => setTypeFilter(val)}>
                {val === 'LOST' ? <span style={{color:'var(--red-soft)'}}>● </span>
                  : val === 'FOUND' ? <span style={{color:'var(--green-soft)'}}>● </span> : null}
                {lbl}
              </button>
            ))}
          </div>

          <div className="browse__cats">
            <button className={`browse__cat${!cat ? ' active' : ''}`} onClick={() => setCat('')}>All</button>
            {CATS.map(c => (
              <button key={c} className={`browse__cat${cat===c ? ' active' : ''}`}
                onClick={() => setCat(c === cat ? '' : c)}>
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Results bar */}
        <div className="browse__bar">
          <div className="browse__count">
            {loading ? '...' : <><strong style={{color:'var(--text-1)'}}>{total}</strong> {total === 1 ? 'result' : 'results'}{query && <> for "<em>{query}</em>"</>}</>}
          </div>
          {isAuthenticated && (
            <div style={{display:'flex',gap:8}}>
              <Link to="/report-lost"  className="btn btn-sm btn-outline" style={{borderColor:'rgba(244,63,94,0.25)',color:'var(--red-soft)'}}>
                <RiAddLine /> Lost
              </Link>
              <Link to="/report-found" className="btn btn-sm btn-primary">
                <RiAddLine /> Found
              </Link>
            </div>
          )}
        </div>

        {/* Grid */}
        {loading && items.length === 0 ? (
          <div className="browse__skeleton">
            {Array.from({length:12}).map((_,i) => <div key={i} className="browse__skel" />)}
          </div>
        ) : items.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">🔍</div>
            <h3>Nothing found</h3>
            <p>{query ? 'Try different search terms or clear filters' : 'Be the first to report one!'}</p>
            {isAuthenticated && (
              <div style={{display:'flex',gap:12,justifyContent:'center'}}>
                <Link to="/report-lost"  className="btn btn-sm btn-outline">Report Lost</Link>
                <Link to="/report-found" className="btn btn-sm btn-primary">Report Found</Link>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="grid-4">
              {items.map((item,i) => <ItemCard key={item.id} item={item} index={i} />)}
            </div>
            {hasMore && (
              <div style={{display:'flex',justifyContent:'center',marginTop:56}}>
                <button className="btn btn-outline btn-lg" disabled={loading}
                  onClick={() => fetchItems(page+1, true)}>
                  {loading ? <><span className="spinner"/>Loading...</> : 'Load more items'}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <style>{`
        .browse { position: relative; }
        .browse__hero {
          position: relative; overflow: hidden; padding: 100px 0 72px;
          border-bottom: 1px solid var(--border-1);
        }
        .browse__hero-body { position: relative; z-index: 1; max-width: 680px; }
        .browse__hero-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: var(--gold-glow2); border: 1px solid rgba(245,158,11,0.2);
          border-radius: 99px; padding: 6px 14px 6px 10px;
          font-size: 12px; font-weight: 600; color: var(--gold-light);
          margin-bottom: 28px; font-family: var(--font-mono);
          letter-spacing: 0.03em;
        }
        .browse__hero-title {
          font-family: var(--font-display); font-size: clamp(52px, 7vw, 96px);
          font-weight: 700; line-height: 1; letter-spacing: -0.04em;
          color: var(--text-1); margin-bottom: 20px;
        }
        .browse__hero-sub {
          font-size: 17px; color: var(--text-2); line-height: 1.7;
          max-width: 460px; margin-bottom: 36px; font-weight: 400;
        }
        .browse__search {
          display: flex; align-items: center;
          background: var(--surface-2); border: 1px solid var(--border-2);
          border-radius: var(--r-md); max-width: 580px;
          transition: all 0.25s; box-shadow: 0 4px 24px rgba(0,0,0,0.3);
        }
        .browse__search:focus-within {
          border-color: var(--indigo); box-shadow: var(--shadow-indigo);
        }
        .browse__search-ico { margin-left: 18px; font-size: 18px; color: var(--text-3); flex-shrink: 0; }
        .browse__search-inp {
          flex: 1; padding: 14px 12px; background: none; border: none;
          outline: none; color: var(--text-1); font-size: 15px; font-family: var(--font-body);
        }
        .browse__search-inp::placeholder { color: var(--text-4); }
        .browse__search-clr {
          background: none; border: none; color: var(--text-3); font-size: 18px;
          cursor: pointer; padding: 0 8px; display: flex; transition: color 0.15s;
        }
        .browse__search-clr:hover { color: var(--text-1); }
        .browse__stats {
          display: flex; align-items: center; gap: 16px; margin-top: 32px;
        }
        .browse__stat-pill {
          display: flex; align-items: center; gap: 8px;
          font-size: 13px; color: var(--text-3); font-family: var(--font-mono);
        }
        .browse__stat-div { width: 1px; height: 20px; background: var(--border-1); }
        .browse__body { padding-top: 40px; }
        .browse__filters {
          display: flex; flex-direction: column; gap: 16px; margin-bottom: 28px;
        }
        .browse__type-tabs { display: flex; gap: 6px; }
        .browse__type-tab {
          padding: 8px 20px; border-radius: var(--r-sm);
          font-size: 13px; font-weight: 600; border: 1px solid var(--border-1);
          background: none; color: var(--text-3); cursor: pointer; transition: all 0.2s;
        }
        .browse__type-tab:hover { border-color: var(--border-2); color: var(--text-1); background: var(--surface-3); }
        .browse__type-tab.active { background: var(--surface-3); color: var(--text-1); border-color: var(--border-2); }
        .browse__type-tab.lost.active  { border-color: rgba(244,63,94,0.4); background: var(--red-glow); }
        .browse__type-tab.found.active { border-color: rgba(16,185,129,0.4); background: var(--green-glow); }
        .browse__cats { display: flex; gap: 6px; flex-wrap: wrap; }
        .browse__cat {
          padding: 5px 14px; border-radius: 99px; font-size: 12px; font-weight: 500;
          border: 1px solid var(--border-1); background: none; color: var(--text-3);
          cursor: pointer; transition: all 0.15s; font-family: var(--font-mono);
          letter-spacing: 0.02em;
        }
        .browse__cat:hover { color: var(--text-1); border-color: var(--border-2); background: var(--surface-3); }
        .browse__cat.active { background: var(--indigo); color: white; border-color: var(--indigo); box-shadow: 0 2px 12px rgba(99,102,241,0.3); }
        .browse__bar {
          display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;
        }
        .browse__count { font-size: 13px; color: var(--text-3); font-family: var(--font-mono); }
        .browse__skeleton { display: grid; grid-template-columns: repeat(4,1fr); gap: 20px; }
        .browse__skel {
          height: 320px; border-radius: var(--r-lg);
          background: linear-gradient(90deg, var(--surface-1) 25%, var(--surface-2) 50%, var(--surface-1) 75%);
          background-size: 200% 100%; animation: shimmer 1.6s infinite;
        }
        @media(max-width:768px) { .browse__skeleton{grid-template-columns:repeat(2,1fr)} .browse__hero-title{font-size:48px} }
      `}</style>
    </div>
  )
}
