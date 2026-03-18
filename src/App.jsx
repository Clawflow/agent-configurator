import { useState } from 'react'
import './index.css'

// Mac Mini SVG illustration
const MacMiniIllustration = () => (
  <svg className="macmini-illustration" viewBox="0 0 280 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Shadow */}
    <ellipse cx="140" cy="185" rx="90" ry="10" fill="rgba(15,23,42,0.08)"/>
    {/* Mac Mini body */}
    <rect x="40" y="120" width="200" height="55" rx="10" fill="#E8E8E8"/>
    <rect x="40" y="120" width="200" height="55" rx="10" fill="url(#macGrad)"/>
    {/* Top surface */}
    <rect x="40" y="120" width="200" height="12" rx="6" fill="#F5F5F5"/>
    <rect x="40" y="125" width="200" height="4" fill="#EFEFEF"/>
    {/* Front face detail */}
    <rect x="48" y="138" width="80" height="28" rx="4" fill="#D8D8D8"/>
    <rect x="48" y="138" width="80" height="28" rx="4" fill="rgba(0,0,0,0.04)"/>
    {/* Power indicator */}
    <circle cx="220" cy="162" r="4" fill="#7C3AED" opacity="0.8"/>
    <circle cx="220" cy="162" r="6" fill="rgba(124,58,237,0.2)"/>
    {/* USB/ports */}
    <rect x="185" y="148" width="28" height="5" rx="2" fill="#C8C8C8"/>
    <rect x="185" y="157" width="28" height="5" rx="2" fill="#C8C8C8"/>
    {/* Logo */}
    <text x="88" y="156" textAnchor="middle" fill="#999" fontSize="11" fontFamily="system-ui" fontWeight="300">AI Kollegorna</text>
    {/* Screen floating above */}
    <rect x="55" y="20" width="170" height="95" rx="8" fill="#1E1E2E"/>
    <rect x="60" y="25" width="160" height="85" rx="5" fill="#0D1117"/>
    {/* Screen content - terminal lines */}
    <rect x="68" y="35" width="80" height="4" rx="2" fill="#7C3AED" opacity="0.8"/>
    <rect x="68" y="44" width="120" height="3" rx="1.5" fill="#10B981" opacity="0.7"/>
    <rect x="68" y="52" width="95" height="3" rx="1.5" fill="#3B82F6" opacity="0.6"/>
    <rect x="68" y="60" width="60" height="3" rx="1.5" fill="#F59E0B" opacity="0.6"/>
    <rect x="68" y="68" width="110" height="3" rx="1.5" fill="#fff" opacity="0.3"/>
    <rect x="68" y="76" width="75" height="3" rx="1.5" fill="#7C3AED" opacity="0.5"/>
    <rect x="68" y="84" width="45" height="3" rx="1.5" fill="#10B981" opacity="0.5"/>
    {/* Cursor blink */}
    <rect x="68" y="94" width="7" height="3" rx="1" fill="#fff" opacity="0.7"/>
    {/* Screen stand */}
    <rect x="132" y="115" width="16" height="8" rx="2" fill="#D8D8D8"/>
    <defs>
      <linearGradient id="macGrad" x1="40" y1="120" x2="40" y2="175" gradientUnits="userSpaceOnUse">
        <stop stopColor="#F0F0F0"/>
        <stop offset="1" stopColor="#D5D5D5"/>
      </linearGradient>
    </defs>
  </svg>
)

const AGENTS = [
  { id: 'sales', icon: '💼', name: 'Sälj & Leads', desc: 'Hittar leads, skickar uppföljningsmejl och hanterar pipeline' },
  { id: 'admin', icon: '📋', name: 'Administration', desc: 'Hanterar mejl, bokningar, dokument och kalender' },
  { id: 'marketing', icon: '📢', name: 'Marknadsföring', desc: 'Skriver content, hanterar sociala medier och nyhetsbrev' },
  { id: 'customer', icon: '💬', name: 'Kundtjänst', desc: 'Svarar kunder, skapar ärenden och följer upp' },
  { id: 'finance', icon: '💰', name: 'Ekonomi & Faktura', desc: 'Skickar offerter, fakturor och påminnelser' },
  { id: 'research', icon: '🔍', name: 'Research & Analys', desc: 'Analyserar konkurrenter, marknader och trender' },
  { id: 'hr', icon: '👥', name: 'HR & Rekrytering', desc: 'Hanterar ansökningar, onboarding och intern kommunikation' },
  { id: 'tech', icon: '⚙️', name: 'IT-support', desc: 'Felsöker problem, dokumenterar processer och automatiserar' },
]

