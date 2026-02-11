# Bridezilla Design System (v3.0 - Optimized for Claude Code)

**Last Updated:** February 11, 2026
**Version:** 3.0 (Optimized for LLM consumption)

---

## 🎯 CRITICAL RULES

**Workspace Routes (`/planner/*`, `/admin/*`):**
- ✅ ALWAYS use `const theme = useThemeStyles()` hook
- ✅ ALWAYS use theme tokens: `${theme.primaryButton}`, `${theme.textPrimary}`, etc.
- ❌ NEVER hardcode colors: `bg-bridezilla-pink`, `text-gray-600`, `bg-stone-100`
- ❌ NEVER use Tailwind color classes directly in components
- 🎨 Supports TWO themes: Pop (pink) and Heirloom (dark green)

**Wedding Website Routes (`/shared/*`):**
- ✅ ALWAYS use `const theme = useThemeStyles()` hook
- 🔒 Theme locked to Heirloom (cream/dark green)
- Same token usage as workspace routes

**Status Badges:**
- Use fixed colors (emerald/amber/red) - these don't use theme tokens
- Status colors convey semantic meaning across both themes

**Exceptions:**
- Destructive (red) buttons use fixed color
- Status badges use fixed colors
- Everything else uses theme tokens

---

## 📋 Quick Reference (Copy-Paste Patterns)

### Standard Import

```tsx
'use client'

import { useThemeStyles } from '@/hooks/useThemeStyles'

export default function YourComponent() {
  const theme = useThemeStyles()

  // Use theme tokens below...
}
```

### Theme Tokens Cheat Sheet

| Element | Token | Usage |
|---------|-------|-------|
| **Backgrounds** | | |
| Page | `${theme.pageBackground}` | Main page backdrop |
| Card | `${theme.cardBackground}` | Cards, modals, panels |
| **Buttons** | | |
| Primary | `${theme.primaryButton} ${theme.textOnPrimary} ${theme.primaryButtonHover}` | Main CTAs |
| Secondary | `${theme.secondaryButton} ${theme.textSecondary} ${theme.secondaryButtonHover}` | Cancel, Back |
| **Text** | | |
| Primary | `${theme.textPrimary}` | Headings, emphasized |
| Secondary | `${theme.textSecondary}` | Body text |
| Muted | `${theme.textMuted}` | Helper text |
| On Primary | `${theme.textOnPrimary}` | Text on colored backgrounds |
| **Borders** | | |
| Border | `${theme.border} ${theme.borderWidth}` | Card borders, dividers |
| **Navigation** | | |
| Active | `${theme.navActive}` | Active nav item |
| Inactive | `${theme.navInactive}` | Inactive nav item |
| Hover | `${theme.navHover}` | Hover state |

### Complete Component Example

```tsx
'use client'

import { useThemeStyles } from '@/hooks/useThemeStyles'
import { Save, X } from 'lucide-react'

export default function ExampleCard({ title, description }: {
  title: string
  description: string
}) {
  const theme = useThemeStyles()

  return (
    <div className={`${theme.cardBackground} rounded-2xl p-6 border ${theme.border} ${theme.borderWidth}`}>
      {/* Header */}
      <h2 className={`text-xl font-semibold ${theme.textPrimary} mb-2`}>
        {title}
      </h2>
      <p className={`${theme.textSecondary} mb-6`}>
        {description}
      </p>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          className={`flex items-center gap-2 px-4 py-2 ${theme.primaryButton}
                     ${theme.textOnPrimary} ${theme.primaryButtonHover}
                     rounded-lg text-sm font-medium transition-colors`}
        >
          <Save className="w-4 h-4" />
          Save Changes
        </button>

        <button
          className={`flex items-center gap-2 px-4 py-2 ${theme.secondaryButton}
                     ${theme.textSecondary} ${theme.secondaryButtonHover}
                     rounded-lg text-sm font-medium transition-colors`}
        >
          <X className="w-4 h-4" />
          Cancel
        </button>
      </div>
    </div>
  )
}
```

### Common Patterns

**Page Layout:**
```tsx
<div className={`${theme.pageBackground} min-h-screen p-8`}>
  <div className={`${theme.cardBackground} rounded-2xl p-6 border ${theme.border}`}>
    Content
  </div>
</div>
```

**Primary Button:**
```tsx
<button className={`${theme.primaryButton} ${theme.textOnPrimary}
                   ${theme.primaryButtonHover} px-4 py-2 rounded-lg
                   text-sm font-medium transition-colors`}>
  Save
</button>
```

