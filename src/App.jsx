import { useState, useEffect, useRef } from 'react'
import { useFormPersistence } from './useFormPersistence'
import IndustryBadges from './IndustryBadges'
import './index.css'

// ─── Constants ──────────────────────────────────────────────

const INDUSTRIES = [
  'Fastighet & Mäkleri', 'Redovisning & Bokföring', 'Juridik & Advokat',
  'E-handel & Retail', 'Konsultverksamhet', 'IT & Tech', 'Bygg & Entreprenad',
  'Restaurang & Hotell', 'Hälsa & Sjukvård', 'Utbildning & Skola',
  'Finans & Bank', 'Försäkring', 'Marknadsföring & Reklam', 'Transport & Logistik',
  'Bemanning & Rekrytering', 'Tillverkning & Industri', 'Media & Underhållning',
  'Ideell organisation / NGO', 'Offentlig sektor', 'Energi & Miljö',
  'Jordbruk & Lantbruk', 'Skönhet & Frisör', 'Annat',
]

const AGENTS = [
  { id: 'sales', icon: '💼', name: 'Sälj & Leads', desc: 'Hittar leads, skickar uppföljningsmejl och hanterar pipeline', popular: true, tooltip: 'Automatisera prospektering, uppföljning och CRM-uppdatering. Integrerar med HubSpot, Salesforce m.fl.' },
  { id: 'admin', icon: '📋', name: 'Administration', desc: 'Hanterar mejl, bokningar, dokument och kalender', popular: true, tooltip: 'Sorterar inkommande mejl, bokar möten, organiserar dokument och synkroniserar kalendrar automatiskt.' },
  { id: 'marketing', icon: '📢', name: 'Marknadsföring', desc: 'Skriver content, hanterar sociala medier och nyhetsbrev', popular: false, tooltip: 'Genererar inlägg för sociala medier, skriver nyhetsbrev, A/B-testar rubriker och analyserar engagemang.' },
  { id: 'customer', icon: '💬', name: 'Kundtjänst', desc: 'Svarar kunder, skapar ärenden och följer upp', popular: false, tooltip: 'Hanterar inkommande ärenden via chatt, mejl och telefon. Eskalerar komplexa frågor till rätt person.' },
  { id: 'finance', icon: '💰', name: 'Ekonomi & Faktura', desc: 'Skickar offerter, fakturor och påminnelser', popular: false, tooltip: 'Automatisera fakturering, skicka betalningspåminnelser och generera ekonomiska rapporter.' },
  { id: 'research', icon: '🔍', name: 'Research & Analys', desc: 'Analyserar konkurrenter, marknader och trender', popular: false, tooltip: 'Bevakar konkurrenter, samlar marknadsdata och genererar insiktsrapporter automatiskt.' },
  { id: 'hr', icon: '👥', name: 'HR & Rekrytering', desc: 'Hanterar ansökningar, onboarding och intern kommunikation', popular: false, tooltip: 'Screenar CV, schemalägg intervjuer, skickar onboarding-material och hanterar personalfrågor.' },
  { id: 'tech', icon: '⚙️', name: 'IT-support', desc: 'Felsöker problem, dokumenterar processer och automatiserar', popular: false, tooltip: 'Löser vanliga IT-problem, dokumenterar tekniska processer och automatiserar repetitiva uppgifter.' },
]

const PURPOSES = [
  { id: 'admin', icon: '🗂', label: 'Automatisera administration', desc: 'Back-office och admin-uppgifter' },
  { id: 'sales', icon: '📈', label: 'Driva försäljning', desc: 'Fler leads och bättre konvertering' },
  { id: 'customer', icon: '🤝', label: 'Kundupplevelse', desc: 'Snabbare och bättre kundservice' },
  { id: 'time', icon: '⏱', label: 'Spara tid', desc: 'Eliminera repetitiva uppgifter' },
  { id: 'scale', icon: '🚀', label: 'Skala verksamheten', desc: 'Väx utan fler anställda' },
  { id: 'other', icon: '✨', label: 'Annat', desc: 'Beskriv ditt behov nedan' },
]

const PURPOSE_LABELS = Object.fromEntries(PURPOSES.map(p => [p.id, p.label]))

const PACKAGES = [
  { id: 'sales-machine', name: 'Säljmaskin', icon: '🎯', agents: ['sales', 'admin', 'customer'], desc: 'Perfekt för säljdrivna bolag som vill automatisera hela säljcykeln' },
  { id: 'content-factory', name: 'Contentfabrik', icon: '🏭', agents: ['marketing', 'research', 'sales'], desc: 'Skapa content, analysera marknaden och konvertera leads' },
  { id: 'backoffice-pro', name: 'Back-office Pro', icon: '🏢', agents: ['admin', 'finance', 'hr'], desc: 'Automatisera administration, ekonomi och HR-processer' },
]

