// Unified color configuration for consistent styling across the app
export const colors = {
  // Backgrounds
  background: {
    primary: 'bg-[#1F1F1F]',
    secondary: 'bg-[#2A2A2A]',
    tertiary: 'bg-[#2A2A2A]/50',
    dark: 'bg-[#121212]',
  },
  
  // Text
  text: {
    primary: 'text-[#F5F5F5]',
    secondary: 'text-[#B3B3B3]',
    tertiary: 'text-slate-400',
    muted: 'text-slate-500',
  },
  
  // Borders
  border: {
    primary: 'border-[#3A3A3A]',
    secondary: 'border-white/10',
    light: 'border-white/5',
  },
  
  // Accent (Amber)
  accent: {
    bg: 'bg-[#F59E0B]',
    bgHover: 'hover:bg-[#D97706]',
    bgLight: 'bg-[#F59E0B]/10',
    text: 'text-[#F59E0B]',
    textHover: 'hover:text-[#FBBF24]',
    border: 'border-[#F59E0B]/30',
  },
  
  // Cards
  card: {
    background: 'bg-[#2A2A2A]/50',
    border: 'border-[#3A3A3A]',
    hover: 'hover:border-[#F59E0B]/40',
  },
}

// Preset class combinations for common patterns
export const presets = {
  // Button - Amber solid
  buttonPrimary: `${colors.accent.bg} ${colors.accent.bgHover} text-[#1F1F1F] font-semibold rounded transition-colors`,
  
  // Button - Outlined
  buttonSecondary: `border ${colors.border.primary} ${colors.text.primary} hover:border-[#F5F5F5] ${colors.card.hover} font-semibold rounded transition-colors`,
  
  // Input field
  input: `w-full px-4 py-3 ${colors.background.tertiary} border ${colors.border.secondary} rounded ${colors.text.primary} placeholder-${colors.text.tertiary} focus:outline-none focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B]/30 transition-colors`,
  
  // Card
  card: `${colors.card.background} border ${colors.card.border} rounded ${colors.card.hover} transition-all duration-300`,
  
  // Stat card
  statCard: `${colors.card.background} border ${colors.card.border} rounded p-6 ${colors.card.hover} transition-all`,
}