const PURPOSES = [
  'Automatisera administration och back-office',
  'Driva mer försäljning och leads',
  'Förbättra kundupplevelsen',
  'Spara tid på repetitiva uppgifter',
  'Skala verksamheten utan att anställa',
  'Annat (beskriv nedan)',
]

const TOTAL_STEPS = 5

export default function App() {
  const [step, setStep] = useState(0) // 0 = welcome
  const [form, setForm] = useState({
    companyName: '',
    industry: '',
    companySize: '',
    agentName: '',
    purpose: '',
    purposeCustom: '',
    selectedAgents: [],
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    extraInfo: '',
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const progress = step === 0 ? 0 : (step / TOTAL_STEPS) * 100

  const update = (field, value) => setForm(f => ({ ...f, [field]: value }))

  const validate = (s) => {
    const e = {}
    if (s === 1) {
      if (!form.companyName.trim()) e.companyName = 'Obligatoriskt'
      if (!form.industry.trim()) e.industry = 'Obligatoriskt'
      if (!form.companySize) e.companySize = 'Välj ett alternativ'
    }
    if (s === 2) {
      if (!form.purpose) e.purpose = 'Välj ett syfte'
    }
    if (s === 3) {
      if (form.selectedAgents.length < 1) e.agents = 'Välj minst en agent'
      if (form.selectedAgents.length > 4) e.agents = 'Välj max 4 agenter'
    }
    if (s === 4) {
      if (!form.agentName.trim()) e.agentName = 'Ge agenten ett namn'
    }
    if (s === 5) {
      if (!form.contactName.trim()) e.contactName = 'Obligatoriskt'
      if (!form.contactEmail.trim() || !form.contactEmail.includes('@')) e.contactEmail = 'Ange en giltig e-post'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const next = () => {
    if (step === 0) { setStep(1); return }
    if (validate(step)) setStep(s => Math.min(s + 1, TOTAL_STEPS + 1))
  }

  const back = () => setStep(s => Math.max(s - 1, 1))

  const toggleAgent = (id) => {
    setForm(f => {
      const arr = f.selectedAgents
      if (arr.includes(id)) return { ...f, selectedAgents: arr.filter(a => a !== id) }
      if (arr.length >= 4) return f
      return { ...f, selectedAgents: [...arr, id] }
    })
  }

  const handleSubmit = async () => {
    if (!validate(5)) return
    setSubmitting(true)
    const agentNames = form.selectedAgents.map(id => AGENTS.find(a => a.id === id)?.name).join(', ')
    const body = `
NY AGENT-ANSÖKAN — AI Kollegorna

FÖRETAG
Namn: ${form.companyName}
Bransch: ${form.industry}
Storlek: ${form.companySize}

AGENTEN
Namn: ${form.agentName}
Primärt syfte: ${form.purpose}${form.purposeCustom ? ` — ${form.purposeCustom}` : ''}

VALDA SUB-AGENTER (${form.selectedAgents.length} st)
${agentNames}

KONTAKT
Namn: ${form.contactName}
E-post: ${form.contactEmail}
Telefon: ${form.contactPhone || '—'}

ÖVRIGT
${form.extraInfo || '—'}

---
Skickat via Agent Configurator på aikollegorna.se
    `.trim()

    try {
      const res = await fetch('https://formspree.io/f/mldnjqzk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.contactEmail,
          subject: `Ny agent-ansökan: ${form.companyName} — ${form.agentName}`,
          message: body,
          _replyto: form.contactEmail,
        })
      })
      if (res.ok) {
        setSubmitted(true)
        setStep(99)
      } else {
        setErrors({ submit: 'Något gick fel. Försök igen eller kontakta hej@aikollegorna.se' })
      }
    } catch {
      setErrors({ submit: 'Nätverksfel. Kontrollera din anslutning och försök igen.' })
    }
    setSubmitting(false)
  }

  return (
    <div className="app">
      <div className="progress-bar" style={{ width: `${progress}%` }} />

      <header className="header">
        <a href="https://aikollegorna.se" className="logo">
          AI <span>Kollegorna</span>
        </a>
        {step > 0 && step < 99 && (
          <span className="step-indicator">Steg {step} av {TOTAL_STEPS}</span>
        )}
      </header>

      <main className="main">
        {/* STEP 0 — Welcome */}
        {step === 0 && (
          <div className="card welcome-screen">
            <MacMiniIllustration />
            <div className="time-badge">⏱ Tar 3 minuter</div>
            <h1>Konfigurera din <em>egna AI-agent</em></h1>
            <p>
              Svara på några frågor om ditt företag, välj vilka agenter du vill ha
              och skicka in din ansökan. Anton återkopplar personligen om hur ni kan komma igång.
            </p>
            <button className="btn btn-primary btn-wide" onClick={next}>
              Börja konfigurera →
            </button>
          </div>
        )}

        {/* STEP 1 — Företaget */}
        {step === 1 && (
          <div className="card step-screen">
            <h2>Berätta om ditt företag</h2>
            <p className="subtitle">Vi skräddarsyr AI-agenten efter din verksamhet.</p>
            <div className="form-group">
              <label>Företagets namn <span className="required">*</span></label>
              <input type="text" value={form.companyName}
                onChange={e => update('companyName', e.target.value)}
                placeholder="t.ex. Andersson Fastigheter AB" />
              {errors.companyName && <p className="error-text">{errors.companyName}</p>}
            </div>
            <div className="form-group">
              <label>Bransch <span className="required">*</span></label>
              <input type="text" value={form.industry}
                onChange={e => update('industry', e.target.value)}
                placeholder="t.ex. Fastighet, Redovisning, E-handel, Konsult..." />
              {errors.industry && <p className="error-text">{errors.industry}</p>}
            </div>
            <div className="form-group">
              <label>Antal anställda <span className="required">*</span></label>
              <select value={form.companySize} onChange={e => update('companySize', e.target.value)}>
                <option value="">Välj storlek...</option>
                <option value="1-5">1–5 anställda (soloföretagare / startup)</option>
                <option value="6-20">6–20 anställda</option>
                <option value="21-50">21–50 anställda</option>
                <option value="51-200">51–200 anställda</option>
                <option value="200+">200+ anställda</option>
              </select>
              {errors.companySize && <p className="error-text">{errors.companySize}</p>}
            </div>
            <div className="btn-group">
              <div />
              <button className="btn btn-primary" onClick={next}>Nästa →</button>
            </div>
          </div>
        )}

        {/* STEP 2 — Syfte */}
        {step === 2 && (
          <div className="card step-screen">
            <h2>Vad ska agenten göra?</h2>
            <p className="subtitle">Välj det primära syftet. Du kan alltid lägga till mer senare.</p>
            <div className="form-group">
              {PURPOSES.map(p => (
                <label key={p} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px',
                  border: `1.5px solid ${form.purpose === p ? 'var(--blue)' : 'var(--border)'}`,
                  borderRadius: 10, marginBottom: 8, cursor: 'pointer',
                  background: form.purpose === p ? 'var(--blue-light)' : 'white', transition: 'all 0.15s' }}>
                  <input type="radio" name="purpose" value={p} checked={form.purpose === p}
                    onChange={() => update('purpose', p)} style={{ accentColor: 'var(--blue)', width: 16, height: 16 }} />
                  {p}
                </label>
              ))}
              {errors.purpose && <p className="error-text">{errors.purpose}</p>}
            </div>
            {form.purpose === 'Annat (beskriv nedan)' && (
              <div className="form-group">
                <textarea value={form.purposeCustom} onChange={e => update('purposeCustom', e.target.value)}
                  placeholder="Beskriv vad du vill att agenten ska hjälpa till med..." />
              </div>
            )}
            <div className="btn-group">
              <button className="btn btn-secondary" onClick={back}>← Tillbaka</button>
              <button className="btn btn-primary" onClick={next}>Nästa →</button>
            </div>
          </div>
        )}

        {/* STEP 3 — Sub-agenter */}
        {step === 3 && (
          <div className="card step-screen">
            <h2>Välj dina sub-agenter</h2>
            <p className="subtitle">Vilka specialistfunktioner ska din AI ha? Välj 1–4 stycken.</p>
            <p className="selection-hint">{form.selectedAgents.length}/4 valda</p>
            <div className="agent-grid">
              {AGENTS.map(a => {
                const sel = form.selectedAgents.includes(a.id)
                return (
                  <div key={a.id} className={`agent-card ${sel ? 'selected' : ''}`} onClick={() => toggleAgent(a.id)}>
                    {sel && <span className="agent-check" style={{ float: 'right' }}>✓</span>}
                    <span className="agent-card-icon">{a.icon}</span>
                    <div className="agent-card-name">{a.name}</div>
                    <div className="agent-card-desc">{a.desc}</div>
                  </div>
                )
              })}
            </div>
            {errors.agents && <p className="error-text" style={{ marginTop: 12 }}>{errors.agents}</p>}
            <div className="btn-group">
              <button className="btn btn-secondary" onClick={back}>← Tillbaka</button>
              <button className="btn btn-primary" onClick={next}>Nästa →</button>
            </div>
          </div>
        )}

        {/* STEP 4 — Agent identity */}
        {step === 4 && (
          <div className="card step-screen">
            <h2>Ge agenten en identitet</h2>
            <p className="subtitle">
              Varje AI-agent hos AI Kollegorna har ett eget namn och personlighet.
              Vad vill du kalla din?
            </p>
            <div className="form-group">
              <label>Agentens namn <span className="required">*</span></label>
              <input type="text" value={form.agentName}
                onChange={e => update('agentName', e.target.value)}
                placeholder="t.ex. Sara, Nova, Erik, Max..." />
              {errors.agentName && <p className="error-text">{errors.agentName}</p>}
              <p style={{ fontSize: '0.82rem', color: 'var(--muted)', marginTop: 6 }}>
                Det här är vad dina anställda och kunder kommer kalla den.
              </p>
            </div>
            <div className="form-group">
              <label>Något övrigt du vill berätta? <span style={{ color: 'var(--muted)' }}>(valfritt)</span></label>
              <textarea value={form.extraInfo} onChange={e => update('extraInfo', e.target.value)}
                placeholder="Speciella krav, befintliga system ni använder, processer ni vill automatisera..." />
            </div>
            <div className="btn-group">
              <button className="btn btn-secondary" onClick={back}>← Tillbaka</button>
              <button className="btn btn-primary" onClick={next}>Nästa →</button>
            </div>
          </div>
        )}

        {/* STEP 5 — Kontaktuppgifter + Sammanfattning */}
        {step === 5 && (
          <div className="card step-screen">
            <h2>Skicka in ansökan</h2>
            <p className="subtitle">Fyll i dina kontaktuppgifter så återkopplar Anton personligen.</p>

            <div className="summary-box">
              <h4>Din konfiguration</h4>
              <div className="summary-row">
                <span>Företag</span>
                <span>{form.companyName}</span>
              </div>
              <div className="summary-row">
                <span>Agentnamn</span>
                <span>{form.agentName}</span>
              </div>
              <div className="summary-row">
                <span>Primärt syfte</span>
                <span style={{ maxWidth: 250, textAlign: 'right', lineHeight: 1.3 }}>{form.purpose}</span>
              </div>
              <div className="summary-row">
                <span>Sub-agenter</span>
                <span>{form.selectedAgents.map(id => AGENTS.find(a => a.id === id)?.name).join(', ')}</span>
              </div>
            </div>

            <div className="two-col">
              <div className="form-group">
                <label>Ditt namn <span className="required">*</span></label>
                <input type="text" value={form.contactName}
                  onChange={e => update('contactName', e.target.value)} placeholder="Förnamn Efternamn" />
                {errors.contactName && <p className="error-text">{errors.contactName}</p>}
              </div>
              <div className="form-group">
                <label>Telefon</label>
                <input type="tel" value={form.contactPhone}
                  onChange={e => update('contactPhone', e.target.value)} placeholder="+46 70 123 45 67" />
              </div>
            </div>
            <div className="form-group">
              <label>E-postadress <span className="required">*</span></label>
              <input type="email" value={form.contactEmail}
                onChange={e => update('contactEmail', e.target.value)} placeholder="du@foretaget.se" />
              {errors.contactEmail && <p className="error-text">{errors.contactEmail}</p>}
            </div>

            {errors.submit && <p className="error-text">{errors.submit}</p>}

            <div className="btn-group">
              <button className="btn btn-secondary" onClick={back}>← Tillbaka</button>
              <button className="btn btn-primary" onClick={handleSubmit} disabled={submitting}>
                {submitting ? 'Skickar...' : 'Skicka ansökan →'}
              </button>
            </div>
          </div>
        )}

        {/* STEP 99 — Success */}
        {step === 99 && (
          <div className="card success-screen">
            <div className="success-icon">✓</div>
            <h2>Ansökan mottagen!</h2>
            <p>
              Tack, <strong>{form.contactName}</strong>. Anton har fått din ansökan
              om en AI-agent för <strong>{form.companyName}</strong> och återkopplar
              till dig inom 24 timmar.
            </p>

            <div className="what-happens">
              <h4>Vad händer nu?</h4>
              <ol>
                <li>Anton läser igenom din ansökan och bedömer möjligheten</li>
                <li>Du får en personlig återkoppling via e-post till {form.contactEmail}</li>
                <li>Om det passar kör vi ett 30-min intro-samtal utan kostnad</li>
                <li>Agenten {form.agentName} installeras och sätts i drift</li>
              </ol>
            </div>

            <a href="https://aikollegorna.se" className="btn btn-secondary">
              Tillbaka till aikollegorna.se
            </a>
          </div>
        )}
      </main>

      <p className="footer-note">
        AI Kollegorna AB · <a href="mailto:hej@aikollegorna.se">hej@aikollegorna.se</a> ·{' '}
        <a href="https://aikollegorna.se">aikollegorna.se</a>
      </p>
    </div>
  )
}
