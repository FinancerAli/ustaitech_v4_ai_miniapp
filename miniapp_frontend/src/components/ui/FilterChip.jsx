import './FilterChip.css'

export default function FilterChip({ label, active = false, onClick }) {
  return (
    <button
      className={`filter-chip tap-target ${active ? 'filter-chip--active' : ''}`}
      onClick={onClick}
    >
      {label}
    </button>
  )
}