**Secondary Button:**
```tsx
<button className={`${theme.secondaryButton} ${theme.textSecondary}
                   ${theme.secondaryButtonHover} px-4 py-2 rounded-lg
                   text-sm font-medium transition-colors`}>
  Cancel
</button>
```

**Text Hierarchy:**
```tsx
<h2 className={`text-xl font-semibold ${theme.textPrimary}`}>Heading</h2>
<p className={theme.textSecondary}>Body text</p>
<span className={`text-sm ${theme.textMuted}`}>Helper text</span>
```

**Navigation:**
```tsx
<nav>
  <a className={`${isActive ? theme.navActive : theme.navInactive} ${theme.navHover}`}>
    Dashboard
  </a>
</nav>
```

---

## ❌ Anti-Patterns (Wrong → Right)

| Pattern | ❌ Wrong (Hardcoded) | ✅ Right (Theme Tokens) | Impact |
|---------|---------------------|------------------------|---------|
| **Primary Button** | `bg-bridezilla-pink text-white` | `${theme.primaryButton} ${theme.textOnPrimary}` | Breaks theme switching |
| **Secondary Button** | `bg-gray-100 text-gray-600` | `${theme.secondaryButton} ${theme.textSecondary}` | Wrong colors in Heirloom |
| **Card Background** | `bg-white` | `${theme.cardBackground}` | Not theme-aware |
| **Card Border** | `border border-gray-200` | `border ${theme.border}` | Wrong border color |
| **Heading Text** | `text-stone-900` | `${theme.textPrimary}` | Not semantic |
| **Body Text** | `text-gray-600` | `${theme.textSecondary}` | Wrong gray tone |
| **Helper Text** | `text-gray-400` | `${theme.textMuted}` | Not theme-aware |
| **Page Background** | `bg-stone-50` | `${theme.pageBackground}` | Wrong in Heirloom |
| **Active Nav** | `text-bridezilla-orange` | `${theme.navActive}` | Hardcoded color |
| **Inactive Nav** | `text-stone-500` | `${theme.navInactive}` | Not semantic |

### Common Mistake: Missing Import

```tsx
// ❌ WRONG - No theme hook
export default function Card() {
  return <div className="bg-white p-6">Content</div>
}

// ✅ RIGHT - Uses theme hook
'use client'
import { useThemeStyles } from '@/hooks/useThemeStyles'

export default function Card() {
  const theme = useThemeStyles()
  return <div className={`${theme.cardBackground} p-6`}>Content</div>
}
```

### Common Mistake: Mixing Tokens and Hardcoded

```tsx
// ❌ WRONG - Mixed approach
<button className={`${theme.primaryButton} text-white px-4 py-2`}>
  Save
</button>

// ✅ RIGHT - All tokens
<button className={`${theme.primaryButton} ${theme.textOnPrimary} px-4 py-2`}>
  Save
</button>
```

---

## 🎨 Component Patterns

### Buttons

**Primary Button:**
```tsx
const theme = useThemeStyles()

<button className={`${theme.primaryButton} ${theme.textOnPrimary}
                   ${theme.primaryButtonHover} px-4 py-2 rounded-lg
                   text-sm font-medium transition-colors`}>
  Save Changes
</button>
```

**Secondary Button:**
```tsx
<button className={`${theme.secondaryButton} ${theme.textSecondary}
                   ${theme.secondaryButtonHover} px-4 py-2 rounded-lg
                   text-sm font-medium transition-colors`}>
  Cancel
</button>
```

**Destructive Button (Exception - Fixed Color):**
```tsx
<button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm
                   font-medium hover:bg-red-700 transition-colors">
  Delete
</button>
```

**Icon Button:**
```tsx
import { Edit } from 'lucide-react'

<button className={`p-2 rounded-lg ${theme.textSecondary}
                   hover:bg-stone-100 transition-colors`}
        aria-label="Edit">
  <Edit className="w-4 h-4" />
</button>
```

### Cards

**Standard Card:**
```tsx
const theme = useThemeStyles()

<div className={`${theme.cardBackground} rounded-2xl p-6 border
                ${theme.border} ${theme.borderWidth} hover:shadow-lg
                transition-all`}>
  <h3 className={`text-lg font-semibold ${theme.textPrimary} mb-2`}>
    Card Title
  </h3>
  <p className={theme.textSecondary}>
    Card description text goes here
  </p>
</div>
```