const HOURS_PER_AGENT = 10
const HOURLY_RATE = 500

const STEP_LABELS = ['Start', 'Ditt företag', 'Vad ska AI:n göra?', 'Välj specialister', 'Personlighet', 'Snart klar!']
const TOTAL_STEPS = 5

// ─── Mac Mini SVG ───────────────────────────────────────────

const MacMiniIllustration = () => (
  <svg className="macmini-svg" viewBox="0 0 280 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="140" cy="185" rx="90" ry="10" fill="rgba(124,58,237,0.12)" />
    <rect x="40" y="120" width="200" height="55" rx="10" fill="#1a1a2e" />
    <rect x="40" y="120" width="200" height="55" rx="10" fill="url(#macGradDark)" />
    <rect x="40" y="120" width="200" height="12" rx="6" fill="#222240" />
    <rect x="40" y="125" width="200" height="4" fill="#1e1e38" />
    <rect x="48" y="138" width="80" height="28" rx="4" fill="rgba(124,58,237,0.08)" />
    <circle cx="220" cy="162" r="4" fill="#7C3AED" className="pulse-glow" />
    <circle cx="220" cy="162" r="8" fill="rgba(124,58,237,0.15)" className="pulse-glow-outer" />
    <rect x="185" y="148" width="28" height="5" rx="2" fill="#2a2a4a" />
    <rect x="185" y="157" width="28" height="5" rx="2" fill="#2a2a4a" />
    <text x="88" y="156" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="11" fontFamily="system-ui" fontWeight="300">AI Kollegorna</text>
    <rect x="55" y="20" width="170" height="95" rx="8" fill="#16162a" />
    <rect x="60" y="25" width="160" height="85" rx="5" fill="#0a0a1a" />
    <rect x="68" y="35" width="80" height="4" rx="2" fill="#7C3AED" opacity="0.9" />
    <rect x="68" y="44" width="120" height="3" rx="1.5" fill="#10B981" opacity="0.7" />
    <rect x="68" y="52" width="95" height="3" rx="1.5" fill="#3B82F6" opacity="0.6" />
    <rect x="68" y="60" width="60" height="3" rx="1.5" fill="#F59E0B" opacity="0.6" />
    <rect x="68" y="68" width="110" height="3" rx="1.5" fill="rgba(255,255,255,0.2)" />
    <rect x="68" y="76" width="75" height="3" rx="1.5" fill="#7C3AED" opacity="0.5" />
    <rect x="68" y="84" width="45" height="3" rx="1.5" fill="#10B981" opacity="0.5" />
    <rect x="68" y="94" width="7" height="3" rx="1" fill="#fff" opacity="0.8" className="cursor-blink" />
    <rect x="132" y="115" width="16" height="8" rx="2" fill="#2a2a4a" />
    <defs>
      <linearGradient id="macGradDark" x1="40" y1="120" x2="40" y2="175" gradientUnits="userSpaceOnUse">
        <stop stopColor="#1e1e38" />
        <stop offset="1" stopColor="#12122a" />
      </linearGradient>
    </defs>
  </svg>
)

// ─── Tooltip Component ──────────────────────────────────────

const Tooltip = ({ text, children }) => {
  const [show, setShow] = useState(false)
  return (
    <span className="tooltip-wrapper" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      {show && <span className="tooltip-bubble">{text}</span>}
    </span>
  )
}

// ─── Left Panel Content ─────────────────────────────────────

