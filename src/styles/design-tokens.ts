export type StatusTone =
  | 'neutral'
  | 'blue'
  | 'green'
  | 'orange'
  | 'red'
  | 'purple'
  | 'info'
  | 'warning'
  | 'success'
  | 'danger'
  | 'dark'

export const statusStyles: Record<StatusTone, string> = {
  neutral: 'border-slate-200 bg-slate-50 text-slate-600',
  blue: 'border-blue-100 bg-blue-50 text-blue-700',
  green: 'border-emerald-100 bg-emerald-50 text-emerald-700',
  orange: 'border-orange-100 bg-orange-50 text-orange-700',
  red: 'border-red-100 bg-red-50 text-red-700',
  purple: 'border-violet-100 bg-violet-50 text-violet-700',
  info: 'border-blue-100 bg-blue-50 text-blue-700',
  warning: 'border-orange-100 bg-orange-50 text-orange-700',
  success: 'border-emerald-100 bg-emerald-50 text-emerald-700',
  danger: 'border-red-100 bg-red-50 text-red-700',
  dark: 'border-slate-800 bg-slate-950 text-white',
}

export const designTokens = {
  colors: {
    navy: '#162751',
    navyDeep: '#0f1f45',
    blue: '#009FE3',
    cyan: '#009FE3',
    green: '#059669',
    orange: '#f97316',
    border: '#dce6f3',
    text: '#06163a',
    muted: '#63718b',
    page: '#ffffff',
  },
  radius: {
    panel: '18px',
    soft: '14px',
    pill: '10px',
  },
  shadow: {
    panel: '0 14px 34px rgba(10, 31, 68, 0.08)',
  },
} as const