**Stats Card:**
```tsx
const theme = useThemeStyles()

<div className={`${theme.cardBackground} rounded-2xl p-6 border
                ${theme.border} hover:shadow-sm transition-all`}>
  <div className="p-2 rounded-lg bg-emerald-50 inline-block mb-4">
    <CheckCircle className="w-5 h-5 text-emerald-600" />
  </div>
  <p className={`text-xs font-medium ${theme.textMuted} uppercase tracking-widest mb-2`}>
    Metric Name
  </p>
  <p className={`text-3xl font-semibold ${theme.textPrimary}`}>
    42
  </p>
</div>
```

### Modals

```tsx
const theme = useThemeStyles()

<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
  <div className={`${theme.cardBackground} rounded-2xl shadow-2xl
                  max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden`}>
    {/* Header */}
    <div className={`sticky top-0 ${theme.cardBackground} border-b
                    ${theme.border} px-6 py-4 flex items-center justify-between`}>
      <h2 className={`text-xl font-bold ${theme.textPrimary}`}>
        Modal Title
      </h2>
      <button className={`${theme.textSecondary} hover:${theme.textPrimary}`}>
        <X className="w-6 h-6" />
      </button>
    </div>

    {/* Content */}
    <div className="p-6">
      <p className={theme.textSecondary}>Modal content</p>
    </div>

    {/* Footer */}
    <div className={`border-t ${theme.border} px-6 py-4 flex gap-3 justify-end`}>
      <button className={`${theme.secondaryButton} ${theme.textSecondary}
                         ${theme.secondaryButtonHover} px-4 py-2 rounded-lg`}>
        Cancel
      </button>
      <button className={`${theme.primaryButton} ${theme.textOnPrimary}
                         ${theme.primaryButtonHover} px-4 py-2 rounded-lg`}>
        Confirm
      </button>
    </div>
  </div>
</div>
```

### Forms

**Input Field:**
```tsx
const theme = useThemeStyles()

<div>
  <label className={`block text-sm font-medium ${theme.textSecondary} mb-2`}>
    Field Label
  </label>
  <input
    type="text"
    className={`w-full px-4 py-2 border ${theme.border} rounded-lg
               ${theme.textPrimary} focus:outline-none focus:ring-2
               focus:ring-offset-0 transition-all`}
    placeholder="Enter value..."
  />
</div>
```

**Select Dropdown:**
```tsx
<select className={`w-full px-4 py-2 border ${theme.border} rounded-lg
                   ${theme.textPrimary} focus:outline-none focus:ring-2`}>
  <option>Option 1</option>
  <option>Option 2</option>
</select>
```

### Tables

```tsx
const theme = useThemeStyles()

<div className={`${theme.cardBackground} rounded-xl shadow-lg overflow-hidden`}>
  <table className="w-full">
    <thead className={`bg-stone-100 border-b ${theme.border}`}>
      <tr>
        <th className={`px-4 py-3 text-left text-xs font-bold
                       ${theme.textSecondary} uppercase tracking-wider`}>
          Name
        </th>
        <th className={`px-4 py-3 text-left text-xs font-bold
                       ${theme.textSecondary} uppercase tracking-wider`}>
          Status
        </th>
      </tr>
    </thead>
    <tbody className={`divide-y ${theme.border}`}>
      <tr className="hover:bg-stone-50 cursor-pointer transition-colors">
        <td className={`px-4 py-3 text-sm ${theme.textPrimary}`}>
          John Doe
        </td>
        <td className={`px-4 py-3 text-sm ${theme.textSecondary}`}>
          Active
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

### Navigation

```tsx
const theme = useThemeStyles()

<nav className="flex gap-6">
  <a
    className={`text-sm font-medium transition-colors ${
      isActive ? theme.navActive : theme.navInactive
    } ${theme.navHover}`}
  >
    Dashboard
  </a>
  <a
    className={`text-sm font-medium transition-colors ${
      isActive ? theme.navActive : theme.navInactive
    } ${theme.navHover}`}
  >
    Vendors
  </a>
</nav>
```

---

## 🖼️ Assets & Logos (Theme-Specific)

### Logo Usage by Theme

Bridezilla uses different logo variations for each theme:

| Theme | Logo File | Usage | Visual Style |
|-------|-----------|-------|--------------|
| **Pop** | `/images/bridezilla-logo-circle.svg` | Ask Bridezilla buttons, Pop theme UI | Pink circular logo with dinosaur |
| **Heirloom** | `/images/bridezilla-logo-simple.svg` | Ask Bridezilla buttons, Heirloom theme UI | Green simple dinosaur logo |

### Implementation Pattern

**Theme-Aware Logo Selection:**
```tsx
import { useTheme } from '@/contexts/ThemeContext'
import Image from 'next/image'