const LeftPanelContent = ({ step, form }) => {
  if (step === 0) {
    return (
      <div className="left-welcome">
        <MacMiniIllustration />
        <div className="left-tagline">
          <span className="left-badge">AI-powered</span>
          <h2>Din personliga<br />AI-medarbetare</h2>
          <p>Konfigurera en skräddarsydd AI-agent som jobbar dygnet runt för ditt företag.</p>
        </div>
        <div className="left-stats">
          <div className="stat-item">
            <span className="stat-number">500+</span>
            <span className="stat-label">Agenter i drift</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">40h</span>
            <span className="stat-label">Sparad tid/vecka</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">98%</span>
            <span className="stat-label">Nöjda kunder</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="left-progress-panel">
      <div className="left-panel-header">
        <span className="left-badge">Konfiguration</span>
        <h3>Din agent tar form</h3>
      </div>
      <div className="config-summary">
        <SummaryItem label="Företag" value={form.companyName || '—'} done={!!form.companyName} />
        <SummaryItem label="Bransch" value={form.industry || '—'} done={!!form.industry} />
        <SummaryItem label="Syfte" value={form.purpose ? (PURPOSE_LABELS[form.purpose] || form.purpose) : '—'} done={!!form.purpose} />
        <SummaryItem
          label="Sub-agenter"
          value={form.selectedAgents.length > 0
            ? form.selectedAgents.map(id => AGENTS.find(a => a.id === id)?.name).join(', ')
            : '—'}
          done={form.selectedAgents.length > 0}
        />
        <SummaryItem label="Agentnamn" value={form.agentName || '—'} done={!!form.agentName} />
        <SummaryItem label="Stil" value={form.commStyle || '—'} done={!!form.commStyle} />
        <SummaryItem label="Språk" value={form.language || '—'} done={!!form.language} />
      </div>
      <div className="left-panel-footer">
        <MacMiniIllustration />
      </div>
    </div>
  )
}

const SummaryItem = ({ label, value, done }) => (
  <div className={`summary-item ${done ? 'done' : ''}`}>
    <span className="summary-dot">{done ? '✓' : ''}</span>
    <div>
      <span className="summary-label">{label}</span>
      <span className="summary-value">{value}</span>
    </div>
  </div>
)

// ─── Progress Bar ───────────────────────────────────────────

const ProgressBar = ({ step }) => {
  if (step === 0 || step === 99) return null
  const pct = (step / TOTAL_STEPS) * 100
  return (
    <div className="progress-container">
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="progress-labels">
        {STEP_LABELS.slice(1).map((label, i) => (
          <span key={label} className={`progress-label ${i + 1 <= step ? 'active' : ''} ${i + 1 === step ? 'current' : ''}`}>
            <span className="progress-dot">{i + 1 < step ? '✓' : i + 1}</span>
            <span className="progress-text">{label}</span>
          </span>
        ))}
      </div>
    </div>
  )
}

// ─── Confirmation Screen ────────────────────────────────

const ConfirmationScreen = ({ form }) => {
  const [countdown, setCountdown] = useState(24 * 60 * 60) // 24h in seconds
  const [progressPct, setProgressPct] = useState(0)

  useEffect(() => {
    // Animate progress bar in
    const pTimer = setTimeout(() => setProgressPct(100), 100)

    const interval = setInterval(() => {
      setCountdown(c => (c > 0 ? c - 1 : 0))
    }, 1000)

    return () => {
      clearInterval(interval)
      clearTimeout(pTimer)
    }
  }, [])

  const formatTime = (s) => {
    const h = Math.floor(s / 3600)
    const m = Math.floor((s % 3600) / 60)
    const sec = s % 60
    return `${h}h ${m}m ${sec < 10 ? '0' : ''}${sec}s`
  }

  const savedHours = form.selectedAgents.length * HOURS_PER_AGENT
  const savedYearly = savedHours * HOURLY_RATE * 52

  const shareSubject = encodeURIComponent('Kolla in AI Kollegorna – AI-agenter för företag')
  const shareBody = encodeURIComponent(
    `Hej!\n\nJag har precis konfigurerat en AI-agent via AI Kollegorna. De bygger skräddarsydda AI-medarbetare som jobbar dygnet runt.\n\nKolla in det här: https://aikollegorna.se\n\nMvh`
  )

  return (
    <div className="step-content success-step">
      <div className="success-icon">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </div>
      <h2>Ansökan mottagen!</h2>
      <p className="success-desc">
        Tack, <strong>{form.contactName}</strong>. Anton har fått din ansökan
        om AI-agenten <strong>{form.agentName}</strong> för <strong>{form.companyName}</strong>.
      </p>

      {/* Countdown timer */}
      <div className="countdown-card">
        <p className="countdown-label">⏱ Anton kontaktar dig inom 24 timmar</p>
        <div className="countdown-timer">{formatTime(countdown)}</div>
        <div className="countdown-bar-track">
          <div
            className="countdown-bar-fill"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* "Vad händer nu?" cards */}
      <div className="next-steps-grid">
        <div className="next-step-card">
          <span className="next-step-icon">✉️</span>
          <h4>Bekräftelse via email</h4>
          <p>Skickat inom 5 min</p>
        </div>
        <div className="next-step-card">
          <span className="next-step-icon">📞</span>
          <h4>Kostnadsfri demo-call</h4>
          <p>Bokas inom 24h</p>
        </div>
        <div className="next-step-card">
          <span className="next-step-icon">🖥️</span>
          <h4>Installation på ert kontor</h4>
          <p>Inom 1–2 veckor</p>
        </div>
      </div>

      <div className="receipt-card">
        <div className="receipt-header">
          <span>🤖</span>
          <h4>Din konfiguration</h4>
        </div>
        <div className="receipt-body">
          <div className="receipt-row"><span>Företag</span><span>{form.companyName}</span></div>
          <div className="receipt-row"><span>Bransch</span><span>{form.industry}</span></div>
          <div className="receipt-row"><span>Agent</span><span>{form.agentName}</span></div>
          <div className="receipt-row"><span>Syfte</span><span>{PURPOSE_LABELS[form.purpose] || form.purpose}</span></div>
          <div className="receipt-row"><span>Sub-agenter</span><span>{form.selectedAgents.map(id => AGENTS.find(a => a.id === id)?.name).join(', ')}</span></div>
          <div className="receipt-row"><span>Stil</span><span>{form.commStyle} · {form.language}</span></div>
          <div className="receipt-row"><span>Kontakt</span><span>{form.contactEmail}</span></div>
        </div>
      </div>

      {form.selectedAgents.length > 0 && (() => {
        return (
          <div className="roi-card">
            <div className="roi-header">
              <span>📊</span>
              <h4>Uppskattad ROI</h4>
            </div>
            <div className="roi-body">
              <div className="roi-stat">
                <span className="roi-number">{savedHours}h</span>
                <span className="roi-label">sparade timmar/vecka</span>
              </div>
              <div className="roi-divider" />
              <div className="roi-stat">
                <span className="roi-number">{(savedYearly / 1000).toFixed(0)}k kr</span>
                <span className="roi-label">besparing per år</span>
              </div>
            </div>
            <p className="roi-disclaimer">
              Med {form.selectedAgents.length} agenter kan du spara uppskattningsvis {savedHours} timmar/vecka och {savedYearly.toLocaleString('sv-SE')} kr/år.
              Baserat på {HOURS_PER_AGENT}h/agent/vecka och {HOURLY_RATE} kr/h.
            </p>
          </div>
        )
      })()}

      <div className="confirmation-actions">
        <a
          href={`mailto:?subject=${shareSubject}&body=${shareBody}`}
          className="btn btn-primary share-btn"
        >
          📨 Dela med en kollega
        </a>
        <a href="https://aikollegorna.se" className="btn btn-secondary">
          Tillbaka till aikollegorna.se
        </a>
      </div>
    </div>
  )
}

