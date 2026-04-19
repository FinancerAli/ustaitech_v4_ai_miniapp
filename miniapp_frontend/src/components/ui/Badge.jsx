import './Badge.css'

const badgeStyles = {
  tertiary: 'badge--tertiary',
  neutral: 'badge--neutral',
  primary: 'badge--primary',
}

export default function Badge({ text, type = 'neutral' }) {
  return (
    <span className={`badge ${badgeStyles[type] || badgeStyles.neutral}`}>
      {text}
    </span>
  )
}