export default function YourComponent() {
  const { theme: currentTheme } = useTheme()

  return (
    <Image
      src={currentTheme === 'pop'
        ? '/images/bridezilla-logo-circle.svg'
        : '/images/bridezilla-logo-simple.svg'}
      alt="Bridezilla"
      width={32}
      height={32}
      className="object-contain"
    />
  )
}
```

### Ask Bridezilla Button Pattern

**Standard Implementation:**
```tsx
import { useTheme } from '@/contexts/ThemeContext'
import { useThemeStyles } from '@/hooks/useThemeStyles'
import Image from 'next/image'

export default function YourComponent() {
  const { theme: currentTheme } = useTheme()
  const theme = useThemeStyles()

  return (
    <button
      className={`flex items-center gap-2 px-6 py-2.5 ${theme.primaryButton} ${theme.primaryButtonHover} ${theme.textOnPrimary} rounded-xl text-sm font-medium transition-colors`}
    >
      <Image
        src={currentTheme === 'pop'
          ? '/images/bridezilla-logo-circle.svg'
          : '/images/bridezilla-logo-simple.svg'}
        alt="Bridezilla"
        width={24}
        height={24}
        className="object-contain"
      />
      <span>Ask Bridezilla</span>
    </button>
  )
}
```

**Why theme-specific logos?**
- Pop theme uses vibrant pink branding with circular logo
- Heirloom theme uses elegant green branding with simple logo
- Maintains visual consistency within each theme's design language

---

## 🎨 Status Badges (Fixed Colors - Don't Use Theme Tokens)

Status badges use **fixed colors** that stay consistent across themes:

| Status | Classes | Usage |
|--------|---------|-------|
| **Success/Complete** | `bg-emerald-50 text-emerald-700` | Signed, Paid, Attending, Booked |
| **Warning/Pending** | `bg-amber-50 text-amber-700` | Unsigned, Pending, Due Soon |
| **Neutral/Inactive** | `bg-stone-100 text-stone-600` | Not Required, Not Attending |
| **Error/Critical** | `bg-red-100 text-red-700` | Overdue, Error |
| **Urgent** | `bg-orange-100 text-orange-700` | Due Today |

**Example:**
```tsx
<span className="px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider
                 bg-emerald-50 text-emerald-700 border border-emerald-200">
  Booked & Confirmed
</span>
```

**Why fixed colors?** Status colors convey semantic meaning (green = good, red = error) that should be consistent across themes.

---

## 🔔 Notifications (Fixed Colors - Don't Use Theme Tokens)

Notifications use **fixed colors** that stay consistent across themes. They appear as toast-style alerts with subtle borders.

| Type | Background | Border | Icon & Text | Usage |
|------|-----------|--------|-------------|-------|
| **Success** | `bg-emerald-50` | `border-emerald-200` | `text-emerald-600/700` | Confirmations, completions |
| **Error** | `bg-red-50` | `border-red-200` | `text-red-600/900` | Errors, failures |
| **Warning** | `bg-yellow-50` | `border-yellow-200` | `text-yellow-600/700` | Warnings, cautions |
| **Info** | `bg-gray-50` | `border-gray-200` | `text-gray-600/700` | Information, tips |

**Styling Standards:**
- **Border width:** `border` (1px) - subtle, not bold
- **Border radius:** `rounded-xl` for soft appearance
- **Shadow:** `shadow-2xl` for elevated feel
- **Position:** `top-24` to clear navigation bar (h-16 mobile, h-20 desktop)
- **Z-index:** `z-[9999]` to appear above all content

**Typography:**
- **Title:** `text-sm font-bold uppercase tracking-widest` (follows helper text pattern, sized for visibility)
- **Message:** `text-sm` (regular weight, normal case)

**Example:**
```tsx
<div className="fixed top-24 right-4 z-[9999] max-w-md">
  <div className="bg-emerald-50 border-emerald-200 border rounded-xl shadow-2xl p-4 flex gap-3">
    <CheckCircle className="w-6 h-6 text-emerald-600" />
    <div className="flex-1">
      <h4 className="text-sm font-bold text-emerald-700 uppercase tracking-widest">Success</h4>
      <p className="text-sm text-emerald-700">Action completed successfully</p>
    </div>
  </div>
