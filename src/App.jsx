import { useEffect, useRef, useState } from 'react'
import data from './data/firearms.json'

const { universal_rules, universal_storage, categories } = data

// ---------------------------------------------------------------------------
// BlueprintDiagram — generic schematic per category (action/frame outline +
// a labeled check point). Strokes animate in like a pen tracing the drawing.
// ---------------------------------------------------------------------------
function BlueprintDiagram({ category }) {
  const svgRef = useRef(null)

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return
    const paths = svg.querySelectorAll('.draw-on')
    paths.forEach((path, i) => {
      const length = path.getTotalLength ? path.getTotalLength() : 200
      path.style.strokeDasharray = length
      path.style.strokeDashoffset = length
      path.style.transition = `stroke-dashoffset 0.9s ease ${i * 0.15}s`
      requestAnimationFrame(() => {
        path.style.strokeDashoffset = 0
      })
    })
  }, [category.id])

  const gridLines = []
  for (let i = 0; i <= 8; i++) {
    gridLines.push(<line key={`h${i}`} x1="0" y1={i * 40} x2="360" y2={i * 40} stroke="#173e63" strokeWidth="1" />)
    gridLines.push(<line key={`v${i}`} x1={i * 45} y1="0" x2={i * 45} y2="320" stroke="#173e63" strokeWidth="1" />)
  }

  return (
    <svg ref={svgRef} viewBox="0 0 360 320" width="100%" style={{ background: '#071a30', display: 'block' }}>
      {gridLines}

      {/* Generic abstracted action/frame outline — not a literal render */}
      <path
        className="draw-on"
        d="M 70 190 L 260 190 L 260 160 L 300 160 L 300 190 L 300 210 L 70 210 Z"
        fill="none" stroke="#e8f4ff" strokeWidth="2"
      />
      {/* Open-action / check-point indicator */}
      <line
        className="draw-on"
        x1="260" y1="160" x2="260" y2="120"
        stroke="#ffb703" strokeWidth="1.5" strokeDasharray="6,4"
      />
      <text x="266" y="120" fill="#ffb703" fontFamily="IBM Plex Mono, monospace" fontSize="11">
        CHECK POINT
      </text>

      <text x="20" y="24" fill="#e8f4ff" fontFamily="IBM Plex Mono, monospace" fontSize="12" fontWeight="700">
        {category.title.toUpperCase()}
      </text>
      <text x="20" y="300" fill="#ffb703" fontFamily="IBM Plex Mono, monospace" fontSize="11">
        REF: {category.id} · SAFETY &amp; MAINTENANCE ONLY
      </text>
    </svg>
  )
}

// ---------------------------------------------------------------------------
// DetailCard — checklist, disassembly, cleaning, reassembly, storage
// ---------------------------------------------------------------------------
function DetailCard({ category, onBack }) {
  return (
    <div className="detail">
      <button className="back-btn" onClick={onBack}>&larr; Back to categories</button>

      <h2 style={{ margin: '6px 0 20px', fontSize: 24 }}>{category.title}</h2>

      <div className="detail-grid">
        <div>
          <div className="diagram-wrap">
            <BlueprintDiagram category={category} />
          </div>

          <div className="storage-box">
            <strong>Storage</strong>
            <div style={{ marginTop: 6 }}>{category.storage_notes}</div>
          </div>
        </div>

        <div>
          <div className="section-title">Safe handling checklist</div>
          <ol className="step-list">
            {category.safe_handling_checklist.map((s, i) => <li key={i}>{s}</li>)}
          </ol>

          <div className="section-title">Disassembly (for cleaning)</div>
          <ol className="step-list">
            {category.disassembly_steps.map((s, i) => <li key={i}>{s}</li>)}
          </ol>

          <div className="section-title">Cleaning</div>
          <ol className="step-list">
            {category.cleaning_steps.map((s, i) => <li key={i}>{s}</li>)}
          </ol>

          <div className="section-title">Reassembly &amp; function check</div>
          <ol className="step-list">
            {category.reassembly_and_function_check.map((s, i) => <li key={i}>{s}</li>)}
          </ol>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// App — always-visible universal rules banner, category grid, detail routing
// ---------------------------------------------------------------------------
export default function App() {
  const [selected, setSelected] = useState(null)

  return (
    <div className="app">
      <div className="header">
        <h1>SAFE HANDLING</h1>
        <p>FIREARM SAFETY &amp; MAINTENANCE GUIDE — {categories.length} CATEGORIES</p>
      </div>

      <div className="rules-banner">
        <p className="rules-banner-title">Universal safety rules — always in effect</p>
        <ol>
          {universal_rules.map((rule, i) => <li key={i}>{rule}</li>)}
        </ol>
        <div className="storage-note">{universal_storage}</div>
      </div>

      {selected ? (
        <DetailCard category={selected} onBack={() => setSelected(null)} />
      ) : (
        <div className="grid">
          {categories.map((c) => (
            <div className="card" key={c.id} onClick={() => setSelected(c)}>
              <span className="card-eyebrow">Firearm category</span>
              <h3>{c.title}</h3>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