// ─── Main App ───────────────────────────────────────────────

const INITIAL_FORM = {
  companyName: '',
  industry: '',
  companySize: '',
  agentName: '',
  purpose: '',
  purposeCustom: '',
  selectedAgents: [],
  commStyle: '',
  language: '',
  activityLevel: '',
  contactName: '',
  contactEmail: '',
  contactPhone: '',
  extraInfo: '',
  wantDemo: false,
  wantInfo: false,
}

export default function App() {
  const { form, setForm, step, setStep, update, clearPersistence, saveSubmission } = useFormPersistence(INITIAL_FORM, 0)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [slideDir, setSlideDir] = useState('right')
  const [animating, setAnimating] = useState(false)
  const mainRef = useRef(null)

  // Real-time validation
  const [touched, setTouched] = useState({})
  const markTouched = (field) => setTouched(t => ({ ...t, [field]: true }))

  // Real-time validation effect
  useEffect(() => {
    if (Object.keys(touched).length === 0) return
    const e = {}
    if (touched.companyName && step === 1 && !form.companyName.trim()) e.companyName = 'Obligatoriskt'
    if (touched.industry && step === 1 && !form.industry) e.industry = 'Obligatoriskt'
    if (touched.companySize && step === 1 && !form.companySize) e.companySize = 'Välj ett alternativ'
    if (touched.contactName && step === 5 && !form.contactName.trim()) e.contactName = 'Obligatoriskt'
    if (touched.contactEmail && step === 5 && (!form.contactEmail.trim() || !form.contactEmail.includes('@'))) e.contactEmail = 'Ange en giltig e-post'
    setErrors(prev => ({ ...prev, ...e }))
  }, [form, touched, step])

  const toggleAgent = (id) => {
    setForm(f => {
      const arr = f.selectedAgents
      if (arr.includes(id)) return { ...f, selectedAgents: arr.filter(a => a !== id) }
      if (arr.length >= 4) return f
      return { ...f, selectedAgents: [...arr, id] }
    })
  }

  const validate = (s) => {
    const e = {}
    if (s === 1) {
      if (!form.companyName.trim()) e.companyName = 'Obligatoriskt'
      if (!form.industry) e.industry = 'Obligatoriskt'
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
      if (!form.commStyle) e.commStyle = 'Välj kommunikationsstil'
      if (!form.language) e.language = 'Välj språk'
      if (!form.activityLevel) e.activityLevel = 'Välj aktivitetsnivå'
    }
    if (s === 5) {
      if (!form.contactName.trim()) e.contactName = 'Obligatoriskt'
      if (!form.contactEmail.trim() || !form.contactEmail.includes('@')) e.contactEmail = 'Ange en giltig e-post'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const goTo = (target, dir) => {
    setSlideDir(dir)
    setAnimating(true)
    setTimeout(() => {
      setStep(target)
      setAnimating(false)
      setTouched({})
    }, 250)
  }

  const next = () => {
    if (step === 0) { goTo(1, 'right'); return }
    if (validate(step)) goTo(Math.min(step + 1, TOTAL_STEPS + 1), 'right')
  }

  const back = () => {
    if (step > 1) goTo(step - 1, 'left')
  }

  const handleSubmit = async () => {
    if (!validate(5)) return
    setSubmitting(true)

    const agentNames = form.selectedAgents.map(id => AGENTS.find(a => a.id === id)?.name).join(', ')
    const purposeLabel = PURPOSE_LABELS[form.purpose] || form.purpose
    const formspreeId = import.meta.env.VITE_FORMSPREE_ID || 'mldnjqzk'

    const submissionData = {
      _subject: `Ny agent-konfiguration från ${form.companyName}`,
      _replyto: form.contactEmail,
      _template: 'table',
      // Företagsinfo
      'Företagsnamn': form.companyName,
      'Bransch': form.industry,
      'Antal anställda': form.companySize,
      // Agent-konfiguration
      'Agentnamn': form.agentName,
      'Primärt syfte': purposeLabel + (form.purposeCustom ? ` — ${form.purposeCustom}` : ''),
      'Kommunikationsstil': form.commStyle,
      'Språk': form.language,
      'Aktivitetsnivå': form.activityLevel,
      'Valda sub-agenter': agentNames,
      'Antal sub-agenter': form.selectedAgents.length,
      // Kontaktuppgifter
      'Kontaktperson': form.contactName,
      'E-post': form.contactEmail,
      'Telefon': form.contactPhone || '—',
      'Vill ha demo': form.wantDemo ? 'Ja' : 'Nej',
      'Vill ha info via mejl': form.wantInfo ? 'Ja' : 'Nej',
      // Övrigt
      'Övrig information': form.extraInfo || '—',
      'Skickat från': 'Agent Configurator — aikollegorna.se',
    }

    // Save to localStorage as backup
    saveSubmission(form)

    try {
      const res = await fetch(`https://formspree.io/f/${formspreeId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData)
      })
      if (res.ok) {
        setSubmitted(true)
        clearPersistence()
        goTo(99, 'right')
      } else {
        setErrors({ submit: 'Något gick fel. Försök igen eller kontakta hej@aikollegorna.se' })
      }
    } catch {
      setErrors({ submit: 'Nätverksfel. Kontrollera din anslutning och försök igen.' })
    }
    setSubmitting(false)
  }

  const slideClass = animating ? `slide-exit-${slideDir}` : 'slide-enter'

  return (
    <div className="app-shell">
      {/* Left panel — desktop only */}
      <aside className="left-panel">
        <div className="left-panel-inner">
          <a href="https://aikollegorna.se" className="logo-left">
            AI <span>Kollegorna</span>
          </a>
          <LeftPanelContent step={step} form={form} />
        </div>
      </aside>

      {/* Right panel — form */}
      <div className="right-panel">
        {/* Mobile header */}
        <header className="mobile-header">
          <a href="https://aikollegorna.se" className="logo">
            AI <span>Kollegorna</span>
          </a>
          {step > 0 && step < 99 && (
            <span className="step-indicator">Steg {step} av {TOTAL_STEPS}</span>
          )}
        </header>

        <ProgressBar step={step} />

        <main className="main-content" ref={mainRef}>
          <div className={`step-wrapper ${slideClass}`}>

            {/* STEP 0 — Welcome */}
            {step === 0 && (
              <div className="step-content welcome-step">
                <div className="mobile-illustration">
                  <MacMiniIllustration />
                </div>
                <div className="time-badge">⏱ Tar 3 minuter</div>
                <h1>Konfigurera din <em>egna AI-agent</em></h1>
                <p className="welcome-desc">
                  Svara på några frågor om ditt företag, välj vilka agenter du vill ha
                  och skicka in din ansökan. Anton återkopplar personligen om hur ni kan komma igång.
                </p>
                <button className="btn btn-primary btn-lg" onClick={next}>
                  Börja konfigurera
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
                <div className="trust-badges">
                  <span>🔒 Ingen bindningstid</span>
                  <span>⚡ Igång inom 48h</span>
                  <span>💬 Personlig kontakt</span>
                </div>
              </div>
            )}

            {/* STEP 1 — Företaget */}
            {step === 1 && (
              <div className="step-content">
                <div className="step-header">
                  <span className="step-number">01</span>
                  <h2>Berätta om ditt företag</h2>
                  <p className="subtitle">Vi skräddarsyr AI-agenten efter din verksamhet.</p>
                </div>
                <div className="form-group">
                  <label>Företagets namn <span className="required">*</span></label>
                  <input type="text" value={form.companyName}
                    onChange={e => update('companyName', e.target.value)}
                    onBlur={() => markTouched('companyName')}
                    placeholder="t.ex. Andersson Fastigheter AB"
                    className={errors.companyName ? 'input-error' : ''} />
                  {errors.companyName && <p className="error-text">{errors.companyName}</p>}
                </div>
                <div className="form-group">
                  <label>Bransch <span className="required">*</span></label>
                  <select value={form.industry}
                    onChange={e => update('industry', e.target.value)}
                    onBlur={() => markTouched('industry')}
                    className={errors.industry ? 'input-error' : ''}>
                    <option value="">Välj bransch...</option>
                    {INDUSTRIES.map(ind => (
                      <option key={ind} value={ind}>{ind}</option>
                    ))}
                  </select>
                  {errors.industry && <p className="error-text">{errors.industry}</p>}
                  <IndustryBadges selected={form.industry} onSelect={(val) => update('industry', val)} />
                </div>
                <div className="form-group">
                  <label>Antal anställda <span className="required">*</span></label>
                  <select value={form.companySize}
                    onChange={e => update('companySize', e.target.value)}
                    onBlur={() => markTouched('companySize')}
                    className={errors.companySize ? 'input-error' : ''}>
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
                  <button className="btn btn-primary" onClick={next}>
                    Nästa
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2 — Syfte (Card Grid) */}
            {step === 2 && (
              <div className="step-content">
                <div className="step-header">
                  <span className="step-number">02</span>
                  <h2>Vad ska agenten göra?</h2>
                  <p className="subtitle">Välj det primära syftet. Du kan alltid lägga till mer senare.</p>
                </div>
                <div className="purpose-grid">
                  {PURPOSES.map(p => (
                    <div
                      key={p.id}
                      className={`purpose-card ${form.purpose === p.id ? 'selected' : ''}`}
                      onClick={() => update('purpose', p.id)}
                    >
                      <span className="purpose-icon">{p.icon}</span>
                      <span className="purpose-label">{p.label}</span>
                      <span className="purpose-desc">{p.desc}</span>
                      {form.purpose === p.id && <span className="purpose-check">✓</span>}
                    </div>
                  ))}
                </div>
                {errors.purpose && <p className="error-text" style={{ marginTop: 12 }}>{errors.purpose}</p>}
                {form.purpose === 'other' && (
                  <div className="form-group" style={{ marginTop: 20 }}>
                    <textarea value={form.purposeCustom} onChange={e => update('purposeCustom', e.target.value)}
                      placeholder="Beskriv vad du vill att agenten ska hjälpa till med..." />
                  </div>
                )}
                <div className="btn-group">
                  <button className="btn btn-secondary" onClick={back}>
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M13 8H3M7 4L3 8l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    Tillbaka
                  </button>
                  <button className="btn btn-primary" onClick={next}>
                    Nästa
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3 — Sub-agenter */}
            {step === 3 && (
              <div className="step-content">
                <div className="step-header">
                  <span className="step-number">03</span>
                  <h2>Välj dina sub-agenter</h2>
                  <p className="subtitle">Vilka specialistfunktioner ska din AI ha? Välj 1–4 stycken.</p>
                </div>
                <div className="packages-section">
                  <p className="packages-title">Populära kombinationer</p>
                  <div className="packages-grid">
                    {PACKAGES.map(pkg => {
                      const isActive = pkg.agents.every(a => form.selectedAgents.includes(a)) && pkg.agents.length === form.selectedAgents.length
                      return (
                        <div
                          key={pkg.id}
                          className={`package-card ${isActive ? 'active' : ''}`}
                          onClick={() => setForm(f => ({ ...f, selectedAgents: [...pkg.agents] }))}
                        >
                          <span className="package-icon">{pkg.icon}</span>
                          <div className="package-info">
                            <strong>{pkg.name}</strong>
                            <span className="package-agents">{pkg.agents.map(id => AGENTS.find(a => a.id === id)?.name).join(' + ')}</span>
                          </div>
                          {isActive && <span className="package-check">✓</span>}
                        </div>
                      )
                    })}
                  </div>
                </div>

                <p className="selection-hint">{form.selectedAgents.length}/4 valda — eller välj manuellt nedan</p>
                <div className="agent-grid">
                  {AGENTS.map(a => {
                    const sel = form.selectedAgents.includes(a.id)
                    return (
                      <div key={a.id} className={`agent-card ${sel ? 'selected' : ''}`} onClick={() => toggleAgent(a.id)}>
                        {a.popular && <span className="popular-badge">POPULÄR</span>}
                        {sel && <span className="agent-check">✓</span>}
                        <span className="agent-card-icon">{a.icon}</span>
                        <div className="agent-card-name">
                          {a.name}
                          <Tooltip text={a.tooltip}>
                            <span className="info-icon">ⓘ</span>
                          </Tooltip>
                        </div>
                        <div className="agent-card-desc">{a.desc}</div>
                      </div>
                    )
                  })}
                </div>
                {errors.agents && <p className="error-text" style={{ marginTop: 12 }}>{errors.agents}</p>}
                <div className="btn-group">
                  <button className="btn btn-secondary" onClick={back}>
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M13 8H3M7 4L3 8l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    Tillbaka
                  </button>
                  <button className="btn btn-primary" onClick={next}>
                    Nästa
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4 — Agentens personlighet (NEW) */}
            {step === 4 && (
              <div className="step-content">
                <div className="step-header">
                  <span className="step-number">04</span>
                  <h2>Agentens personlighet</h2>
                  <p className="subtitle">Bestäm hur din AI-agent ska kommunicera och agera.</p>
                </div>
                <div className="form-group">
                  <label>Agentens namn <span className="required">*</span></label>
                  <input type="text" value={form.agentName}
                    onChange={e => update('agentName', e.target.value)}
                    onBlur={() => markTouched('agentName')}
                    placeholder="t.ex. Sara, Nova, Erik, Max..."
                    className={errors.agentName ? 'input-error' : ''} />
                  {errors.agentName && <p className="error-text">{errors.agentName}</p>}
                  <p className="field-hint">Det här är vad dina anställda och kunder kommer kalla den.</p>
                </div>

                <div className="form-group">
                  <label>Kommunikationsstil <span className="required">*</span></label>
                  <div className="style-options">
                    {['Formell', 'Neutral', 'Varm och personlig'].map(s => (
                      <button key={s} type="button"
                        className={`style-btn ${form.commStyle === s ? 'active' : ''}`}
                        onClick={() => update('commStyle', s)}>
                        {s === 'Formell' && '👔'} {s === 'Neutral' && '🤝'} {s === 'Varm och personlig' && '💛'}{' '}
                        {s}
                      </button>
                    ))}
                  </div>
                  {errors.commStyle && <p className="error-text">{errors.commStyle}</p>}
                </div>

                <div className="form-group">
                  <label>Primärt språk <span className="required">*</span></label>
                  <div className="style-options">
                    {['Svenska', 'Engelska', 'Tvåspråkig'].map(s => (
                      <button key={s} type="button"
                        className={`style-btn ${form.language === s ? 'active' : ''}`}
                        onClick={() => update('language', s)}>
                        {s === 'Svenska' && '🇸🇪'} {s === 'Engelska' && '🇬🇧'} {s === 'Tvåspråkig' && '🌐'}{' '}
                        {s}
                      </button>
                    ))}
                  </div>
                  {errors.language && <p className="error-text">{errors.language}</p>}
                </div>

                <div className="form-group">
                  <label>Aktivitetsnivå <span className="required">*</span></label>
                  <div className="activity-options">
                    <div
                      className={`activity-card ${form.activityLevel === 'Proaktiv' ? 'active' : ''}`}
                      onClick={() => update('activityLevel', 'Proaktiv')}>
                      <span className="activity-icon">🚀</span>
                      <div>
                        <strong>Proaktiv</strong>
                        <p>Tar initiativ, föreslår åtgärder och agerar automatiskt</p>
                      </div>
                    </div>
                    <div
                      className={`activity-card ${form.activityLevel === 'Reaktiv' ? 'active' : ''}`}
                      onClick={() => update('activityLevel', 'Reaktiv')}>
                      <span className="activity-icon">💡</span>
                      <div>
                        <strong>Reaktiv</strong>
                        <p>Svarar på frågor och utför uppgifter vid förfrågan</p>
                      </div>
                    </div>
                  </div>
                  {errors.activityLevel && <p className="error-text">{errors.activityLevel}</p>}
                </div>

                <div className="form-group">
                  <label>Något övrigt? <span className="optional">(valfritt)</span></label>
                  <textarea value={form.extraInfo} onChange={e => update('extraInfo', e.target.value)}
                    placeholder="Speciella krav, befintliga system ni använder, processer ni vill automatisera..." />
                </div>

                <div className="btn-group">
                  <button className="btn btn-secondary" onClick={back}>
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M13 8H3M7 4L3 8l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    Tillbaka
                  </button>
                  <button className="btn btn-primary" onClick={next}>
                    Nästa
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 5 — Kontakt + Sammanfattning */}
            {step === 5 && (
              <div className="step-content">
                <div className="step-header">
                  <span className="step-number">05</span>
                  <h2>Skicka in ansökan</h2>
                  <p className="subtitle">Fyll i dina kontaktuppgifter så återkopplar Anton personligen.</p>
                </div>

                <div className="summary-box">
                  <h4>Din konfiguration</h4>
                  <div className="summary-row"><span>Företag</span><span>{form.companyName}</span></div>
                  <div className="summary-row"><span>Bransch</span><span>{form.industry}</span></div>
                  <div className="summary-row"><span>Agentnamn</span><span>{form.agentName}</span></div>
                  <div className="summary-row"><span>Syfte</span><span style={{ maxWidth: 250, textAlign: 'right', lineHeight: 1.3 }}>{PURPOSE_LABELS[form.purpose] || form.purpose}</span></div>
                  <div className="summary-row"><span>Sub-agenter</span><span>{form.selectedAgents.map(id => AGENTS.find(a => a.id === id)?.name).join(', ')}</span></div>
                  <div className="summary-row"><span>Stil</span><span>{form.commStyle}</span></div>
                  <div className="summary-row"><span>Språk</span><span>{form.language}</span></div>
                  <div className="summary-row"><span>Aktivitet</span><span>{form.activityLevel}</span></div>
                </div>

                <div className="two-col">
                  <div className="form-group">
                    <label>Ditt namn <span className="required">*</span></label>
                    <input type="text" value={form.contactName}
                      onChange={e => update('contactName', e.target.value)}
                      onBlur={() => markTouched('contactName')}
                      placeholder="Förnamn Efternamn"
                      className={errors.contactName ? 'input-error' : ''} />
                    {errors.contactName && <p className="error-text">{errors.contactName}</p>}
                  </div>
                  <div className="form-group">
                    <label>Telefon <span className="optional">(valfritt)</span></label>
                    <input type="tel" value={form.contactPhone}
                      onChange={e => update('contactPhone', e.target.value)} placeholder="+46 70 123 45 67" />
                  </div>
                </div>
                <div className="form-group">
                  <label>E-postadress <span className="required">*</span></label>
                  <input type="email" value={form.contactEmail}
                    onChange={e => update('contactEmail', e.target.value)}
                    onBlur={() => markTouched('contactEmail')}
                    placeholder="du@foretaget.se"
                    className={errors.contactEmail ? 'input-error' : ''} />
                  {errors.contactEmail && <p className="error-text">{errors.contactEmail}</p>}
                </div>

                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input type="checkbox" checked={form.wantDemo}
                      onChange={e => update('wantDemo', e.target.checked)} />
                    <span className="checkbox-text">Jag vill ha en kostnadsfri demo-call (30 min)</span>
                  </label>
                  <label className="checkbox-label">
                    <input type="checkbox" checked={form.wantInfo}
                      onChange={e => update('wantInfo', e.target.checked)} />
                    <span className="checkbox-text">Skicka mig mer info via e-post</span>
                  </label>
                </div>

                {errors.submit && <p className="error-text" style={{ marginTop: 12 }}>{errors.submit}</p>}

                <div className="btn-group">
                  <button className="btn btn-secondary" onClick={back}>
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M13 8H3M7 4L3 8l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    Tillbaka
                  </button>
                  <button className="btn btn-primary btn-submit" onClick={handleSubmit} disabled={submitting}>
                    {submitting ? (
                      <>
                        <span className="spinner" /> Skickar...
                      </>
                    ) : (
                      <>
                        Skicka ansökan
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 99 — Bekräftelse */}
            {step === 99 && (
              <ConfirmationScreen form={form} />
            )}
          </div>
        </main>

        <p className="footer-note">
          AI Kollegorna AB · <a href="mailto:hej@aikollegorna.se">hej@aikollegorna.se</a> ·{' '}
          <a href="https://aikollegorna.se">aikollegorna.se</a>
        </p>
      </div>
    </div>
  )
}
