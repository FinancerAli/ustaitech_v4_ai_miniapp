import './TrustStrip.css'

const signals = [
  { icon: 'verified_user', text: 'Xavfsiz To\'lov' },
  { icon: 'speed', text: 'Tezkor Faollash' },
  { icon: 'support_agent', text: '24/7 Yordam' },
]

export default function TrustStrip() {
  return (
    <section className="trust-strip">
      {signals.map((s, i) => (
        <div key={i} className="trust-strip__item">
          <span className="material-symbols-outlined trust-strip__icon">{s.icon}</span>
          <span className="trust-strip__text">{s.text}</span>
        </div>
      ))}
    </section>
  )
}
