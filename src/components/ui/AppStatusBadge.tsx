import { statusStyles, type StatusTone } from "../../styles/design-tokens"

type AppStatusBadgeProps = {
  label: string
  tone?: StatusTone
  dot?: boolean
}

export function AppStatusBadge({ label, tone = "neutral", dot = true }: AppStatusBadgeProps) {
  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${statusStyles[tone]}`}>
      {dot ? <span className="h-2 w-2 rounded-full bg-current" /> : null}
      {label}
    </span>
  )
}
