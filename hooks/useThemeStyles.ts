import { useTheme } from '@/contexts/ThemeContext'
import { themes, ThemeColors } from '@/lib/themes'

export function useThemeStyles(): ThemeColors {
  const { theme } = useTheme()
  return themes[theme]
}
