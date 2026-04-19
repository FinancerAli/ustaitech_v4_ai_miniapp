import './GlassCard.css'

export default function GlassCard({ children, className = '', onClick, borderLeft = false, style }) {
  return (
    <div
      className={`glass-card-component ${borderLeft ? 'glass-card-component--border-left' : ''} ${onClick ? 'tap-target' : ''} ${className}`}
      onClick={onClick}
      style={style}
    >
      {children}
    </div>
  )
}