</div>
```

**Why fixed colors?** Like status badges, notification colors convey semantic meaning that should be consistent across themes.

---

## 🔍 Token Reference (Theme Mappings)

### Pop Theme (Pink/Orange)

| Token | Resolves To | Hex |
|-------|-------------|-----|
| `theme.pageBackground` | `bg-stone-50` | `#fafaf9` |
| `theme.cardBackground` | `bg-white` | `#ffffff` |
| `theme.primaryButton` | `bg-bridezilla-pink` | `#ec4899` |
| `theme.primaryButtonHover` | `hover:bg-bridezilla-orange` | `#f97316` |
| `theme.secondaryButton` | `bg-white border border-stone-200` | — |
| `theme.secondaryButtonHover` | `hover:bg-stone-50` | — |
| `theme.textPrimary` | `text-stone-900` | `#1c1917` |
| `theme.textSecondary` | `text-stone-600` | `#57534e` |
| `theme.textMuted` | `text-stone-400` | `#a8a29e` |
| `theme.textOnPrimary` | `text-white` | `#ffffff` |
| `theme.border` | `border-stone-200` | `#e7e5e4` |
| `theme.borderWidth` | `border` | 1px |
| `theme.navActive` | `text-bridezilla-orange` | `#f97316` |
| `theme.navInactive` | `text-stone-500` | `#78716c` |
| `theme.navHover` | `hover:text-stone-700` | `#44403c` |

### Heirloom Theme (Dark Green/Cream)

| Token | Resolves To | Hex |
|-------|-------------|-----|
| `theme.pageBackground` | `bg-[#FAF9F6]` | `#FAF9F6` |
| `theme.cardBackground` | `bg-white` | `#ffffff` |
| `theme.primaryButton` | `bg-[#1b3b2b]` | `#1b3b2b` |
| `theme.primaryButtonHover` | `hover:bg-[#2F5249]` | `#2F5249` |
| `theme.secondaryButton` | `bg-white border border-stone-200` | — |
| `theme.secondaryButtonHover` | `hover:bg-stone-50` | — |
| `theme.textPrimary` | `text-stone-900` | `#1c1917` |
| `theme.textSecondary` | `text-stone-600` | `#57534e` |
| `theme.textMuted` | `text-stone-400` | `#a8a29e` |
| `theme.textOnPrimary` | `text-white` | `#ffffff` |
| `theme.border` | `border-stone-200` | `#e7e5e4` |
| `theme.borderWidth` | `border` | 1px |
| `theme.navActive` | `text-[#B76E79]` | `#B76E79` |
| `theme.navInactive` | `text-stone-500` | `#78716c` |
| `theme.navHover` | `hover:text-stone-700` | `#44403c` |

### Route Behavior

| Route Type | Theme Behavior |
|------------|----------------|
| `/planner/*` | Pop OR Heirloom (user selectable) |
| `/admin/*` | Pop OR Heirloom (user selectable) |
| `/shared/*` | Heirloom ONLY (locked) |

**Both use same hook:** `const theme = useThemeStyles()`

---

## 📐 Typography

**Headings:**
- H1: `text-3xl font-display ${theme.textPrimary}`
- H2: `text-2xl font-display ${theme.textPrimary}`
- H3: `text-xl font-semibold ${theme.textPrimary}`
- H4: `text-lg font-semibold ${theme.textPrimary}`

**Body Text:**
- Default: `text-sm ${theme.textSecondary}`
- Large: `text-base ${theme.textSecondary}`

**Helper Text:**
- Small: `text-xs ${theme.textMuted}`
- Uppercase: `text-xs font-bold ${theme.textMuted} uppercase tracking-widest`

---

## 🎨 Theme Context (Implementation Details)

**Files:**
- Context: `contexts/ThemeContext.tsx`
- Hook: `hooks/useThemeStyles.ts`
- Definitions: `lib/themes.ts`

**Theme Switching:**
- Location: Settings tab in workspace
- Storage: localStorage (`bridezilla_planner_theme`)
- Default: Heirloom theme

**useThemeStyles Hook Logic:**
```tsx
export function useThemeStyles() {
  const { plannerTheme } = useTheme()
  const pathname = usePathname()

  // Wedding website always uses Heirloom
  if (pathname?.startsWith('/shared')) {
    return themes.heirloom
  }

  // Workspace uses selected theme
  return themes[plannerTheme]
}
```

---

## ✅ Pre-Commit Checklist

Before committing new components:

