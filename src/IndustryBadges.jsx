const INDUSTRY_BADGES = [
  { label: 'Fastighet', emoji: '🏢', value: 'Fastighet & Mäkleri' },
  { label: 'Redovisning', emoji: '📊', value: 'Redovisning & Bokföring' },
  { label: 'Juridik', emoji: '⚖️', value: 'Juridik & Advokat' },
  { label: 'E-handel', emoji: '🛒', value: 'E-handel & Retail' },
  { label: 'Bygg', emoji: '🔨', value: 'Bygg & Entreprenad' },
  { label: 'Vård', emoji: '🏥', value: 'Hälsa & Sjukvård' },
]

export default function IndustryBadges({ selected, onSelect }) {
  return (
    <div className="industry-badges">
      {INDUSTRY_BADGES.map(b => (
        <button
          key={b.value}
          type="button"
          className={`industry-badge ${selected === b.value ? 'active' : ''}`}
          onClick={() => onSelect(b.value)}
        >
          <span className="industry-badge-emoji">{b.emoji}</span>
          {b.label}
        </button>
      ))}
    </div>
  )
}
