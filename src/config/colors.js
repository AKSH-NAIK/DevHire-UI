// Unified color configuration for consistent styling across the app
export const colors = {
  // Backgrounds
  background: {
    primary: 'bg-slate-950',
    secondary: 'bg-slate-900',
    tertiary: 'bg-slate-900/50',
    dark: 'bg-[#0a0e27]',
  },
  
  // Text
  text: {
    primary: 'text-white',
    secondary: 'text-slate-300',
    tertiary: 'text-slate-400',
    muted: 'text-slate-500',
  },
  
  // Borders
  border: {
    primary: 'border-slate-700',
    secondary: 'border-slate-600',
    light: 'border-slate-500',
  },
  
  // Accent (Cyan)
  accent: {
    bg: 'bg-cyan-500',
    bgHover: 'hover:bg-cyan-600',
    bgLight: 'bg-cyan-500/10',
    text: 'text-cyan-400',
    textHover: 'hover:text-cyan-300',
    border: 'border-cyan-500/30',
  },
  
  // Cards
  card: {
    background: 'bg-slate-900/50',
    border: 'border-slate-700',
    hover: 'hover:border-cyan-500/40',
  },
}

// Preset class combinations for common patterns
export const presets = {
  // Button - Cyan solid
  buttonPrimary: `${colors.accent.bg} ${colors.accent.bgHover} text-black font-semibold rounded transition-colors`,
  
  // Button - Outlined
  buttonSecondary: `border ${colors.border.primary} ${colors.text.primary} hover:border-white ${colors.card.hover} font-semibold rounded transition-colors`,
  
  // Input field
  input: `w-full px-4 py-3 ${colors.background.tertiary} border ${colors.border.secondary} rounded ${colors.text.primary} placeholder-${colors.text.tertiary} focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition-colors`,
  
  // Card
  card: `${colors.card.background} border ${colors.card.border} rounded ${colors.card.hover} transition-all duration-300`,
  
  // Stat card
  statCard: `${colors.card.background} border ${colors.card.border} rounded p-6 ${colors.card.hover} transition-all`,
}