- [ ] Imported `useThemeStyles()` hook
- [ ] Added `'use client'` directive
- [ ] All colors use theme tokens (no hardcoded colors)
- [ ] Text uses semantic tokens (textPrimary/Secondary/Muted)
- [ ] Buttons use primary/secondary button tokens
- [ ] Borders use `${theme.border} ${theme.borderWidth}`
- [ ] Tested in both Pop and Heirloom themes
- [ ] Status badges use fixed colors (if applicable)

**Quick test:** Search your file for:
- `bg-bridezilla-pink` ❌
- `text-gray-` ❌
- `bg-stone-` (except status badges) ❌
- `border-gray-` ❌

If found, replace with theme tokens.

---

## 📧 Email Templates

**Component:** `components/planner/VendorInviteEmailTemplate.tsx`

Email templates require special handling since they use inline styles for email client compatibility and cannot rely on Tailwind CSS classes.

### Typography Requirements

**IMPORTANT:** Email templates must use only design system fonts:

- **Headings/Display Text:** `Playfair Display, Georgia, serif`
  - Logo text (BRIDEZILLA)
  - Greeting headings (Hi {coupleName}!)
  - Use `font-display` equivalent

- **Body Text:** `Nunito, -apple-system, BlinkMacSystemFont, sans-serif`
  - All paragraphs
  - List items
  - Button text
  - Helper text
  - Use `font-sans` equivalent

**Never use:**
- ❌ Bebas Neue (not part of documented design system)
- ❌ Inter (not the default body font)
- ❌ Any fonts not loaded in `app/layout.tsx`

### Colour Palette

**Heirloom Theme (Email Default):**
```tsx
backgroundColor: '#1b3b2b'  // Dark green header
backgroundColor: '#fafaf9'  // Light stone boxes
borderColor: '#e7e5e4'      // Stone borders
color: '#111827'            // Primary text
color: '#374151'            // Secondary text
color: '#57534e'            // Muted text
color: 'white'              // Text on dark backgrounds
```

### Email Template Pattern

```tsx
// ✅ CORRECT - Uses design system fonts
<div style={{
  fontFamily: 'Nunito, -apple-system, BlinkMacSystemFont, sans-serif',
  fontSize: '1rem',
  color: '#374151',
  lineHeight: '1.625'
}}>
  Body text content
</div>

<h2 style={{
  fontFamily: '"Playfair Display", Georgia, serif',
  fontSize: '1.875rem',
  fontWeight: '600',
  color: '#111827'
}}>
  Heading Text
</h2>
```

```tsx
// ❌ WRONG - Uses non-design-system fonts
<div style={{
  fontFamily: 'Inter, sans-serif'  // ❌ Wrong font
}}>
  Body text
</div>

<h2 style={{
  fontFamily: '"Bebas Neue", Arial, sans-serif'  // ❌ Not in design system
}}>
  Heading
</h2>
```

### Why Inline Styles?

Email clients don't support:
- External stylesheets
- CSS classes (including Tailwind)
- CSS variables
- Modern CSS features

Therefore:
- Use inline `style` attributes for all styling
- Include complete font stacks with fallbacks
- Use hex colours instead of theme tokens
- Test in multiple email clients (Gmail, Outlook, Apple Mail)

### Testing Email Templates

1. **Preview in browser** (EmailPreviewModal component)
2. **Send test email** to yourself
3. **Check in multiple clients:**
   - Gmail (web + mobile)
   - Apple Mail
   - Outlook
4. **Verify fonts render correctly** with fallbacks

---

## 📝 Changelog

**v3.1 (Feb 11, 2026)** - Email Template Documentation
- Added Email Templates section with font requirements
- Documented use of Playfair Display for headings, Nunito for body text
- Added inline styles guidance for email client compatibility
- Clarified fonts NOT to use (Bebas Neue, Inter)

**v3.0 (Feb 11, 2026)** - Optimized for Claude Code
- Reduced from 1,757 to ~600 lines (65% reduction)
- Front-loaded Quick Reference section
- Added Anti-Patterns comparison table
- Removed redundant explanations
- Consolidated examples (one per pattern)
- Optimized for LLM parsing

**v2.9.1 (Feb 11, 2026)** - Theme Token Guidance Restructured
**v2.9 (Feb 10, 2026)** - Google Maps Integration
**v2.8** - Payment & Dropdown Improvements
**v2.6** - Status Pill Redesign

---

**Maintained by:** Bridezilla Design System Team
**For questions:** Reference this document or check `/lib/themes.ts`
