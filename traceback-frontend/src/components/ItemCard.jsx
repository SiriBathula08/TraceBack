import React from 'react'
import { Link } from 'react-router-dom'
import { RiMapPin2Line, RiCalendarLine, RiCoinLine, RiArrowRightLine } from 'react-icons/ri'
import { format } from 'date-fns'

export default function ItemCard({ item, index = 0 }) {
  const isLost  = item.type === 'LOST'
  const imgUrl  = item.imageUrls ? `/api/uploads/${item.imageUrls.split(',')[0]}` : null
  const dateStr = item.dateOccurred ? format(new Date(item.dateOccurred), 'MMM d, yyyy') : null
  const accentColor = isLost ? 'var(--red-soft)' : 'var(--green-soft)'
  const accentGlow  = isLost ? 'rgba(244,63,94,0.12)' : 'rgba(16,185,129,0.12)'

  return (
    <Link to={`/items/${item.id}`} className="icard" style={{ animationDelay: `${index * 0.05}s` }}>
      {/* Image */}
      <div className="icard__media">
        {imgUrl
          ? <img src={imgUrl} alt={item.title} className="icard__img" />
          : (
            <div className="icard__placeholder">
              <span className="icard__placeholder-letter">{item.category?.[0] ?? '?'}</span>
              <div className="icard__placeholder-glow" style={{ background: accentGlow }} />
            </div>
          )
        }
        <div className="icard__media-overlay" />
        <div className="icard__type-pill" style={{ background: accentGlow, borderColor: `${accentColor}33`, color: accentColor }}>
          <span className="icard__type-dot" style={{ background: accentColor }} />
          {isLost ? 'Lost' : 'Found'}
        </div>
        {item.status !== 'ACTIVE' && (
          <div className="icard__status-pill">{item.status}</div>
        )}
        {item.rewardAmount > 0 && (
          <div className="icard__reward-pill">
            <RiCoinLine /> ₹{item.rewardAmount}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="icard__body">
        <div className="icard__cat">{item.category}</div>
        <h3 className="icard__title">{item.title}</h3>
        {item.description && <p className="icard__desc">{item.description}</p>}

        <div className="icard__meta">
          {item.locationName && (
            <span className="icard__meta-item">
              <RiMapPin2Line /> {item.locationName}
            </span>
          )}
          {dateStr && (
            <span className="icard__meta-item">
              <RiCalendarLine /> {dateStr}
            </span>
          )}
        </div>

        <div className="icard__footer">
          <div className="icard__tags">
            {item.color && <span className="tag">{item.color}</span>}
            {item.brand && <span className="tag">{item.brand}</span>}
          </div>
          <div className="icard__arrow"><RiArrowRightLine /></div>
        </div>
      </div>

      <style>{`
        .icard {
          display: flex; flex-direction: column;
          background: var(--surface-1); border: 1px solid var(--border-1);
          border-radius: var(--r-lg); overflow: hidden; cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          animation: fadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .icard:hover {
          border-color: var(--border-accent);
          box-shadow: var(--shadow-md), 0 0 0 1px rgba(99,102,241,0.15);
          transform: translateY(-4px);
        }
        .icard__media {
          position: relative; height: 200px; overflow: hidden;
          background: var(--surface-3); flex-shrink: 0;
        }
        .icard__img {
          width: 100%; height: 100%; object-fit: cover;
          transition: transform 0.6s ease;
        }
        .icard:hover .icard__img { transform: scale(1.07); }
        .icard__placeholder {
          width: 100%; height: 100%;
          display: flex; align-items: center; justify-content: center;
          position: relative; overflow: hidden;
        }
        .icard__placeholder-letter {
          font-family: var(--font-display); font-size: 64px; font-weight: 700;
          color: var(--border-2); z-index: 1; letter-spacing: -2px;
        }
        .icard__placeholder-glow {
          position: absolute; width: 120px; height: 120px;
          border-radius: 50%; filter: blur(40px);
        }
        .icard__media-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(13,13,24,0.8) 0%, transparent 50%);
        }
        .icard__type-pill {
          position: absolute; top: 12px; left: 12px;
          display: flex; align-items: center; gap: 5px;
          padding: 4px 10px; border-radius: 99px;
          font-size: 11px; font-weight: 700; letter-spacing: 0.04em;
          border: 1px solid; backdrop-filter: blur(8px);
          font-family: var(--font-mono);
        }
        .icard__type-dot {
          width: 5px; height: 5px; border-radius: 50%; animation: pulse 2s ease infinite;
        }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        .icard__status-pill {
          position: absolute; top: 12px; right: 12px;
          background: rgba(0,0,0,0.7); color: var(--text-3);
          font-size: 9px; font-weight: 700; letter-spacing: 0.1em;
          text-transform: uppercase; padding: 3px 8px;
          border-radius: 99px; font-family: var(--font-mono);
          backdrop-filter: blur(8px);
        }
        .icard__reward-pill {
          position: absolute; bottom: 12px; right: 12px;
          background: var(--gold-glow2); color: var(--gold-light);
          border: 1px solid rgba(245,158,11,0.25);
          font-size: 11px; font-weight: 700; padding: 3px 8px;
          border-radius: 99px; display: flex; align-items: center; gap: 4px;
          font-family: var(--font-mono); backdrop-filter: blur(8px);
        }
        .icard__body {
          padding: 18px 20px; display: flex; flex-direction: column; gap: 8px; flex: 1;
        }
        .icard__cat {
          font-size: 10px; font-weight: 700; letter-spacing: 0.1em;
          text-transform: uppercase; color: var(--text-4);
          font-family: var(--font-mono);
        }
        .icard__title {
          font-family: var(--font-display); font-size: 17px; font-weight: 600;
          color: var(--text-1); line-height: 1.3; letter-spacing: -0.02em;
          display: -webkit-box; -webkit-line-clamp: 2;
          -webkit-box-orient: vertical; overflow: hidden;
        }
        .icard__desc {
          font-size: 12px; color: var(--text-3); line-height: 1.6;
          display: -webkit-box; -webkit-line-clamp: 2;
          -webkit-box-orient: vertical; overflow: hidden;
        }
        .icard__meta { display: flex; flex-direction: column; gap: 4px; }
        .icard__meta-item {
          display: flex; align-items: center; gap: 5px;
          font-size: 11px; color: var(--text-4); font-family: var(--font-mono);
        }
        .icard__meta-item svg { flex-shrink: 0; font-size: 12px; color: var(--text-3); }
        .icard__footer {
          display: flex; align-items: center; justify-content: space-between;
          margin-top: auto; padding-top: 4px;
        }
        .icard__tags { display: flex; gap: 5px; flex-wrap: wrap; }
        .icard__arrow {
          width: 28px; height: 28px; border-radius: 50%;
          background: var(--surface-3); border: 1px solid var(--border-1);
          display: flex; align-items: center; justify-content: center;
          font-size: 14px; color: var(--text-3); flex-shrink: 0;
          transition: all 0.2s;
        }
        .icard:hover .icard__arrow {
          background: var(--indigo-glow); border-color: var(--border-accent);
          color: var(--indigo-light);
        }
      `}</style>
    </Link>
  )
}
