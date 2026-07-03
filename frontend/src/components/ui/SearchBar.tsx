import { Search } from 'lucide-react'

type SearchBarProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  ariaLabel?: string
}

export function SearchBar({ value, onChange, placeholder = 'Buscar...', ariaLabel = 'Buscar' }: SearchBarProps) {
  return (
    <label className="relative block w-full">
      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className="w-full rounded-full border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-[#1D4ED8] focus:bg-white"
      />
    </label>
  )
}
