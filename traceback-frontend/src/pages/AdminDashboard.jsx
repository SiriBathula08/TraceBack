import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../utils/api'
import itemService from '../services/itemService'
import claimService from '../services/claimService'
import toast from 'react-hot-toast'
import { RiSearchLine, RiUserLine, RiFileListLine, RiShieldCheckLine, RiBarChartLine } from 'react-icons/ri'
import { format } from 'date-fns'

export default function AdminDashboard() {
  const [tab,    setTab]    = useState('overview')
  const [stats,  setStats]  = useState(null)
  const [users,  setUsers]  = useState([])
  const [items,  setItems]  = useState([])
  const [claims, setClaims] = useState([])
  const [loading,setLoading]= useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    api.get('/admin/stats').then(r => setStats(r.data.data)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (tab === 'users' && !users.length)
      api.get('/admin/users?page=0&size=50').then(r => setUsers(r.data.data?.content || [])).catch(() => {})
    if (tab === 'items' && !items.length)
      itemService.adminItems({ page:0, size:50 }).then(r => setItems(r.content||[])).catch(() => {})
    if (tab === 'claims' && !claims.length)
      claimService.adminGetAll({ page:0, size:50 }).then(r => setClaims(r.content||[])).catch(() => {})
  }, [tab])

  const toggleUser = async (id, active) => {
    try { await api.patch(`/admin/users/${id}/toggle`); setUsers(p => p.map(u => u.id===id?{...u,active:!u.active}:u)); toast.success('Done') }
    catch { toast.error('Failed') }
  }
  const changeRole = async (id, role) => {
    try { await api.patch(`/admin/users/${id}/role?role=${role}`); setUsers(p => p.map(u => u.id===id?{...u,role}:u)); toast.success('Role updated') }
    catch { toast.error('Failed') }
  }
  const updateStatus = async (id, status) => {
    try { await itemService.adminStatus(id, status); setItems(p => p.map(i => i.id===id?{...i,status}:i)); toast.success('Updated') }
    catch { toast.error('Failed') }
  }

  const filter = (arr, keys) => search.trim()
    ? arr.filter(it => keys.some(k => String(it[k]||'').toLowerCase().includes(search.toLowerCase())))
    : arr

  const TABS = [
    { k:'overview', l:'Overview',  ic:<RiBarChartLine/> },
    { k:'users',    l:'Users',     ic:<RiUserLine/> },
    { k:'items',    l:'Items',     ic:<RiFileListLine/> },
    { k:'claims',   l:'Claims',    ic:<RiShieldCheckLine/> },
  ]

  if (loading) return <div className="page-loader" style={{minHeight:'60vh'}}><div className="spinner" style={{width:36,height:36}}/></div>

  return (
    <div className="page-wrap">
      <div className="container">
        <div className="adm-head fade-up">
          <div>
            <span className="badge badge-admin" style={{marginBottom:10,display:'inline-flex'}}>⬡ ADMIN PANEL</span>
            <h1 className="adm-title">CONTROL<br/>CENTER</h1>
          </div>
          {stats && (
            <div className="adm-header-stats">
              <div className="adm-hstat"><span className="mono">{stats.totalUsers}</span><small>Users</small></div>
              <div className="adm-hstat"><span className="mono" style={{color:'#f87171'}}>{stats.totalLostItems}</span><small>Lost</small></div>
              <div className="adm-hstat"><span className="mono" style={{color:'#34d399'}}>{stats.totalFoundItems}</span><small>Found</small></div>
              <div className="adm-hstat"><span className="mono" style={{color:'var(--amber)'}}>{stats.pendingClaims}</span><small>Pending</small></div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="adm-tabs fade-up">
          {TABS.map(t => (
            <button key={t.k} className={`adm-tab${tab===t.k?' active':''}`} onClick={() => {setTab(t.k);setSearch('')}}>
              {t.ic} {t.l}
            </button>
          ))}
        </div>

        {tab !== 'overview' && (
          <div className="adm-search fade-up">
            <RiSearchLine className="adm-search-icon"/>
            <input className="form-input adm-search-input" placeholder={`Search ${tab}...`} value={search} onChange={e=>setSearch(e.target.value)} />
          </div>
        )}

        {tab === 'overview' && (
          <div className="adm-overview fade-up">
            <div className="adm-stats">
              {stats && [
                {l:'Total Users',v:stats.totalUsers,c:'var(--amber)'},
                {l:'Active Users',v:stats.activeUsers,c:'#34d399'},
                {l:'Lost Items',v:stats.totalLostItems,c:'#f87171'},
                {l:'Found Items',v:stats.totalFoundItems,c:'#34d399'},
                {l:'Pending Claims',v:stats.pendingClaims,c:'var(--amber)'},
                {l:'Total Items',v:stats.totalItems,c:'var(--text-2)'},
              ].map((s,i) => (
                <div className="adm-stat card" key={i}>
                  <div className="adm-stat__n" style={{color:s.c}}>{s.v}</div>
                  <div className="adm-stat__l mono">{s.l}</div>
                </div>
              ))}
            </div>
            <div className="adm-setup card">
              <p className="mono" style={{fontSize:10,color:'var(--amber)',letterSpacing:'0.1em',marginBottom:12}}>// H2 CONSOLE ADMIN SEED</p>
              <p style={{fontSize:13,color:'var(--text-3)',marginBottom:10}}>Open <code>http://localhost:8080/h2-console</code></p>
              <pre>{`INSERT INTO USERS (username,email,password,full_name,role,is_active)
VALUES ('admin','admin@lostfound.com',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.ucrm3a13e',
  'System Admin','ADMIN',true);`}</pre>
              <p style={{fontSize:12,color:'var(--text-4)',marginTop:8}}>Password hash = BCrypt of <code>Admin1234</code></p>
            </div>
          </div>
        )}

        {tab === 'users' && (
          <div className="adm-table-wrap fade-up">
            <table className="adm-table">
              <thead><tr><th>ID</th><th>User</th><th>Email</th><th>Role</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                {filter(users,['username','email','fullName']).map(u => (
                  <tr key={u.id}>
                    <td className="adm-id">#{u.id}</td>
                    <td>
                      <div className="adm-user-cell">
                        <div className="adm-av">{u.username?.[0]?.toUpperCase()}</div>
                        <div><strong>{u.fullName||u.username}</strong><span className="mono">@{u.username}</span></div>
                      </div>
                    </td>
                    <td className="adm-muted mono">{u.email}</td>
                    <td>
                      <select className="adm-sel" value={u.role} onChange={e=>changeRole(u.id,e.target.value)}>
                        <option value="USER">USER</option>
                        <option value="MODERATOR">MODERATOR</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </td>
                    <td><span className={`badge badge-${u.active?'found':'lost'}`}>{u.active?'Active':'Inactive'}</span></td>
                    <td>
                      <button className={`btn btn-sm ${u.active?'btn-danger':'btn-outline'}`} onClick={() => toggleUser(u.id,u.active)}>
                        {u.active?'Deactivate':'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'items' && (
          <div className="adm-table-wrap fade-up">
            <table className="adm-table">
              <thead><tr><th>ID</th><th>Title</th><th>Type</th><th>Category</th><th>Status</th><th>Posted By</th><th></th></tr></thead>
              <tbody>
                {filter(items,['title','category','type']).map(item => (
                  <tr key={item.id}>
                    <td className="adm-id">#{item.id}</td>
                    <td><Link to={`/items/${item.id}`} className="adm-link">{item.title}</Link></td>
                    <td><span className={`badge badge-${item.type?.toLowerCase()}`}>{item.type}</span></td>
                    <td className="adm-muted">{item.category}</td>
                    <td>
                      <select className="adm-sel" value={item.status} onChange={e=>updateStatus(item.id,e.target.value)}>
                        {['ACTIVE','CLAIMED','RESOLVED','EXPIRED','ARCHIVED'].map(s=><option key={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="adm-muted mono">{item.postedBy?.username||'—'}</td>
                    <td><Link to={`/items/${item.id}`} className="btn btn-ghost btn-sm">View</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'claims' && (
          <div className="adm-table-wrap fade-up">
            <table className="adm-table">
              <thead><tr><th>ID</th><th>Item</th><th>Claimant</th><th>Status</th><th>Match</th><th>Date</th></tr></thead>
              <tbody>
                {filter(claims,['status']).map(c => (
                  <tr key={c.id}>
                    <td className="adm-id">#{c.id}</td>
                    <td><Link to={`/items/${c.item?.id}`} className="adm-link">{c.item?.title||'Item #'+c.item?.id}</Link></td>
                    <td className="adm-muted">{c.claimant?.fullName||c.claimant?.username||'—'}</td>
                    <td><span className={`badge badge-${c.status?.toLowerCase()}`}>{c.status}</span></td>
                    <td className="mono" style={{color:'var(--amber)'}}>{Math.round((c.matchScore||0)*100)}%</td>
                    <td className="adm-muted mono">{c.createdAt?format(new Date(c.createdAt),'MMM d, yyyy'):'—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <style>{`
        .adm-head{display:flex;justify-content:space-between;align-items:flex-start;gap:24px;margin-bottom:28px;flex-wrap:wrap}
        .adm-title{font-family:var(--font-display);font-size:64px;letter-spacing:2px;line-height:0.9}
        .adm-header-stats{display:flex;gap:20px;flex-shrink:0;align-items:center;margin-top:8px}
        .adm-hstat{display:flex;flex-direction:column;align-items:center;gap:2px}
        .adm-hstat span{font-family:var(--font-display);font-size:28px;letter-spacing:1px}
        .adm-hstat small{font-size:10px;color:var(--text-4);text-transform:uppercase;letter-spacing:0.08em;font-family:var(--font-mono)}
        .adm-tabs{display:flex;gap:4px;margin-bottom:20px;flex-wrap:wrap}
        .adm-tab{display:flex;align-items:center;gap:7px;padding:9px 18px;background:none;border:1px solid var(--border-1);border-radius:var(--r-sm);font-family:var(--font-mono);font-size:12px;letter-spacing:0.06em;text-transform:uppercase;color:var(--text-3);cursor:pointer;transition:all 0.15s}
        .adm-tab:hover{color:var(--text-1);border-color:var(--border-2)}
        .adm-tab.active{color:var(--amber);border-color:var(--amber);background:var(--amber-glow2)}
        .adm-search{position:relative;margin-bottom:18px}
        .adm-search-icon{position:absolute;left:12px;top:50%;transform:translateY(-50%);color:var(--text-3);font-size:16px;pointer-events:none}
        .adm-search-input{padding-left:38px}
        .adm-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:24px}
        .adm-stat{padding:20px 24px}
        .adm-stat__n{font-family:var(--font-display);font-size:36px;letter-spacing:1px;line-height:1;margin-bottom:6px}
        .adm-stat__l{font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:var(--text-3)}
        .adm-setup{padding:24px}
        .adm-setup pre{background:var(--navy-3);border:1px solid var(--border-1);border-radius:var(--r-sm);padding:14px;font-size:11px;color:var(--amber);font-family:var(--font-mono);overflow-x:auto;line-height:1.7;white-space:pre-wrap}
        .adm-setup code{background:var(--navy-3);padding:1px 6px;border-radius:3px;font-family:var(--font-mono);font-size:12px;color:'#60a5fa'}
        .adm-table-wrap{background:var(--navy-2);border:1px solid var(--border-1);border-radius:var(--r-lg);overflow:hidden}
        .adm-table{width:100%;border-collapse:collapse}
        .adm-table th{padding:11px 16px;text-align:left;font-size:9px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:var(--text-3);border-bottom:1px solid var(--border-1);background:var(--navy-3);font-family:var(--font-mono)}
        .adm-table td{padding:11px 16px;font-size:13px;border-bottom:1px solid var(--border-1);vertical-align:middle}
        .adm-table tr:last-child td{border-bottom:none}
        .adm-table tr:hover td{background:var(--navy-3)}
        .adm-id{color:var(--text-3);font-size:11px;font-family:var(--font-mono)}
        .adm-muted{color:var(--text-3);font-size:12px}
        .adm-link{color:var(--text-1);font-weight:500;transition:color 0.15s}
        .adm-link:hover{color:var(--amber)}
        .adm-user-cell{display:flex;align-items:center;gap:10px}
        .adm-av{width:30px;height:30px;border-radius:50%;background:var(--amber);color:var(--navy);display:flex;align-items:center;justify-content:center;font-family:var(--font-display);font-size:15px;font-weight:700;letter-spacing:1px;flex-shrink:0}
        .adm-user-cell strong{font-size:13px;font-weight:600;display:block}
        .adm-user-cell span{font-size:10px;color:var(--text-3);display:block}
        .adm-sel{background:var(--navy-3);border:1px solid var(--border-1);color:var(--text-1);padding:4px 8px;border-radius:3px;font-size:11px;font-family:var(--font-mono);outline:none;cursor:pointer}
        .adm-sel:focus{border-color:var(--amber)}
        @media(max-width:1024px){.adm-stats{grid-template-columns:repeat(2,1fr)}}
        @media(max-width:640px){.adm-title{font-size:42px}.adm-table-wrap{overflow-x:auto}}
      `}</style>
    </div>
  )
}
