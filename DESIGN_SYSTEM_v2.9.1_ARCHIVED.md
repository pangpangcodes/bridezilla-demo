# Bridezilla Demo - Design System

**Last Updated:** February 10, 2026
**Version:** 2.9 (Google Maps autocomplete for location inputs)

---

## 🆕 What's New in v2.9

### Location Input with Google Maps Integration
**Implemented:** All location input fields now feature enhanced UX with direct Google Maps linking (no API required):
- **MapPin icon (left):** Visual indicator for location context
- **ExternalLink icon (right):** Appears when location entered, opens Google Maps search in new tab
- **Manual text entry:** Users type location manually (e.g., "Marbella, Spain")
- **Inline action:** ExternalLink icon positioned inside input on right (follows design system pattern)
- **No API dependencies:** Uses public Google Maps search URL - no API key or setup required
- **Security:** Opens in new tab with `noopener,noreferrer`

**Files Updated:**
- `components/LocationAutocompleteInput.tsx` (NEW) - Reusable location input component
- `components/planner/InviteCoupleModal.tsx` - Updated wedding_location input
- `components/planner/CoupleDetail.tsx` - Updated wedding_location input in edit modal

**Component Interface:**
```tsx
interface LocationAutocompleteInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  required?: boolean
  id?: string
  name?: string
}
```

**Usage Example:**
```tsx
import LocationAutocompleteInput from '@/components/LocationAutocompleteInput'

// In your component:
<LocationAutocompleteInput
  id="wedding_location"
  name="wedding_location"
  value={formData.wedding_location}
  onChange={(value) => setFormData(prev => ({ ...prev, wedding_location: value }))}
  placeholder="e.g., Marbella, Spain"
/>
```

**How "View on Google Maps" Works:**
```tsx
// Opens public Google Maps search URL (no API key needed)
https://www.google.com/maps/search/?api=1&query=Marbella%2C%20Spain
```

**Design Rationale:**
- No API setup or costs - works immediately
- Clean, simple UX for location entry
- Users already know their venue location - don't need autocomplete suggestions
- Instant verification via Google Maps link
- MapPin icon provides clear visual affordance

### Clickable Locations in List Views
**Implemented:** Location text in couples list view is now clickable to open Google Maps:
- **Clickable location text:** Wedding location links directly to Google Maps search
- **Subtle styling:** Follows email link pattern with `hover:underline` and `hover:text-stone-900`
- **No extra icons:** Clean text-only link, no external link icon clutter
- **Opens in new tab:** Uses `target="_blank"` with `rel="noopener noreferrer"` for security
- **Stops propagation:** Clicking location doesn't expand/collapse the row

**Files Updated:**
- `components/planner/CoupleTableRow.tsx` - Made location text clickable (lines 281-295)

**Pattern:**
```tsx
<a
  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`}
  target="_blank"
  rel="noopener noreferrer"
  onClick={(e) => e.stopPropagation()}
  className={`${theme.textSecondary} hover:text-stone-900 hover:underline transition-colors`}
>
  {location}
</a>
```

**Design Rationale:**
- Follows existing design system pattern (same as email links)
- Subtle affordance - looks like normal text until hover
- No visual clutter from extra icons
- Consistent with modern table design patterns
- One-click access to verify venue location

### View Toggle Simplification
**Implemented:** Calendar/List view toggle simplified to icon-only buttons:
- **Icon-only buttons:** Removed "Calendar" and "List" text labels
- **Larger icons:** Increased from 16px to 18px for better visibility
- **Square buttons:** Changed from `px-3 py-1.5` to `p-2` for balanced square shape
- **Centered icons:** Added `justify-center` for perfect icon centering
- **Accessibility:** Added `title` and `aria-label` attributes for screen readers
- **Same toggle behavior:** Selected state still shows background and shadow

**Files Updated:**
- `components/planner/CouplesCalendarView.tsx` - Simplified view toggle (lines 450-473)

**Pattern:**
```tsx
<button
  onClick={() => setDisplayMode('calendar')}
  className={`flex items-center justify-center p-2 rounded-md transition-all ${
    displayMode === 'calendar'
      ? `${theme.cardBackground} ${theme.textPrimary} shadow-sm`
      : `${theme.textSecondary} hover:${theme.textPrimary}`
  }`}
  title="Calendar view"
  aria-label="Calendar view"
>
  <CalendarIcon size={18} />
</button>
```

**Design Rationale:**
- More compact, cleaner UI
- Icons are universally recognizable (Calendar = calendar view, List = list view)
- Follows modern app patterns (icon-only view toggles)
- Reduces visual noise in header area
- Maintains clear selected/unselected states

### Command+Click Support for Navigation Tabs
**Implemented:** All navigation tabs now support Command+Click (Mac) / Ctrl+Click (Windows) to open in new tabs:
- **Converted buttons to anchor tags:** Navigation items now use `<a href>` with proper URLs
- **Preserved SPA behavior:** Click handlers prevent default and call state management functions
- **Proper URLs:** Each view has its own query parameter URL (e.g., `/planner?view=vendors`)
- **Works in both workspaces:** Admin (`/admin?view=`) and Planner (`/planner?view=`)
- **Desktop and mobile:** Updated both desktop navigation and mobile menu items

**Files Updated:**
- `components/planner/PlannerNavigation.tsx` - Converted nav buttons to anchors (desktop + mobile)
- `components/admin/AdminNavigation.tsx` - Converted nav buttons to anchors (desktop + mobile)

**Pattern:**
```tsx
<a
  href="/planner?view=vendors"
  onClick={(e) => {
    e.preventDefault()
    onViewChange('vendors')
  }}
  className={`transition-colors ${
    currentView === 'vendors' ? theme.navActive : theme.navInactive
  }`}
>
  Vendors
</a>
```

**How It Works:**
1. **Normal click:** `e.preventDefault()` stops navigation, calls `onViewChange()` for SPA behavior
2. **Command+Click:** Browser opens link in new tab using the `href` URL
3. **URL syncing:** `handleViewChange` updates URL with `window.history.pushState()`
4. **Deep linking:** URLs like `/planner?view=vendors` work on page load

**Design Rationale:**
- Enables native browser behavior for power users
- Supports opening multiple workspace views simultaneously
- Maintains single-page app performance for normal clicks
- Proper semantic HTML improves accessibility
- URLs are shareable and bookmarkable

**Navigation Label Simplification:**
- Changed "Couples Calendar" → "Couples" (navigation + page headers)
- Changed "Vendor Library" → "Vendors" (navigation + page headers)
- Shorter labels reduce visual clutter
- Still clear and descriptive
- Updated in PlannerNavigation and PlannerDashboard page headers

### Search Bar Placeholder Standardization
**Implemented:** All search bar placeholders now follow consistent "Search [noun]..." format:
- **CouplesCalendarView:** Changed from `"Search by couple name, email, or venue..."` to `"Search couples..."`
- **SelectVendorsModal:** Changed from `"Search vendors by name, location, or tags..."` to `"Search vendors..."`
- **VendorLibraryTab:** Already correct with `"Search vendors..."`
- **SearchableMultiSelect:** Kept generic `"Search..."` for reusable component

**Files Updated:**
- `components/planner/CouplesCalendarView.tsx` - Updated search placeholder (line 482)
- `components/planner/SelectVendorsModal.tsx` - Updated search placeholder (line 154)

**Design Pattern:**
```tsx
// Consistent format: "Search [plural noun]..."
placeholder="Search couples..."
placeholder="Search vendors..."
placeholder="Search..."  // For generic/reusable components
```

**Design Rationale:**
- Shorter, cleaner placeholder text reduces visual clutter
- Consistent format across both workspaces improves UX predictability
- Users already understand search functionality - detailed hints are redundant
- Follows modern UI patterns (Gmail: "Search mail", Slack: "Search...")

### Dashboard Countdown Improvements
**Implemented:** Enhanced wedding countdown message for better clarity and urgency:
- **Text update:** Changed from `"You have {X} days until your wedding in Seville."` to `"Only {X} days until your wedding in Seville on September 20, 2026."`
- **Improved urgency:** "Only" creates stronger emotional engagement than "You have"
- **Added date specificity:** Including the actual wedding date provides immediate context

**Files Updated:**
- `components/admin/DashboardTab.tsx` - Updated countdown text (line 192)

**Design Rationale:**
- "Only" emphasizes time scarcity and encourages action
- Specific date provides clear reference point without requiring users to calculate
- More personal and engaging tone aligns with wedding planning excitement

---

## 🆕 What's New in v2.8

### Payment Amount Color Standardization
**Implemented:** Fixed vendor payment amount colors to follow design system semantic color palette:
- **Paid amounts:** Changed from `text-green-600` to `text-emerald-700` (matches emerald semantic color for positive/complete states)
- **Outstanding amounts:** Changed from `text-red-600` to `text-red-700` (matches red semantic color for critical/outstanding states)
- **Applies to:** PAID and OUTSTANDING columns in admin VendorsTab

```tsx
// Paid amounts - use emerald-700
<div className="font-medium text-emerald-700">
  {formatCurrency(totalPaid, currency)} {currency}
</div>

// Outstanding amounts - use red-700
<div className="font-medium text-red-700">
  {formatCurrency(totalOutstanding, currency)} {currency}
</div>
```

**Files Updated:**
- `components/admin/VendorsTab.tsx` - Updated payment amount colors (2 locations for paid, 2 for outstanding)

**Design Rationale:** Aligns with v2.6 status pill color system where emerald represents positive/complete states and red represents critical states. Provides visual consistency across all admin monetary displays.

### Dropdown Scroll Preservation (Two-Part Fix)
**Implemented:** Fixed SearchableMultiSelect to preserve scroll position at two levels:

**Part 1: Internal Dropdown Scroll**
- **Scroll position preservation:** Dropdown maintains scroll position when toggling options (no jumping within dropdown)
- **Mouse focus stability:** Selected option stays under cursor after click (no focal point movement)
- **Implementation:** Uses ref to track scroll container + `requestAnimationFrame` to restore position after state updates
- **Event prevention:** Added `e.preventDefault()` to prevent default browser behavior that causes scroll jumps

```tsx
// In SearchableMultiSelect.tsx
const toggleOption = (value: string, e?: React.MouseEvent) => {
  e?.preventDefault()
  const scrollPosition = optionsListRef.current?.scrollTop || 0

  // Update state...

  requestAnimationFrame(() => {
    if (optionsListRef.current) {
      optionsListRef.current.scrollTop = scrollPosition
    }
  })
}
```

**Part 2: Page Scroll Preservation**
- **Fixed page jump issue:** When making a dropdown selection, page no longer scrolls back to top
- **Wrapper handlers:** Each component using SearchableMultiSelect wraps onChange with scroll preservation
- **Implementation:** Captures window scroll position before filter changes, restores after React re-renders

```tsx
// In parent components (VendorLibraryTab, VendorsTab, CouplesCalendarView)
const preserveScrollPosition = () => {
  const scrollY = window.scrollY
  requestAnimationFrame(() => {
    window.scrollTo(0, scrollY)
  })
}

const handleFilterChange = (values: string[]) => {
  preserveScrollPosition()
  setFilterState(values)
}

<SearchableMultiSelect
  onChange={handleFilterChange} // Use wrapper, not direct setState
/>
```

**Files Updated:**
- `components/SearchableMultiSelect.tsx` - Added internal dropdown scroll preservation
- `components/planner/VendorLibraryTab.tsx` - Added page scroll preservation for type/tag filters
- `components/admin/VendorsTab.tsx` - Added page scroll preservation for type filter
- `components/planner/CouplesCalendarView.tsx` - Added page scroll preservation for venue filter

**Design Pattern:**
When implementing filters with SearchableMultiSelect, always:
1. Create a `preserveScrollPosition()` helper
2. Wrap filter state setters in handler functions that call `preserveScrollPosition()` first
3. Use wrapper handlers in SearchableMultiSelect `onChange` props (not direct state setters)

### Checkbox Pattern Standardization
**Implemented:** All checkboxes now use consistent, neutral styling:
- **Size:** `w-4 h-4` (16px × 16px)
- **Border:** `border border-stone-300` (1px neutral gray)
- **Checkmark:** `w-3 h-3` with `strokeWidth={2}` for subtle appearance
- **Colors:** Neutral stone colors, not theme-aware
- **Checkmark color:** `text-stone-600` (medium gray)

```tsx
<div className="flex-shrink-0 w-4 h-4 border border-stone-300 rounded flex items-center justify-center">
  {isSelected && (
    <Check className="w-3 h-3 text-stone-600" strokeWidth={2} />
  )}
</div>
```

**Files Updated:**
- `components/planner/SelectVendorsModal.tsx` - Vendor selection checkboxes
- `components/SearchableMultiSelect.tsx` - Filter dropdown checkboxes

### Modal Improvements
**Enhanced modal backdrop and rendering:**
- **Stronger backdrop:** `bg-black/80 backdrop-blur-lg` (80% opacity, 24px blur)
- **Portal rendering:** All modals now use `createPortal(modalContent, document.body)` for proper z-index stacking
- **Safari support:** Added `WebkitBackdropFilter: 'blur(20px)'` inline style
- **Body scroll lock:** All modals prevent body scrolling with `document.body.style.overflow = 'hidden'`
- **Proper z-index:** Modals use `z-[100]` (standard) or `z-[110]` (stacked) to float above navigation (`z-40`)

**Files Updated:**
- `components/planner/SelectVendorsModal.tsx`
- `components/planner/EmailPreviewModal.tsx`
- All admin and planner modal components

### Email Template Fixes
**VendorInviteEmailTemplate improvements:**
- **Fixed logo display:** Now shows Bridezilla logo with text branding
- **Added planner name:** Email shows "Your planner at [Name] has curated..." and displays planner name in footer
- **Heirloom theme:** Email consistently uses Heirloom colors (dark green `#1b3b2b`) for professional branding
- **Theme-aware info box:** Preview modal info box uses theme colors (no more blue)

**Files Updated:**
- `components/planner/VendorInviteEmailTemplate.tsx`
- `components/planner/EmailPreviewModal.tsx`

---

## 🆕 What's New in v2.6

### Admin Status Pill Color Redesign
**Implemented:** All admin status pills now use the elegant EverAfter design system colors:
- **Emerald** (`bg-emerald-50 text-emerald-700`) - Positive/Complete states (Signed, Paid, Attending, High confidence)
- **Amber** (`bg-amber-50 text-amber-700`) - Warning/Pending states (Unsigned, Pending, Medium confidence, Due Soon)
- **Stone** (`bg-stone-100 text-stone-600`) - Neutral states (Not Required, Not Attending)
- **Red** (`bg-red-100 text-red-700`) - Critical states (Overdue, Low confidence) - unchanged
- **Orange** (`bg-orange-100 text-orange-700`) - Urgent warnings (Due Today) - unchanged

**Files Updated:**
- `components/admin/RSVPTab.tsx` - RSVP attendance status pills
- `components/admin/VendorsTab.tsx` - Contract status, deposit status, and payment status pills (3 locations)
- `components/admin/ConfidenceBadge.tsx` - AI confidence score badges
- `components/admin/DashboardTab.tsx` - Payment reminder badges

**Design Rationale:** The new colors provide a more sophisticated, elegant aesthetic matching the EverAfter reference design while maintaining semantic clarity and visual hierarchy.

### Navigation Improvements
- **Added "View Website" link** to admin navigation (positioned next to BRIDEZILLA logo with ExternalLink icon)
- Opens in new tab (`target="_blank"` with `rel="noopener noreferrer"`) for seamless workspace preservation
- Provides easy navigation from admin workspace back to wedding website homepage
- Available on both desktop and mobile navigation
- **File Updated:** `components/admin/AdminNavigation.tsx`

### Animated Hearts Fix
- Fixed animated hearts display on admin page by moving `AnimatedHearts` component to proper location inside `AdminDashboard`
- Hearts now properly float in background matching planner page behavior
- **Files Updated:** `app/admin/page.tsx`, `components/AdminDashboard.tsx`

### Settings Page Refinements
**Improved theme selection UI across both admin and planner workspaces:**
- Removed duplicate "Settings" header (now uses page-level header from parent dashboard)
- Changed from large aspect-video preview cards to compact horizontal cards with icons
- Added Palette icon from lucide-react displayed in theme-colored circles
- Added Check icon indicator showing currently selected theme
- Added color swatch display showing actual theme colors (2 color circles per theme)
- More responsive and visually elegant design

**Files Updated:**
- `components/admin/SettingsTab.tsx`
- `components/planner/SettingsTab.tsx`

### SearchableMultiSelect Component Improvements
**Fixed nested button hydration error and improved visual design:**
- **Fixed React hydration error:** Replaced nested clear button with div element to eliminate "button cannot be descendant of button" error
- **Improved checkbox design:** Moved selection indicators from end (pink checkmarks) to beginning (neutral checkboxes)
- **Better visual alignment:** Checkboxes at the start of each option create cleaner, more organized appearance
- **Neutral colors:** Checkbox borders use stone-300, checkmarks use stone-700 (removed pink accent from dropdown options)
- **Wider dropdown:** Added `min-w-[280px]` to prevent text truncation and improve readability
- **Better spacing:** Increased padding throughout for less cluttered appearance:
  - Search input section: `p-4` (was `p-3`)
  - Select/Clear All section: `px-4 py-3` (was `p-2`)
  - Buttons: `px-3 py-2 text-sm` (was `px-3 py-1.5 text-xs`)
  - Option items: `py-3` (was `py-2.5`)
- **Single-line buttons:** Select All and Clear All buttons stay on one line with `whitespace-nowrap`
- **Better button styling:** Increased button size to `text-sm` and `rounded-lg` for more modern appearance

**Technical Details:**
- Clear button changed from `<button>` to `<div role="button">` to prevent nesting
- Checkbox indicator: `w-4 h-4 border-2 border-stone-300 rounded` with `Check` icon inside when selected
- Selected state uses `font-medium text-stone-900`, unselected uses `text-stone-700`
- Dropdown width: `min-w-[280px] w-full` (minimum 280px, expands with trigger width)
- Option text uses `min-w-0` to prevent overflow issues with long labels

**Files Updated:**
- `components/SearchableMultiSelect.tsx`

### Email Template Standardization
**All email templates now use Heirloom theme colors for consistency and elegance:**
- **Header background:** Changed from pink-to-orange gradient to solid Heirloom dark green (#1b3b2b)
- **Checkmarks:** Changed from pink (`text-bridezilla-pink`) to dark green (#1b3b2b)
- **CTA button:** Changed from pink-to-orange gradient to solid dark green (#1b3b2b)
- **Design philosophy:** All email templates use Heirloom theme for sophistication and universal appeal, regardless of workspace theme preference

**Benefits:**
- Elegant, professional appearance in all email communications
- Consistent branding across all planner-to-couple interactions
- Timeless dark green palette works for all wedding styles
- No theme switching needed - simplified approach

**Files Updated:**
- `components/planner/VendorInviteEmailTemplate.tsx`

### Email Preview Modal Improvements
**Fixed header visibility issues:**
- Added `rounded-t-2xl` to modal header to ensure proper visibility and matching border radius
- Added `border border-stone-200` to modal container for better definition
- Header now fully visible and properly styled across all viewport sizes

**Files Updated:**
- `components/planner/EmailPreviewModal.tsx`

---

## 🎨 Two Separate Design Systems

This document covers **TWO DISTINCT** design systems that must never be mixed:

### 1️⃣ **Workspace Design System** (Admin & Planner)
- **Applies to:** `/admin` and `/planner` routes only
- **Primary Color:** Pink (`bridezilla-pink` / `#ec4899`)
- **Purpose:** Professional workspace for couples and planners
- **Theme:** Modern, energetic, branded

### 2️⃣ **Wedding Website Design System** (Public Pages)
- **Applies to:** `/`, `/itinerary`, `/accommodation`, `/travel`, `/rsvp`, `/faq`
- **Primary Color:** Green (`primary-*` / green shades)
- **Purpose:** Elegant wedding website for guests
- **Theme:** Romantic, natural, sophisticated

---

## 🎨 Workspace Themes: Pop vs Heirloom

The **planner workspace** (`/planner` routes) supports **two visual themes** that planners can switch between based on their preferences:

### 🎈 Pop Theme
- **Mood:** Fun, energetic, playful
- **Colours:** Bright blue background with pink and orange accents
- **Best for:** Planners working on modern, contemporary weddings who prefer a vibrant, energetic interface

### 🏛️ Heirloom Theme (Default)
- **Mood:** Elegant, sophisticated, timeless
- **Colours:** Warm cream background with dark forest green and dusty rose accents
- **Best for:** Planners working on traditional, formal weddings who prefer a calm, refined interface

### Theme Switching
- **Location:** Settings tab in planner workspace
- **Persistence:** Theme choice is saved to localStorage
- **Default:** Heirloom is the default theme
- **Shared Page Exception:** The shared page (`/shared`) always uses Heirloom theme regardless of planner's theme choice (couples cannot change this)

### Implementation
Themes are implemented via:
- **Context:** `ThemeContext.tsx` - Manages theme state and localStorage
- **Hook:** `useThemeStyles()` - Returns current theme's style tokens
- **Definition:** `lib/themes.ts` - Contains both theme specifications

**Note:** Both themes share the same layout patterns, typography, and component structures—only colours differ. See detailed documentation in the Workspace Design System section below.

---

## ⚠️ CRITICAL RULES

### Workspace (Admin/Planner Routes)
- ✅ **USE** `bridezilla-pink`, `bridezilla-orange`, `bridezilla-light-pink`
- ✅ **USE** pink for buttons, hover states, accents
- ✅ **USE** compact tables (`px-2 py-3`)
- ✅ **USE** workspace-specific patterns (stats cards, controls)
- ❌ **NEVER** use green theme colors
- ❌ **NEVER** apply wedding website styles

### Wedding Website (Public Routes)
- ✅ **USE** `primary-*` colors (green scale: `primary-500`, `primary-600`, etc.)
- ✅ **USE** `green-*` colors for backgrounds (`green-50`, `green-100`)
- ✅ **USE** green for buttons, hover states, accents
- ✅ **USE** wedding-appropriate fonts (`font-display` for headings)
- ❌ **NEVER** use `bridezilla-pink`, `bridezilla-orange`, or any pink colors
- ❌ **NEVER** apply workspace styles

---

## 🌿 Wedding Website Design System

### Color Palette

**Primary Colors (Green):**
```typescript
primary: {
  50: '#f0fdf4',   // Lightest - backgrounds
  100: '#dcfce7',  // Light backgrounds
  200: '#bbf7d0',  // Subtle accents
  300: '#86efac',  // Soft highlights
  400: '#4ade80',  // Medium green
  500: '#22c55e',  // Base green
  600: '#16a34a',  // Primary actions, hover states
  700: '#15803d',  // Dark accents
  800: '#166534',  // Darker text
  900: '#14532d',  // Darkest
}
```

**Usage:**
- **Backgrounds:** `bg-gradient-to-b from-green-50 via-green-100/50 to-green-50`
- **Buttons:** `bg-primary-600 hover:bg-primary-700`
- **Links:** `text-primary-600 hover:text-primary-700`
- **Focus states:** `focus:ring-primary-500`
- **Icons:** `text-primary-600`

**Accent Colors:**
- **Red (accent):** For urgency/alerts
- **Yellow:** For warnings
- **Gray:** For text hierarchy and borders

### Typography

**Font Families:**
```css
font-display: 'Playfair Display', Georgia, serif  /* Elegant headings */
font-sans: 'Nunito', system-ui, sans-serif        /* Body text */
```

**Heading Hierarchy:**
- **Hero/Main Title:** `text-4xl md:text-6xl font-display font-bold`
- **Section Headings:** `text-3xl md:text-4xl font-display font-bold`
- **Subsections:** `text-2xl md:text-3xl font-display`
- **Body:** `text-base md:text-lg font-sans`

### Buttons

**Primary Button (Green):**
```tsx
className="px-6 py-3 bg-primary-600 text-white rounded-full font-semibold
           hover:bg-primary-700 transition-colors"
```

**Secondary Button (Green Outline):**
```tsx
className="px-6 py-3 border-2 border-primary-600 text-primary-600 rounded-full
           font-semibold hover:bg-primary-50 transition-colors"
```

**Usage:**
- Use for RSVP forms, contact buttons, navigation CTAs
- Always use green (`primary-600`), never pink
- Rounded full (`rounded-full`) for soft, friendly appearance

### Layout

**Page Background:**
```tsx
className="min-h-screen bg-gradient-to-b from-green-50 via-green-100/50 to-green-50 relative"
```

**Content Sections:**
```tsx
className="container mx-auto px-4 py-12 md:py-16"
```

**Cards:**
```tsx
className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 md:p-8"
```

### Navigation

**Logo:**
```tsx
<a href="/" className="text-4xl font-display font-bold text-gray-900 hover:text-primary-600">
  B & E
</a>
```

**Nav Links:**
```tsx
<a href="/itinerary" className="text-gray-700 hover:text-primary-600 transition-colors">
  Itinerary
</a>
```

**Mobile Menu Button:**
```tsx
<button className="px-6 py-2 bg-green-200 text-gray-900 rounded-full font-semibold
                   hover:bg-green-300 transition-colors">
  Contact Us
</button>
```

### Forms (RSVP, Contact)

**Input Fields:**
```tsx
className="w-full px-4 py-3 border border-gray-300 rounded-lg
           focus:ring-2 focus:ring-primary-500 focus:border-transparent"
```

**Focus States:**
- Always use `focus:ring-primary-500` (green)
- Never use pink focus rings on wedding website

**Submit Buttons:**
```tsx
className="w-full px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold
           hover:bg-primary-700 transition-colors"
```

### Icons & Decorative Elements

**Icon Color:**
```tsx
<Heart className="w-6 h-6 text-primary-600" />
<Calendar className="w-6 h-6 text-primary-600" />
```

**Animated Hearts:**
- Use subtle, elegant animations
- Green-tinted (`text-primary-200` to `text-primary-400`)

### Spacing & Rhythm

**Section Spacing:**
- Desktop: `py-12 md:py-16 lg:py-20`
- Mobile: `py-8 md:py-12`

**Content Padding:**
- Container: `px-4 md:px-6`
- Cards: `p-6 md:p-8`

### Consistency Rules

**Wedding Website Must:**
- ✅ Use green (`primary-*`) for all interactive elements
- ✅ Use `font-display` (Playfair) for elegant headings
- ✅ Use soft, rounded corners (`rounded-2xl`, `rounded-full`)
- ✅ Use gradient green backgrounds
- ✅ Maintain romantic, sophisticated aesthetic
- ✅ Use generous spacing and whitespace
- ❌ **NEVER use pink colors**
- ❌ **NEVER use workspace styles**
- ❌ **NEVER use compact workspace layouts**

---

# 💼 Workspace Design System (Admin & Planner)

## ⚠️ This section applies ONLY to workspace routes

**Routes:** `/admin/*` and `/planner/*`

**Note:** The `/planner` routes support two themes (Pop and Heirloom) that planners can switch between. Both themes use the same layout patterns and component structures documented in this section—only the colours differ. See theme-specific colour documentation below.

---

## 🎈 Pop Theme (Planner Workspace)

Pop is the bright, energetic theme for the planner workspace. It features a vibrant blue background with pink and orange accents, creating a fun and modern aesthetic perfect for planners working on contemporary, playful weddings.

### Colour Palette

**Page Background:**
- **Class:** `bg-bridezilla-blue`
- **Hex:** `#5B9BD5` (Bright sky blue)
- **Usage:** Main page backdrop for all planner views
- **Purpose:** Creates energetic, modern atmosphere
- **Example:** Applied to `<main>` container wrapping entire planner workspace

**Card Background:**
- **Class:** `bg-white`
- **Usage:** All cards, modals, dropdowns, tables
- **Pairing:** Always use with `border border-stone-200` for definition

**Primary Button:**
- **Class:** `bg-bridezilla-pink`
- **Hex:** `#ec4899` (Hot pink)
- **Usage:** Main CTAs (Save, Submit, Add, Create, Update)
- **Text Colour:** `text-white` (`textOnPrimary`)
- **Hover State:** `hover:bg-bridezilla-orange` (`#f97316` - orange)
- **Border Radius:** `rounded-lg` for rectangular buttons, `rounded-full` for pill buttons
- **Transition:** `transition-colors` for smooth colour change on hover

**Secondary Button:**
- **Class:** `bg-white border border-stone-200`
- **Usage:** Secondary actions (Cancel, Back, Close)
- **Text Colour:** `text-stone-900` (`textPrimary`)
- **Hover State:** `hover:bg-stone-50` (`secondaryButtonHover`)
- **Border Radius:** `rounded-lg`

**Navigation Active State:**
- **Class:** `text-bridezilla-orange`
- **Hex:** `#f97316` (Bright orange)
- **Usage:** Active tab/nav indicator in sidebar or navigation
- **Purpose:** Creates clear visual hierarchy to show current page

**Navigation Inactive/Hover:**
- **Inactive:** `text-stone-500` - Muted gray for unselected items
- **Hover:** `hover:text-stone-700` - Darker gray on hover

**Text Hierarchy:**
- **Primary:** `text-stone-900` - Headings, labels, body text, primary content
- **Secondary:** `text-stone-600` - Subtext, descriptions, helper text, supporting content
- **Muted:** `text-stone-400` - Placeholders, disabled text, subtle borders
- **On Primary:** `text-white` - Text on pink buttons or coloured backgrounds

**Status Badges (EverAfter Palette - v2.6 Update):**
- **Positive/Complete:** `bg-emerald-50` background with `text-emerald-700` text (Signed, Paid, Attending, High confidence)
- **Warning/Pending:** `bg-amber-50` background with `text-amber-700` text (Unsigned, Pending, Medium confidence, Due Soon)
- **Neutral/Inactive:** `bg-stone-100` background with `text-stone-600` text (Not Required, Not Attending)
- **Critical/Error:** `bg-red-100` background with `text-red-700` text (Overdue, Low confidence)
- **Urgent Warning:** `bg-orange-100` background with `text-orange-700` text (Due Today)

**Design Philosophy:** Status colors follow EverAfter's sophisticated emerald/amber/stone palette for elegant visual hierarchy while maintaining semantic clarity.

### Button Examples

```tsx
// Primary Button (Pink with orange hover)
<button
  className={`px-4 py-2 ${theme.primaryButton} ${theme.textOnPrimary}
              ${theme.primaryButtonHover} rounded-lg font-medium
              transition-colors`}
>
  Save Changes
</button>

// Secondary Button (White with gray hover)
<button
  className={`px-4 py-2 ${theme.secondaryButton} ${theme.textPrimary}
              ${theme.secondaryButtonHover} rounded-lg font-medium
              transition-colors`}
>
  Cancel
</button>

// Tertiary/Text Button
<button
  className={`${theme.textSecondary} hover:${theme.textPrimary}
              transition-colors font-medium`}
>
  Learn More
</button>
```

### Layout Patterns

```tsx
// Page Container with blue background and animated hearts
<main className={`${theme.pageBackground} min-h-screen relative`}>
  <AnimatedHearts /> {/* Pink/orange hearts floating on blue */}
  <div className="relative z-10 container mx-auto px-4 py-8">
    {/* Page content */}
  </div>
</main>

// Card Component
<div className={`${theme.cardBackground} ${theme.border}
                 ${theme.borderWidth} rounded-2xl p-6 shadow-lg`}>
  <h3 className={theme.textPrimary}>Card Title</h3>
  <p className={theme.textSecondary}>Card description</p>
</div>

// Section Header
<h4 className={`text-xs font-semibold ${theme.textSecondary}
                uppercase tracking-wide mb-2`}>
  Section Title
</h4>
```

### Visual Characteristics

**Mood & Personality:**
- **Energetic:** Bright blue creates vibrancy and movement
- **Playful:** Pink and orange accents add fun, modern touch
- **Contemporary:** Bold colour choices feel current and fresh
- **Optimistic:** Bright colours convey excitement and positivity

**When to Use Pop:**
- Planners working on modern, contemporary weddings
- Users who prefer bright, energetic interfaces
- Fun, casual wedding styles
- Planners who want workspace to feel upbeat and lively

**Design Principles:**
- High contrast between blue background and white cards creates clear visual hierarchy
- Pink primary buttons stand out prominently on both blue and white backgrounds
- Orange hover states add dynamic energy to interactions
- Consistent use of stone grays for text maintains readability despite colourful backdrop

---

## 🏛️ Heirloom Theme (Planner Workspace) - DEFAULT

Heirloom is the elegant, sophisticated theme for the planner workspace. It features a warm cream background with dark forest green and dusty rose accents, creating a refined and timeless aesthetic perfect for planners working on traditional, upscale weddings. **This is the default theme.**

### Colour Palette

**Page Background:**
- **Class:** `bg-[#FAF9F6]`
- **Hex:** `#FAF9F6` (Warm cream/ivory)
- **Usage:** Main page backdrop for all planner views
- **Purpose:** Creates calm, elegant atmosphere
- **Note:** Custom hex value (not a Tailwind preset) for specific warm off-white tone

**Card Background:**
- **Class:** `bg-white`
- **Usage:** All cards, modals, dropdowns, tables
- **Pairing:** Always use with `border border-stone-200` for definition
- **Identical to Pop theme**

**Primary Button:**
- **Class:** `bg-[#1b3b2b]`
- **Hex:** `#1b3b2b` (Dark forest green)
- **Usage:** Main CTAs (Save, Submit, Add, Create, Update)
- **Text Colour:** `text-white` (`textOnPrimary`)
- **Hover State:** `hover:bg-[#2F5249]` (Lighter forest green - `#2F5249`)
- **Border Radius:** `rounded-lg` for rectangular buttons, `rounded-full` for pill buttons
- **Transition:** `transition-colors` for smooth colour change on hover
- **Note:** Custom hex values for sophisticated dark green palette

**Secondary Button:**
- **Class:** `bg-white border border-stone-200`
- **Usage:** Secondary actions (Cancel, Back, Close)
- **Text Colour:** `text-stone-900` (`textPrimary`)
- **Hover State:** `hover:bg-stone-50` (`secondaryButtonHover`)
- **Border Radius:** `rounded-lg`
- **Identical to Pop theme**

**Navigation Active State:**
- **Class:** `text-[#B76E79]`
- **Hex:** `#B76E79` (Dusty rose/mauve)
- **Usage:** Active tab/nav indicator in sidebar or navigation
- **Purpose:** Creates subtle, elegant visual hierarchy to show current page
- **Note:** Muted rose tone complements green buttons while remaining distinct

**Navigation Inactive/Hover:**
- **Inactive:** `text-stone-500` - Muted gray for unselected items
- **Hover:** `hover:text-stone-700` - Darker gray on hover
- **Identical to Pop theme**

**Text Hierarchy:**
- **Primary:** `text-stone-900` - Headings, labels, body text, primary content
- **Secondary:** `text-stone-600` - Subtext, descriptions, helper text, supporting content
- **Muted:** `text-stone-400` - Placeholders, disabled text, subtle borders
- **On Primary:** `text-white` - Text on green buttons or coloured backgrounds
- **Identical to Pop theme for consistency**

**Status Badges (EverAfter Palette - v2.6 Update):**
- **Positive/Complete:** `bg-emerald-50` background with `text-emerald-700` text (Signed, Paid, Attending, High confidence)
- **Warning/Pending:** `bg-amber-50` background with `text-amber-700` text (Unsigned, Pending, Medium confidence, Due Soon)
- **Neutral/Inactive:** `bg-stone-100` background with `text-stone-600` text (Not Required, Not Attending)
- **Critical/Error:** `bg-red-100` background with `text-red-700` text (Overdue, Low confidence)
- **Urgent Warning:** `bg-orange-100` background with `text-orange-700` text (Due Today)
- **Identical to Pop theme**

### Button Examples

```tsx
// Primary Button (Dark green with lighter green hover)
<button
  className={`px-4 py-2 ${theme.primaryButton} ${theme.textOnPrimary}
              ${theme.primaryButtonHover} rounded-lg font-medium
              transition-colors`}
>
  Save Changes
</button>

// Secondary Button (White with gray hover - same as Pop)
<button
  className={`px-4 py-2 ${theme.secondaryButton} ${theme.textPrimary}
              ${theme.secondaryButtonHover} rounded-lg font-medium
              transition-colors`}
>
  Cancel
</button>

// Tertiary/Text Button (same as Pop)
<button
  className={`${theme.textSecondary} hover:${theme.textPrimary}
              transition-colors font-medium`}
>
  Learn More
</button>
```

### Layout Patterns

```tsx
// Page Container with cream background and animated hearts
<main className={`${theme.pageBackground} min-h-screen relative`}>
  <AnimatedHearts /> {/* Same hearts component, softer contrast on cream */}
  <div className="relative z-10 container mx-auto px-4 py-8">
    {/* Page content */}
  </div>
</main>

// Card Component (identical structure to Pop)
<div className={`${theme.cardBackground} ${theme.border}
                 ${theme.borderWidth} rounded-2xl p-6 shadow-lg`}>
  <h3 className={theme.textPrimary}>Card Title</h3>
  <p className={theme.textSecondary}>Card description</p>
</div>

// Section Header (identical to Pop)
<h4 className={`text-xs font-semibold ${theme.textSecondary}
                uppercase tracking-wide mb-2`}>
  Section Title
</h4>
```

### Visual Characteristics

**Mood & Personality:**
- **Sophisticated:** Cream and dark green convey refinement and class
- **Elegant:** Muted tones create timeless, upscale aesthetic
- **Calm:** Lower contrast easier on eyes for extended use
- **Traditional:** Colour palette evokes classic, formal settings

**When to Use Heirloom:**
- Planners working on traditional, formal weddings
- Users who prefer calm, elegant interfaces (default for this reason)
- Classic, sophisticated wedding styles
- Planners who spend long hours in the interface (easier on eyes than bright blue)

**Design Principles:**
- Lower contrast between cream background and white cards creates softer, more refined look
- Dark green buttons provide sufficient contrast without being jarring
- Dusty rose accents add warmth without overpowering the palette
- Cream background reduces eye strain compared to bright colours during extended use
- Professional appearance suitable for high-end wedding planning

---

## 🎨 Theme Comparison Tables

### Colour Property Comparison

| Property | Pop Theme | Heirloom Theme | Purpose |
|----------|-----------|----------------|---------|
| **Page Background** | `bg-bridezilla-blue` (#5B9BD5) | `bg-[#FAF9F6]` (warm cream) | Main page backdrop |
| **Card Background** | `bg-white` | `bg-white` | Cards, modals, tables |
| **Primary Button** | `bg-bridezilla-pink` (#ec4899) | `bg-[#1b3b2b]` (dark green) | Main CTAs |
| **Primary Button Hover** | `hover:bg-bridezilla-orange` (#f97316) | `hover:bg-[#2F5249]` (lighter green) | Button hover state |
| **Secondary Button** | `bg-white border border-stone-200` | `bg-white border border-stone-200` | Secondary actions |
| **Secondary Button Hover** | `hover:bg-stone-50` | `hover:bg-stone-50` | Secondary hover |
| **Border** | `border-stone-200` | `border-stone-200` | Card borders |
| **Text Primary** | `text-stone-900` | `text-stone-900` | Headings, body text |
| **Text Secondary** | `text-stone-600` | `text-stone-600` | Subtext, descriptions |
| **Text Muted** | `text-stone-400` | `text-stone-400` | Placeholders, disabled |
| **Text On Primary** | `text-white` | `text-white` | Text on buttons |
| **Nav Active** | `text-bridezilla-orange` (#f97316) | `text-[#B76E79]` (dusty rose) | Active nav indicator |
| **Nav Inactive** | `text-stone-500` | `text-stone-500` | Unselected nav items |
| **Nav Hover** | `hover:text-stone-700` | `hover:text-stone-700` | Nav hover state |
| **Success Badge** | `bg-emerald-50` / `text-emerald-700` | `bg-emerald-50` / `text-emerald-700` | Success messages |
| **Warning Badge** | `bg-amber-50` / `text-amber-700` | `bg-amber-50` / `text-amber-700` | Warning messages |
| **Error Badge** | `bg-red-50` / `text-red-700` | `bg-red-50` / `text-red-700` | Error messages |

### Visual Characteristics Comparison

| Aspect | Pop Theme | Heirloom Theme |
|--------|-----------|----------------|
| **Mood** | Fun, energetic, playful | Elegant, sophisticated, timeless |
| **Background** | Bright blue (#5B9BD5) | Warm cream (#FAF9F6) |
| **Primary Accent** | Hot pink (#ec4899) | Dark forest green (#1b3b2b) |
| **Secondary Accent** | Bright orange (#f97316) | Dusty rose (#B76E79) |
| **Contrast Level** | High - vibrant colours | Low - muted, refined tones |
| **Energy Level** | High - bold and dynamic | Low - calm and serene |
| **Eye Strain** | More stimulating | Easier for extended use |
| **Formality** | Casual, modern | Formal, traditional |
| **Best For** | Contemporary weddings | Classic, upscale weddings |
| **Target Planner** | Prefers vibrant workspaces | Prefers calm, professional feel |
| **Default** | No | Yes (default theme) |

### Shared Properties

Both themes share these identical properties:
- **Typography:** Same font families, sizes, and weights
- **Layout:** Identical spacing, padding, and grid systems
- **Components:** Same component structures (buttons, cards, tables, modals)
- **Border Radius:** Consistent rounded corners (`rounded-lg`, `rounded-2xl`, `rounded-full`)
- **Shadows:** Same shadow system (`shadow`, `shadow-lg`)
- **Transitions:** Identical animation and transition behaviour
- **Status Badges:** Same emerald/amber/red colour system for success/warning/error
- **Text Hierarchy:** Same stone-based gray scale for all text levels
- **Secondary Buttons:** Completely identical styling
- **Navigation:** Same hover behaviour, only active state colour differs

---

## 🔧 Theme Implementation Guide

### Using the Theme Hook

All components in the planner workspace should use the `useThemeStyles()` hook to access theme properties:

```tsx
import { useThemeStyles } from '@/hooks/useThemeStyles'

export default function MyComponent() {
  const theme = useThemeStyles()

  return (
    <div className={`${theme.pageBackground} min-h-screen p-8`}>
      <div className={`${theme.cardBackground} ${theme.border}
                       ${theme.borderWidth} rounded-2xl p-6`}>
        <h2 className={theme.textPrimary}>Title</h2>
        <p className={theme.textSecondary}>Description text</p>

        <div className="flex gap-4 mt-6">
          <button
            className={`${theme.primaryButton} ${theme.textOnPrimary}
                        ${theme.primaryButtonHover} px-4 py-2 rounded-lg
                        font-medium transition-colors`}
          >
            Primary Action
          </button>

          <button
            className={`${theme.secondaryButton} ${theme.textPrimary}
                        ${theme.secondaryButtonHover} px-4 py-2 rounded-lg
                        font-medium transition-colors`}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
```

### Theme Switching in Settings

Users can switch themes in the Settings tab:

```tsx
import { useTheme } from '@/contexts/ThemeContext'

export default function SettingsTab() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Workspace Theme</h3>

      <div className="flex gap-4">
        <button
          onClick={() => setTheme('pop')}
          className={`px-6 py-3 rounded-lg border-2 transition-all
                      ${theme === 'pop'
                        ? 'border-bridezilla-pink bg-bridezilla-pink text-white'
                        : 'border-stone-200 bg-white text-stone-900'}`}
        >
          🎈 Pop Theme
        </button>

        <button
          onClick={() => setTheme('heirloom')}
          className={`px-6 py-3 rounded-lg border-2 transition-all
                      ${theme === 'heirloom'
                        ? 'border-[#1b3b2b] bg-[#1b3b2b] text-white'
                        : 'border-stone-200 bg-white text-stone-900'}`}
        >
          🏛️ Heirloom Theme
        </button>
      </div>

      <p className="text-sm text-stone-600">
        Current theme: <strong>{theme === 'pop' ? 'Pop' : 'Heirloom'}</strong>
      </p>
    </div>
  )
}
```

### Common Patterns

**Table with Theme Colours:**
```tsx
const theme = useThemeStyles()

return (
  <div className={`${theme.cardBackground} rounded-xl shadow-lg overflow-hidden`}>
    <table className="w-full">
      <thead className={`bg-stone-100 border-b ${theme.border}`}>
        <tr>
          <th className={`px-4 py-3 text-left text-xs font-bold
                         ${theme.textSecondary} uppercase tracking-wider`}>
            Name
          </th>
        </tr>
      </thead>
      <tbody className={`divide-y ${theme.border}`}>
        <tr className="hover:bg-stone-50 cursor-pointer transition-colors">
          <td className={`px-4 py-3 text-sm ${theme.textPrimary}`}>
            Content
          </td>
        </tr>
      </tbody>
    </table>
  </div>
)
```

**Modal with Theme Colours:**
```tsx
const theme = useThemeStyles()

return (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className={`${theme.cardBackground} rounded-2xl shadow-2xl
                     max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden`}>
      <div className={`sticky top-0 ${theme.cardBackground}
                      border-b ${theme.border} px-6 py-4
                      flex items-center justify-between`}>
        <h2 className={`text-xl font-bold ${theme.textPrimary}`}>
          Modal Title
        </h2>
        <button className={`${theme.textSecondary} hover:${theme.textPrimary}`}>
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="p-6">
        <p className={theme.textSecondary}>Modal content</p>
      </div>
    </div>
  </div>
)
```

### Dos and Don'ts

**✅ DO:**
- Always use `useThemeStyles()` hook for colour properties in planner workspace
- Test all new components in both themes before deploying
- Use theme tokens consistently (`theme.primaryButton`, not hardcoded pink)
- Maintain shared component structures between themes
- Keep text hierarchy consistent using stone grays in both themes
- Use semantic colour properties (`primaryButton`, not colour names)

**❌ DON'T:**
- Hardcode `bg-bridezilla-pink` or `bg-[#1b3b2b]` directly in components
- Create theme-specific components when colour tokens suffice
- Change layout or spacing based on theme
- Mix admin workspace colours (which don't use themes) with planner colours
- Use different typography or spacing between themes
- Override theme colours with inline styles

### Accessibility Considerations

Both themes maintain WCAG AA contrast ratios:

**Pop Theme:**
- Pink buttons (#ec4899) on blue background: ✅ Passes AA
- Orange hover (#f97316) on blue background: ✅ Passes AA
- White text on pink buttons: ✅ Passes AAA
- Stone-900 text on white cards: ✅ Passes AAA

**Heirloom Theme:**
- Dark green buttons (#1b3b2b) on cream background: ✅ Passes AA
- Dark green buttons on white cards: ✅ Passes AAA
- White text on dark green buttons: ✅ Passes AAA
- Stone-900 text on white cards: ✅ Passes AAA
- Dusty rose (#B76E79) active nav on cream: ✅ Passes AA

### Testing Checklist

When developing new features, ensure they work in both themes:

- [ ] Component uses `useThemeStyles()` hook for colours
- [ ] Primary buttons use `theme.primaryButton` and `theme.primaryButtonHover`
- [ ] Secondary buttons use `theme.secondaryButton` and `theme.secondaryButtonHover`
- [ ] Page backgrounds use `theme.pageBackground`
- [ ] Cards use `theme.cardBackground`
- [ ] Text uses theme text properties (`textPrimary`, `textSecondary`, `textMuted`)
- [ ] Navigation uses `theme.navActive`, `theme.navInactive`, `theme.navHover`
- [ ] Borders use `theme.border` and `theme.borderWidth`
- [ ] Tested visually in Pop theme
- [ ] Tested visually in Heirloom theme
- [ ] Contrast ratios meet WCAG AA standards in both themes
- [ ] No hardcoded colour values (except for status badges which are consistent)

---

## Admin Workspace vs Planner Workspace

**Important distinction:**

- **Admin routes (`/admin/*`):**
  - **Theme Hook Usage:** Admin components DO use `useThemeStyles()` hook for colour tokens
  - **Theme Switching:** Admin does NOT support theme switching (no Pop/Heirloom toggle)
  - **Colours:** Admin uses single fixed theme (pink/orange colour scheme via theme tokens)
  - **Implementation:** AdminNavigation, AdminHeader, and AdminDashboard all import and use theme hook
  - **Why:** Provides consistent colour token access pattern even though theme doesn't switch

- **Planner routes (`/planner/*`):**
  - **Theme Hook Usage:** Planner components use `useThemeStyles()` hook for colour tokens
  - **Theme Switching:** Planner DOES support theme switching (Pop ↔ Heirloom)
  - **Colours:** Theme-aware - changes between pink/blue (Pop) and green/cream (Heirloom)

If you're building for admin, use `useThemeStyles()` hook (single theme). If you're building for planner, use the theme hook with switching support.

---

## Semantic Colours (Status Indicators)

Both themes and the admin workspace share these semantic colours for status indicators:

### Status Colours (v2.6+ EverAfter Palette)

- **Emerald (Positive/Complete):** `emerald-700` for text, `emerald-50` for backgrounds
  - Used for: "Paid" status pills, "Signed" status, "Attending" indicators, high confidence badges
  - **Monetary amounts:** Paid amounts in vendor tables use `text-emerald-700` (v2.8)
  - Light variants: `emerald-50`, `emerald-100` for backgrounds
  - **Important:** Use ONLY for status indicators and positive monetary values, NOT for action buttons

- **Amber (Warning/Pending):** `amber-700` for text, `amber-50` for backgrounds
  - Used for: "Pending" status, "Unsigned" status, medium confidence badges, "Due Soon" warnings
  - Light variants: `amber-50`, `amber-100` for backgrounds
  - Replaces old yellow-based warning colors

- **Stone (Neutral/Inactive):** `stone-600` for text, `stone-100` for backgrounds
  - Used for: "Not Required" status, "Not Attending" status, neutral states
  - Light variants: `stone-50`, `stone-100` for backgrounds

- **Red (Critical/Error):** `red-700` for text, `red-100` for backgrounds
  - Used for: "Overdue" status, error notifications, low confidence badges, delete actions
  - **Monetary amounts:** Outstanding amounts in vendor tables use `text-red-700` (v2.8)
  - Light variants: `red-50`, `red-100` for backgrounds
  - **Important:** Use for critical states and outstanding monetary values

- **Orange (Urgent Warning):** `orange-700` for text, `orange-100` for backgrounds
  - Used for: "Due Today" warnings, urgent time-sensitive alerts
  - Light variants: `orange-50`, `orange-100` for backgrounds

- **Gray (Neutral Text):** `gray-100` through `gray-900`
  - Used for: Text hierarchy, borders, backgrounds, disabled states

### Monetary Amount Colors (v2.8)

**Admin Workspace - Vendor Tables:**
- **Paid amounts:** `text-emerald-700` - represents positive cash flow (money received)
- **Outstanding amounts:** `text-red-700` - represents critical outstanding payments (money owed)

```tsx
// Paid column
<div className="font-medium text-emerald-700">
  {formatCurrency(totalPaid, currency)} {currency}
</div>

// Outstanding column
<div className="font-medium text-red-700">
  {formatCurrency(totalOutstanding, currency)} {currency}
</div>
```

**Rationale:** Aligns with semantic color system where emerald = positive/complete and red = critical/outstanding.

### ⚠️ Colour Usage Rules

**Action Button Colours (Admin & Planner):**
- **Admin:** Uses hardcoded `bg-bridezilla-pink`, `bg-bridezilla-orange`, `bg-gray-200`, `bg-red-600`
- **Planner:** Uses theme tokens `theme.primaryButton`, `theme.secondaryButton`, etc.

**Status Indicator Colours (Universal - v2.6+ EverAfter Palette):**
- ✅ **Emerald:** "Paid", "Signed", "Attending", high confidence, paid monetary amounts
- ✅ **Amber:** "Pending", "Unsigned", medium confidence, "Due Soon" warnings
- ✅ **Stone:** "Not Required", "Not Attending", neutral states
- ✅ **Red:** "Overdue", errors, low confidence, outstanding monetary amounts
- ✅ **Orange:** "Due Today", urgent time-sensitive warnings

**Never use for action buttons:**
- ❌ **Blue buttons** - use tertiary gray instead
- ❌ **Green buttons** - use secondary or tertiary instead

---

## Typography

### Font Families

The workspace uses two distinct display fonts for different purposes:

```css
font-heading: 'Bebas Neue', Impact, sans-serif     /* Uppercase display font */
font-display: 'Playfair Display', Georgia, serif   /* Elegant serif font */
font-body: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif
```

### Font Usage Rules

**`font-heading` (Bebas Neue):**
- Brand name in navigation (e.g., "BRIDEZILLA" in header)
- Stats card numbers (large display numbers: "42", "85%")
- Couple names in detail views (e.g., "MONICA & KEVIN")
- Vendor type section headers (e.g., "VENUE (3)", "CATERING (2)")
- Button text (when uppercase styling is used)
- Auth page titles (e.g., "WEDDING PLANNER PORTAL")
- **Always** paired with `uppercase tracking-wide` or `tracking-[0.2em]` for proper spacing
- Used for bold, condensed, impactful display text

**`font-display` (Playfair Display):**
- Page titles (e.g., "Couples Calendar", "Vendor Library", "Settings")
- Section headings within pages (e.g., "Upcoming Payments", "Budget Progress")
- Subsection titles (e.g., "Payment Schedule")
- Modal titles (e.g., "Ask Bridezilla")
- Card titles and content area headers
- More refined, elegant serif for readability
- Uses normal sentence case (NOT uppercase)

**`font-body` (System Sans-Serif):**
- All body text, descriptions, labels
- Table content
- Form inputs
- Helper text

### Heading Hierarchy

**Brand/Logo Headers (font-heading):**
- **Navigation Brand:** `text-base sm:text-xl md:text-2xl lg:text-3xl font-heading uppercase tracking-[0.2em]` - "BRIDEZILLA"
- **Couple Names:** `text-2xl md:text-3xl font-heading uppercase tracking-wide` - "MONICA & KEVIN"
- **Vendor Type Sections:** `text-xl md:text-2xl font-heading uppercase tracking-wide` - "VENUE (3)"

**Stats Card Numbers (font-body with semibold):**

All admin and planner stats cards use **system font with semibold weight** and consistent sizing:

```tsx
// Standard pattern used across ALL tabs
<p className="text-2xl md:text-3xl font-semibold">{value}</p>
```

**Font Details:**
- Uses `font-semibold` = system font stack with 600 weight
- Font stack: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
- NOT `font-heading` (Bebas Neue) - that's only used for brand names and uppercase decorative text

This applies to:
- **Admin:** DashboardTab, VendorsTab, RSVPTab
- **Planner:** All planner workspace stats cards

✅ **Consistent across all workspaces** - All stats numbers use system font with semibold weight.

**Page Titles (font-display):**
- **H1 (Main Page):** `text-3xl md:text-4xl font-display` - "Couples Calendar", "Vendor Library"
- **H2 (Section):** `text-xl md:text-2xl font-display` - "Upcoming Payments", "Budget Progress"
- **H3 (Subsection):** `text-lg md:text-xl font-display` - Card titles, nested sections
- **H4 (Minor Section):** `text-base md:text-lg font-display` - Table section titles

**Body Headers (font-body with font-semibold):**
- **H4 Alternative:** `text-lg md:text-xl font-semibold` - Generic subsection headers
- **H5:** `text-base md:text-lg font-semibold` - Small section headers

### Heading Examples

```tsx
{/* Page title - uses font-display (NOT uppercase) */}
<h2 className={`text-3xl md:text-4xl font-display mb-2 ${theme.textPrimary}`}>
  Couples Calendar
</h2>

{/* Section heading - uses font-display */}
<h2 className={`font-display text-xl md:text-2xl ${theme.textPrimary}`}>
  Upcoming Payments
</h2>

{/* Brand name - uses font-heading with uppercase */}
<span className={`font-heading text-base sm:text-xl md:text-2xl lg:text-3xl tracking-[0.2em] sm:tracking-[0.3em] uppercase ${theme.textPrimary}`}>
  BRIDEZILLA
</span>

{/* Couple name - uses font-heading with uppercase */}
<h1 className="font-heading text-2xl md:text-3xl uppercase tracking-wide mb-3">
  MONICA & KEVIN
</h1>

{/* Vendor type section - uses font-heading with uppercase */}
<h2 className="font-heading text-xl md:text-2xl uppercase tracking-wide mb-4">
  VENUE (3)
</h2>

{/* Stats card number - uses font-heading (no uppercase) */}
<p className="font-heading text-2xl md:text-3xl text-stone-900">42</p>
```

### Body Text
- **Regular:** `text-base font-body`
- **Small:** `text-sm font-body`
- **Extra Small:** `text-xs font-body`

### Text Colours
- **Primary:** `text-gray-900`
- **Secondary:** `text-gray-700`
- **Tertiary:** `text-gray-600`
- **Muted:** `text-gray-500`
- **Disabled:** `text-gray-400`

---

## Buttons

### Action Button Sizing
All action buttons (Primary, Secondary, Tertiary) use consistent responsive sizing:
```tsx
// Responsive sizing (standard for all action buttons)
className="px-3 md:px-4 py-2 text-sm font-semibold rounded-full"
```

**Note:** Buttons use `text-sm` (not responsive text sizing) to maintain consistent, compact appearance across all viewport sizes.

### Primary Button (Pink)
```tsx
className="flex items-center gap-1 md:gap-2 px-3 md:px-4 py-2
           bg-bridezilla-pink text-white rounded-full text-sm font-semibold
           hover:scale-105 transition-all"
```
**Usage:** Main CTAs, primary actions (e.g., "Ask Bridezilla", "Save", "Submit")
**Examples:** "Ask Bridezilla", "Update Vendor", "Send Invitation"

### Secondary Button (Orange)
```tsx
className="flex items-center gap-1 md:gap-2 px-3 md:px-4 py-2
           bg-bridezilla-orange text-white rounded-full text-sm font-semibold
           hover:scale-105 transition-all"
```
**Usage:** Secondary actions, alternative CTAs
**Examples:** "Add Manually", "Invite Manually", "Add Payment", "Create New"

### Tertiary Button (Gray)
```tsx
className="flex items-center gap-1 md:gap-2 px-3 md:px-4 py-2
           bg-gray-100 text-gray-700 rounded-full text-sm font-semibold
           hover:bg-gray-200 hover:scale-105 transition-all"
```
**Usage:** Tertiary actions, less prominent actions, export/utility buttons
**Examples:** "Export", "Cancel", "Back"

### Special: Gradient Button (Pink to Orange)
```tsx
className="px-3 md:px-4 py-2 bg-gradient-to-r from-bridezilla-pink to-bridezilla-orange
           text-white rounded-full text-sm font-semibold hover:scale-105 transition-all"
```
**Usage:** Special featured actions, hero CTAs
**Examples:** Hero section buttons, promotional actions

### Destructive Button (Red)
```tsx
className="px-3 md:px-4 py-2 bg-red-600 text-white rounded-full text-sm font-semibold
           hover:bg-red-700 transition-colors"
```
**Usage:** Delete actions, destructive operations
**Examples:** "Delete Vendor", "Remove Item"

### Icon-Only Action Buttons

Icon-only buttons (no text label) used for table row actions and quick operations.

#### Standard Icon Button
For non-destructive actions (view, share, edit):
```tsx
className="p-1.5 rounded ${theme.textSecondary} hover:bg-stone-100 hover:${theme.textPrimary} transition-all"
```

**Visual Behavior:**
- **Normal state:** Gray icon (`textSecondary`)
- **Hover state:** Light gray background (`bg-stone-100`) + darker icon (`textPrimary`)
- **Padding:** `p-1.5` for proper touch target
- **Border radius:** `rounded` for subtle corners

**Usage:** View, share, edit, and other non-destructive actions
**Examples:** `<ExternalLink />`, `<Share2 />`, `<Edit2 />`

#### Destructive Icon Button (Delete/Archive)
For destructive actions:
```tsx
className="p-1.5 rounded ${theme.textSecondary} hover:bg-red-50 hover:text-red-600 transition-all"
```

**Visual Behavior:**
- **Normal state:** Gray icon (`textSecondary`)
- **Hover state:** Light red background (`bg-red-50`) + red icon (`text-red-600`)
- **Clear danger signal:** Red color immediately signals destructive action

**Usage:** Delete, archive, remove operations
**Examples:** `<Trash2 />` for delete/archive buttons

#### Icon Button Best Practices
1. **Always include `title` attribute** for accessibility tooltips
2. **Use `w-4 h-4` for icons** to maintain consistent sizing
3. **Add `transition-all`** for smooth hover effects
4. **Use theme tokens** (`${theme.textSecondary}`, `${theme.textPrimary}`) not hardcoded colors
5. **Consistent spacing:** Always use `p-1.5` for icon-only buttons
6. **Disabled state:** Add `disabled:opacity-50 disabled:hover:bg-transparent` when needed

#### Complete Example
```tsx
{/* View/Open Button */}
<button
  onClick={handleView}
  className="p-1.5 rounded text-stone-600 hover:bg-stone-100 hover:text-stone-900 transition-all"
  title="Open shared workspace"
>
  <ExternalLink className="w-4 h-4" />
</button>

{/* Edit Button */}
<button
  onClick={handleEdit}
  className="p-1.5 rounded text-stone-600 hover:bg-stone-100 hover:text-stone-900 transition-all"
  title="Edit details"
>
  <Edit2 className="w-4 h-4" />
</button>

{/* Delete Button */}
<button
  onClick={handleDelete}
  className="p-1.5 rounded text-stone-600 hover:bg-red-50 hover:text-red-600 transition-all"
  title="Delete item"
>
  <Trash2 className="w-4 h-4" />
</button>
```

### Button Icon Sizing
Icons within buttons should always be `w-4 h-4` (16px) to maintain consistent button height:
```tsx
<ButtonIcon className="w-4 h-4" />
```

---

## Stats Cards (Workspace Pattern)

### Standard Stats Card Layout
All admin and planner stats cards must use this consistent 4-column responsive grid:

```tsx
<div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
  {/* 4 cards */}
</div>
```

### Individual Stats Card Structure
```tsx
<div className="bg-white rounded-xl shadow-lg p-3 md:p-6 border-2 border-{COLOR}/20 hover:border-{COLOR} transition-colors">
  <div className="flex items-center gap-2 md:gap-3">
    <Icon className="w-6 h-6 md:w-8 md:h-8 text-{COLOR} flex-shrink-0" />
    <div className="min-w-0">
      <p className="text-xs md:text-sm text-gray-600">Label Text</p>
      <p className="text-2xl md:text-3xl font-semibold text-{COLOR}">{value}</p>
    </div>
  </div>
</div>
```

### Stats Card Requirements

**Grid Layout:**
- Mobile: `grid-cols-2` (2 columns)
- Desktop: `md:grid-cols-4` (4 columns)
- Always show exactly 4 stats cards

**Spacing:**
- Gap: `gap-3 md:gap-4` (responsive)
- Padding: `p-3 md:p-6` (responsive)
- Bottom margin: `mb-6 md:mb-8`

**Visual Style:**
- Shadow: `shadow-lg`
- Border: `border-2 border-COLOR/20` (20% opacity)
- Hover: `hover:border-COLOR` (full opacity)
- Border radius: `rounded-xl`
- Background: `bg-white`
- Transition: `transition-colors`

**Content:**
- Icon: `w-6 h-6 md:w-8 md:h-8` (responsive sizing), coloured, `flex-shrink-0`
  - **Note:** VendorsTab uses fixed `w-5 h-5` sizing; verify icon sizing across all implementations
- Label: `text-xs md:text-sm text-gray-600` (responsive)
- Value: `text-2xl md:text-3xl font-semibold` (responsive), coloured
  - Uses system font (NOT Bebas Neue)
  - ✅ **Consistent across all tabs**

**Colour Pattern:**
Alternate between pink and orange for visual variety:
- Card 1: `border-bridezilla-pink/20`, `text-bridezilla-pink`
- Card 2: `border-bridezilla-orange/20`, `text-bridezilla-orange`
- Card 3: `border-bridezilla-pink/20`, `text-bridezilla-pink`
- Card 4: `border-bridezilla-orange/20`, `text-bridezilla-orange`

### Common Stats Card Icons
- `Users` - People counts (couples, vendors)
- `DollarSign` - Financial metrics (cost, paid, outstanding)
- `Calendar` - Time-based metrics (active this week, upcoming)
- `Clock` - Recent activity (recently added, last 7 days)
- `Package` - Inventory/items (total vendors, types)
- `AlertCircle` - Outstanding/pending items

---

## Controls Container (Workspace Pattern)

### Standard Controls Container Structure

All admin and planner control/filter bars use this pattern for consistent layout:

```tsx
{/* Controls */}
<div className="bg-white rounded-xl shadow p-3 md:p-4 mb-4 md:mb-6">
  <div className="flex flex-wrap gap-2 md:gap-4 items-center justify-between">
    <div className="flex gap-2 flex-wrap">
      {/* Filters: selects, search inputs, toggle buttons */}
    </div>
    <div className="flex gap-2 flex-wrap">
      {/* Action buttons */}
    </div>
  </div>
</div>
```

**Actual Implementation Variants:**

Some admin tabs (VendorsTab, RSVPTab) use a slightly different pattern with border instead of shadow:

```tsx
<div className="bg-white rounded-2xl border ${theme.border} p-6 mb-6">
  <div className="flex flex-wrap gap-4 items-center justify-between">
    {/* controls */}
  </div>
</div>
```

**Key differences in this variant:**
- Uses `border ${theme.border}` (border-2 via theme) instead of `shadow`
- Uses `rounded-2xl` instead of `rounded-xl`
- Uses fixed `p-6` instead of responsive `p-3 md:p-4`
- Uses fixed `gap-4` instead of responsive `gap-2 md:gap-4`

📝 **Note:** Both patterns exist in the codebase. Document actual usage per component.

### Critical Requirements (Must Follow Exactly)

**Outer Container:**
- Background: `bg-white`
- Border radius: `rounded-xl`
- Shadow: `shadow` (never `shadow-lg`, never borders)
- Padding: `p-3 md:p-4` (responsive)
- Bottom margin: `mb-4 md:mb-6`

**Inner Flex Container:**
- Layout: `flex flex-wrap` (wraps on small screens)
- Gap: `gap-2 md:gap-4` (responsive)
- Alignment: `items-center justify-between`

**Filter Group (Left Side):**
- Wrapper: `<div className="flex gap-2 flex-wrap">`
- Gap: `gap-2` (consistent spacing between filters)
- **Never use `flex-1`** (causes height issues)

**Button Group (Right Side):**
- Wrapper: `<div className="flex gap-2 flex-wrap">`
- Gap: `gap-2` (consistent spacing between buttons)
- **Never use `flex-1`** (keeps buttons grouped together)

---

### Filter/Control Element Styling

**Searchable Multi-Select Dropdowns (REQUIRED):**

**ALL filter dropdowns must use the SearchableMultiSelect component:**

```tsx
import SearchableMultiSelect from '../SearchableMultiSelect'

// Type Filter Example
<SearchableMultiSelect
  options={VENDOR_TYPES.map(type => ({
    value: type,
    label: type,
    count: stats.byType[type] || 0 // optional count badge
  }))}
  selectedValues={typeFilter} // array of selected values
  onChange={setTypeFilter}
  placeholder="Filter by type..."
  allLabel="All Types"
  className="min-w-[160px]"
/>

// Tag Filter Example
<SearchableMultiSelect
  options={allTags.map(({ tag, count }) => ({
    value: tag,
    label: tag,
    count
  }))}
  selectedValues={selectedTags}
  onChange={setSelectedTags}
  placeholder="Filter by tags..."
  allLabel="All Filters"
  className="min-w-[160px]"
/>
```

**Features:**
- ✅ **Type-to-search:** Filter options by typing
- ✅ **Multi-select:** Select multiple values simultaneously
- ✅ **Select All / Clear All:** Quick bulk actions in single line (v2.6: improved button sizing)
- ✅ **Count badges:** Show item counts per option (optional)
- ✅ **Keyboard accessible:** Full keyboard navigation support
- ✅ **Clear button:** X button to clear all selections when any are selected (v2.6: Fixed nested button hydration error)
- ✅ **Smart display:** Shows "All" when none/all selected, "N selected" for multiple, or single item label
- ✅ **Checkbox indicators:** Checkboxes at the beginning of each option for clear visual alignment (v2.6 update)
- ✅ **Wider dropdown:** Minimum 280px width prevents text truncation (v2.6 update)
- ✅ **Spacious layout:** Generous padding throughout for clean, uncluttered appearance (v2.6 update)
- ✅ **Scroll preservation:** Mouse stays on selected option after click - no focal point movement or scroll jumping (v2.8 update)

**State Management:**
- Filter state must be `string[]` (array), not `string`
- Filter logic must use `array.includes()` or `array.some()`
- Empty array = show all (no filter applied)

**Technical Implementation - Scroll Preservation (v2.8):**

When implementing dropdowns with selectable options, preserve scroll position at TWO levels:

**Level 1: Internal Dropdown Scroll (inside SearchableMultiSelect)**
```tsx
// 1. Add ref to track scrollable container
const optionsListRef = useRef<HTMLDivElement>(null)

// 2. In toggle handler, preserve and restore scroll position
const toggleOption = (value: string, e?: React.MouseEvent) => {
  e?.preventDefault() // Prevent default browser scroll behavior

  const scrollPosition = optionsListRef.current?.scrollTop || 0

  // Update state...
  onChange(newValues)

  // Restore scroll after React re-renders
  requestAnimationFrame(() => {
    if (optionsListRef.current) {
      optionsListRef.current.scrollTop = scrollPosition
    }
  })
}

// 3. Attach ref to scrollable container
<div ref={optionsListRef} className="overflow-y-auto">
  {options.map(option => (
    <button onClick={(e) => toggleOption(option.value, e)}>
      {/* option content */}
    </button>
  ))}
</div>
```

**Level 2: Page Scroll Preservation (in parent components)**
```tsx
// In components that use SearchableMultiSelect for filtering
const preserveScrollPosition = () => {
  const scrollY = window.scrollY
  requestAnimationFrame(() => {
    window.scrollTo(0, scrollY)
  })
}

// Wrap filter state setters
const handleFilterChange = (values: string[]) => {
  preserveScrollPosition() // Call BEFORE state update
  setFilterState(values)
}

// Use wrapper in SearchableMultiSelect
<SearchableMultiSelect
  onChange={handleFilterChange} // NOT setFilterState directly!
/>
```

**Why this works:**
- **Internal:** `e.preventDefault()` stops default browser scrolling behavior
- **Internal:** `requestAnimationFrame` waits for React to finish re-rendering before restoring scroll
- **Internal:** Ref provides direct DOM access to read/write scroll position without triggering re-renders
- **Page-level:** Capturing `window.scrollY` before state change prevents browser from auto-scrolling to top
- **Page-level:** `requestAnimationFrame` ensures scroll restoration happens after React's full render cycle

**Examples from codebase:**
- Admin VendorsTab: Type filter (All Types)
- Planner VendorLibraryTab: Type and tag filters (All Types, All Filters)
- Planner CouplesCalendarView: Venue filter (All Venues)

**Filter Toggle Buttons (e.g., "All", "Attending", "Not Attending"):**

Multiple padding patterns exist in implementation:

```tsx
// Pattern A: VendorsTab secondary buttons, RSVPTab filters
className="px-6 py-2.5 ..." // Fixed larger horizontal padding

// Pattern B: RSVPTab secondary buttons
className="px-4 py-2 ..." // Standard padding

// Pattern C: Some components
className="px-3 md:px-4 py-2 ..." // Responsive horizontal padding
```

**Active/Inactive state patterns:**
```tsx
// Active state
className="px-6 py-2.5 rounded-full text-sm font-semibold
           bg-bridezilla-pink text-white shadow-md hover:scale-105 transition-all"

// Inactive state
className="px-6 py-2.5 rounded-full text-sm font-semibold
           bg-white text-gray-700 border border-gray-200
           hover:border-gray-300 hover:scale-105 transition-all"
```

**Common characteristics:**
- Border: `border` (single pixel, **not `border-2`**)
- Vertical padding: Always `py-2` or `py-2.5` (never responsive like `py-2 md:py-3`)
- Shape: `rounded-full` for pill style
- Text: `text-sm font-semibold` (no responsive text sizing)

📝 **Note:** Consider standardising to single padding pattern for consistency.

**Search Inputs:**
```tsx
// Wrapper
<div className="min-w-[200px]">
  <div className="relative">
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
    <input
      className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg
                 text-sm font-semibold focus:outline-none focus:border-bridezilla-pink"
    />
  </div>
</div>
```
- Wrapper: `min-w-[200px]` (minimum width, **no `flex-1`**)
- Input padding: `py-2` (matches other controls exactly)
- Border: `border border-gray-300` (same as selects - **not `border-2`**)
- Text: `text-sm font-semibold` (matches selects exactly)
- Icon positioning: `pl-10 pr-10` for left/right padding
- **Critical:** Must include `font-semibold` to match select line-height
- **Critical:** Use single-pixel border (not `border-2`) to match select height
- **Critical:** Never add `flex-1` to search wrapper (causes height issues)

---

### Why These Rules Matter

**Height Consistency:**
- All controls use `py-2` (never `py-3` or responsive vertical padding)
- This ensures uniform height across all views (admin vendors, admin RSVP, planner)

**Spacing Consistency:**
- Outer container: `p-3 md:p-4` (responsive padding)
- Inner gap: `gap-2 md:gap-4` (responsive gap)
- Control gap: `gap-2` (fixed, consistent spacing)

**Visual Consistency:**
- Use `shadow` (not `shadow-lg` or borders) for outer container
- Matches stats cards visual style
- Cleaner, more modern appearance

**Layout Behavior:**
- No `flex-1` prevents flex items from stretching and affecting height
- `flex-wrap` allows graceful wrapping on small screens
- `justify-between` keeps filters left, actions right

---

## Layout & Containers

### Standard Container Width
**Always use `max-w-6xl` for consistent layout:**
```tsx
<div className="max-w-6xl mx-auto px-4">
  {/* Content */}
</div>
```

### Responsive Spacing
- **Padding:** `p-3 md:p-4` or `p-4 md:p-6` for cards
- **Margin:** `mb-4 md:mb-6` for vertical spacing
- **Gap:** `gap-3 md:gap-4` for flex/grid layouts

### Card Styles
```tsx
// Standard Card
className="bg-white rounded-xl shadow-lg p-4 md:p-6
           border-2 border-gray-200"

// Hover Card
className="bg-white rounded-xl shadow-lg p-4 md:p-6
           border-2 border-gray-200 hover:border-bridezilla-pink
           transition-colors"
```

---

## Tables

### Standard Table Container

All workspace tables must use this container structure for proper styling and overflow handling:

```tsx
<div className="bg-white rounded-xl shadow-lg overflow-hidden">
  <div className="overflow-x-auto">
    <table className="w-full">
      {/* Table content */}
    </table>
  </div>
</div>
```

### Table Header

**Standard header styling for all tables:**

```tsx
<thead className="bg-gray-100 border-b border-gray-200">
  <tr>
    <th className="px-2 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider font-body">
      Column Name
    </th>
  </tr>
</thead>
```

**Requirements:**
- Background: `bg-gray-100` (provides clear contrast)
- Border: `border-b border-gray-200` (separates header from body)
- Font: `font-bold` (strong hierarchy)
- Letter spacing: `tracking-wider` (improves readability for uppercase)
- Text: `text-xs text-gray-600 uppercase`
- Padding: `px-4 py-3` (VendorsTab, RSVPTab use this pattern)
- Font family: `font-body`
- **Note:** Admin tables (VendorsTab, RSVPTab) use `px-4 py-3` for adequate spacing

### Expand Icon Column (For Expandable Tables)

**For tables with expandable rows, always include a chevron icon column:**

```tsx
<thead className="bg-gray-100 border-b border-gray-200">
  <tr>
    {/* Expand icon column - first column */}
    <th className="px-2 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider font-body w-10"></th>
    {/* Other columns... */}
  </tr>
</thead>
<tbody className="divide-y divide-gray-200">
  <tr
    className="hover:bg-gray-50 cursor-pointer transition-colors"
    onClick={() => setExpanded(!expanded)}
  >
    {/* Expand icon cell */}
    <td className="px-2 py-3 text-sm text-gray-500">
      {expanded ? (
        <ChevronDown className="w-4 h-4" />
      ) : (
        <ChevronRight className="w-4 h-4" />
      )}
    </td>
    {/* Other cells... */}
  </tr>
</tbody>
```

**Requirements:**
- **Position**: First column (leftmost) in the table
- **Width**: Fixed width `w-10` (40px) on header (compact to save space)
- **Icons**: ChevronRight (collapsed), ChevronDown (expanded)
- **Icon size**: `w-4 h-4` (16px)
- **Icon colour**: `text-gray-500`
- **Padding**: `px-2 py-3` (compact, matches other cells)
- **Always visible**: Don't hide on desktop (unlike older mobile-only patterns)
- **Purpose**: Provides clear visual affordance that row is expandable

**When to include:**
- ✅ Tables where rows expand to show additional inline details (RSVP details, payment schedules)
- ✅ All expandable data tables in the workspace
- ❌ Tables where rows navigate to a new page (no inline expansion)
- ❌ Simple read-only tables with no interaction

### Table Body - Interactive Rows

For tables where rows are clickable to show details or navigate:

```tsx
<tbody className="divide-y divide-gray-200">
  <tr className="hover:bg-gray-50 cursor-pointer transition-colors">
    <td className="px-2 py-3 text-sm text-gray-900">
      Content
    </td>
  </tr>
</tbody>
```

**Requirements:**
- Divider: `divide-y divide-gray-200` on tbody
- Hover: `hover:bg-gray-50` (subtle, clean)
- Cursor: `cursor-pointer` (indicates clickability)
- Transition: `transition-colors` (smooth hover)
- Cell padding: `px-2 py-3` (compact, matches header)
- Text: `text-sm text-gray-900` (primary content)

**Do NOT use:**
- ❌ Pink hover backgrounds (`bg-bridezilla-light-pink`) - too prominent for data tables
- ❌ Shadow effects (`hover:shadow-md`) - unnecessary visual noise
- ❌ Left border accents (`border-l-4`) - adds complexity
- ❌ `transition-all` - use `transition-colors` for performance
- ❌ Excessive padding (`px-4+`) - causes horizontal scrolling with many columns

### Table Body - View-Only Rows

For tables where actions are in specific columns only:

```tsx
<tbody className="divide-y divide-gray-200">
  <tr>
    <td className="px-4 md:px-6 py-3 md:py-4 text-sm text-gray-900">
      Content
    </td>
    <td className="px-4 md:px-6 py-3 md:py-4">
      <button className="px-3 py-1 rounded-full ...">Action</button>
    </td>
  </tr>
</tbody>
```

**Requirements:**
- NO hover background or cursor styles on row itself
- Actions isolated to specific cells with appropriate button styling
- Same padding and text styling as interactive rows

### Compact Table Design (No Horizontal Scrolling)

**Important:** All tables use compact padding to fit many columns without horizontal scrolling.

**Strategy:**
1. **Reduced padding**: Use `px-2 py-3` on all cells instead of `px-4 md:px-6 py-3 md:py-4`
2. **Concise headers**: Use short column names (e.g., "Cost" instead of "Total Cost")
3. **Narrow chevron column**: Use `w-10` (40px) for expand icon column
4. **All columns visible**: Show all information without hiding columns or causing horizontal scroll

### Mobile Responsive Pattern

Tables remain fully functional on mobile with horizontal scrolling when necessary:

**Desktop:** All columns visible, no scrolling needed due to compact padding
**Mobile/Tablet:** Horizontal scroll enabled, chevron icon indicates expandability for additional nested details

```tsx
{/* Compact header */}
<th className="px-2 py-3 text-xs font-bold text-gray-600 uppercase tracking-wider">
  Cost {/* Concise name */}
</th>

{/* Compact body cell */}
<td className="px-2 py-3 text-sm text-gray-900">
  Content
</td>

{/* Expanded detail row for nested data (not for hidden columns) */}
{expanded && (
  <tr>
    <td colSpan={totalColumns} className="px-2 py-3 bg-gray-50 border-t border-gray-100">
      {/* Payment schedules, nested details, etc. */}
    </td>
  </tr>
)}
```

### Nested Tables (Detail Rows)

For showing additional nested data like payment schedules within expanded rows:

```tsx
{expanded && (
  <tr>
    <td colSpan={N} className="px-4 md:px-6 py-3 md:py-4 bg-gray-50 border-t border-gray-200">
      <div className="space-y-2 mx-auto" style={{ maxWidth: '95%' }}>
        <h4 className="font-semibold text-gray-700 text-xs uppercase tracking-wide mb-2">
          Section Title
        </h4>
        <table className="w-full bg-white rounded border border-gray-200">
          <thead>
            <tr className="text-xs text-gray-600 border-b border-gray-200 bg-gray-100">
              <th className="text-left px-3 py-2 font-bold">Column</th>
            </tr>
          </thead>
          <tbody>
            <tr className="text-sm border-b border-gray-100 last:border-0">
              <td className="px-3 py-2 text-gray-900">Data</td>
            </tr>
          </tbody>
        </table>
      </div>
    </td>
  </tr>
)}
```

**Note:** Nested tables use `bg-gray-100` headers to match main table pattern.

### Usage Guidelines

**When to use clickable rows:**
- Table shows summary data with detailed view available
- Entire row represents a single entity (vendor, RSVP, couple)
- User expects to click anywhere on row to see more details

**When to use view-only rows:**
- Table is purely informational/read-only
- Actions are discrete and specific (edit one field, delete specific item)
- Nested tables showing related data (payment schedules, line items)

**Consistency Rules:**
- ✅ All main tables use `bg-gray-100` headers with `border-b border-gray-200`
- ✅ All clickable rows use `hover:bg-gray-50` (never pink)
- ✅ **All tables use compact padding: `px-2 py-3`** (prevents horizontal scrolling)
- ✅ **Expandable tables always show chevron icon in first column (visible on all screen sizes)**
- ✅ Chevron shows ChevronRight when collapsed, ChevronDown when expanded
- ✅ Chevron column width: `w-10` (40px, compact)
- ✅ Expanded details always use `bg-gray-50` background
- ✅ All header text uses `font-bold text-gray-600 uppercase tracking-wider`
- ✅ **Column headers use concise names** (e.g., "Cost" not "Total Cost", "Paid" not "Total Paid")
- ✅ No shadow effects or border accents on hover
- ✅ **No horizontal scrolling** - compact padding ensures tables fit viewport

---

## Form Elements

### Input Fields
```tsx
className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg
           focus:outline-none focus:border-bridezilla-pink resize-none"
```

### Select Dropdowns
```tsx
className="px-3 py-1.5 rounded-full text-sm font-semibold border-2
           border-transparent focus:ring-2 focus:ring-bridezilla-pink
           focus:border-transparent"
```

### Textarea
```tsx
className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-sm
           focus:ring-2 focus:ring-bridezilla-pink focus:border-transparent"
```

### Checkboxes

**Standard Checkbox Pattern (v2.7+)**

All checkboxes use this consistent, neutral pattern:

```tsx
<div className="flex-shrink-0 w-4 h-4 border border-stone-300 rounded flex items-center justify-center">
  {isSelected && (
    <Check className="w-3 h-3 text-stone-600" strokeWidth={2} />
  )}
</div>
```

**Specifications:**
- **Container size:** `w-4 h-4` (16px × 16px) - NOT 20px
- **Border:** `border` (1px) with `border-stone-300` (neutral gray)
- **Border style:** Thin 1px border, rounded corners
- **Checkmark icon:** Lucide-react `Check` component
- **Checkmark size:** `w-3 h-3` (12px × 12px)
- **Checkmark stroke:** `strokeWidth={2}` for subtle appearance
- **Checkmark color:** `text-stone-600` (neutral medium gray)

**Colors:**
- **Border:** `border-stone-300` (light gray, always neutral)
- **Checkmark:** `text-stone-600` (medium gray, always neutral)
- **NOT theme-aware:** Uses neutral colors regardless of Pop/Heirloom theme

**Used in:**
- SearchableMultiSelect dropdown options
- SelectVendorsModal vendor selection
- All filter and selection interfaces

**Why this pattern:**
- Consistent sizing across all interfaces
- Neutral colors that don't distract from content
- Thin border (1px) for subtle appearance
- Light stroke weight (2) for clean, minimal look

---

## Status Badges

### Vendor Status Colours (Shared Workspace)
```tsx
const STATUS_COLOURS = {
  'Not Reviewed': 'bg-gray-100 text-gray-700',
  'Interested': 'bg-blue-100 text-blue-700',
  'Contacted': 'bg-orange-100 text-orange-700',
  'Quoted': 'bg-purple-100 text-purple-700',
  'Booked': 'bg-bridezilla-pink/20 text-bridezilla-pink',
  'Pass': 'bg-red-100 text-red-700'
}
```

### Payment/Completion Status Colours (Admin)
```tsx
const PAYMENT_STATUS = {
  'Paid': 'bg-green-100 text-green-700',      // Green for completed
  'Pending': 'bg-yellow-100 text-yellow-700', // Yellow for pending
  'Overdue': 'bg-red-100 text-red-700'        // Red for overdue
}
```

### Operation Badges
```tsx
// CREATE Badge
className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-lg font-semibold"

// UPDATE Badge
className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-lg font-semibold"
```

---

## Notifications

### Success Notification (Blue)
```tsx
bgColor: 'bg-blue-50'
borderColor: 'border-blue-200'
iconColor: 'text-blue-600'
titleColor: 'text-blue-900'
textColor: 'text-blue-700'
```

### Error Notification (Red)
```tsx
bgColor: 'bg-red-50'
borderColor: 'border-red-200'
iconColor: 'text-red-600'
titleColor: 'text-red-900'
textColor: 'text-red-700'
```

### Warning Notification (Yellow)
```tsx
bgColor: 'bg-yellow-50'
borderColor: 'border-yellow-200'
iconColor: 'text-yellow-600'
titleColor: 'text-yellow-900'
textColor: 'text-yellow-700'
```

---

## Icons

### Icon Library
Using `lucide-react` for all icons

### Icon Sizes
- **Small:** `w-4 h-4` (16px)
- **Medium:** `w-5 h-5` (20px)
- **Large:** `w-6 h-6` (24px)
- **Extra Large:** `w-8 h-8` (32px)

### Common Icons
- **CheckCircle:** Success states, booked status, completed actions
- **AlertCircle:** Error states, warnings
- **Info:** Informational messages
- **X:** Close buttons, remove actions
- **Mail:** Email invitations, contact actions
- **Sparkles:** AI features, "Ask Bridezilla"
- **Calendar:** Date fields, wedding dates
- **Users:** Couple information
- **Heart:** Love/favourite actions

---

## Gradients

### Primary Gradient (Pink to Orange)
```tsx
className="bg-gradient-to-r from-bridezilla-pink to-bridezilla-orange"
// Or diagonal: bg-gradient-to-br
```
**Usage:** Headers, featured CTAs, email headers

### Pink Gradient (Light to Dark)
```tsx
className="bg-gradient-to-br from-bridezilla-pink to-pink-600"
```
**Usage:** Icon backgrounds, accent elements

---

## Animation & Transitions

### Standard Transitions
```tsx
className="transition-colors duration-200"  // Colour changes
className="transition-opacity duration-200"  // Opacity changes
className="transition-all duration-200"      // Multiple properties
```

### Loading States
```tsx
// Spinner
<Loader2 className="w-5 h-5 animate-spin" />

// Disabled State
className="disabled:opacity-50 disabled:cursor-not-allowed"
```

---

## Accessibility

### Focus States
Always include visible focus states:
```tsx
className="focus:ring-2 focus:ring-bridezilla-pink focus:outline-none"
```

### Disabled States
```tsx
className="disabled:opacity-50 disabled:cursor-not-allowed"
```

### Labels
Always include labels for form fields:
```tsx
<label className="block text-sm font-medium text-gray-700 mb-2">
  Field Label <span className="text-red-500">*</span>
</label>
```

---

## Responsive Design

### Breakpoints (Tailwind defaults)
- **sm:** 640px
- **md:** 768px (most commonly used)
- **lg:** 1024px
- **xl:** 1280px

### Mobile-First Approach
```tsx
// Base styles = mobile
// md: prefix = tablet and up
className="text-sm md:text-base p-3 md:p-6"
```

---

## Component Patterns

### Modal Header
```tsx
<div className="sticky top-0 bg-white border-b-2 border-gray-200 px-6 py-4
                flex items-center justify-between">
  <div className="flex items-center gap-3">
    <div className="w-10 h-10 bg-gradient-to-br from-bridezilla-pink
                    to-pink-600 rounded-lg flex items-center justify-center">
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div>
      <h2 className="text-xl font-bold text-gray-900">Modal Title</h2>
      <p className="text-sm text-gray-600">Subtitle</p>
    </div>
  </div>
  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
    <X className="w-6 h-6 text-gray-600" />
  </button>
</div>
```

### Modal Container & Z-Index Layering

**ALL modals use consistent container pattern with proper z-index stacking:**

```tsx
// Standard Modal (floats above navigation with sticky header and footer)
import { createPortal } from 'react-dom'

function MyModal({ onClose }) {
  // CRITICAL: Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  const modalContent = (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-lg z-[100] flex items-center justify-center p-4"
      style={{ WebkitBackdropFilter: 'blur(20px)', backdropFilter: 'blur(20px)' }}
    >
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[95vh] border border-stone-200 overflow-hidden flex flex-col">
        {/* Header - NO rounded-t-2xl here */}
        <div className="bg-white border-b border-stone-200 px-8 py-6 flex justify-between items-center flex-shrink-0">
          <h3 className="font-display text-2xl md:text-3xl">Modal Title</h3>
          <button><X size={20} /></button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-8 py-8">
          {/* Content here */}
        </div>

        {/* Sticky Footer */}
        <div className="bg-white border-t border-stone-200 px-8 py-6 flex gap-3 flex-shrink-0">
          <button>Cancel</button>
          <button>Confirm</button>
        </div>
      </div>
    </div>
  )

  // CRITICAL: Use portal to render at document.body for proper z-index stacking
  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : null
}

// Stacked Modal (appears on top of another modal)
const modalContent = (
  <div
    className="fixed inset-0 bg-black/80 backdrop-blur-lg z-[110] flex items-center justify-center p-4"
    style={{ WebkitBackdropFilter: 'blur(20px)', backdropFilter: 'blur(20px)' }}
  >
    {/* Same structure as above */}
  </div>
)

return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : null
```

**Z-Index Hierarchy:**
- **Navigation bars:** `z-40` (AdminNavigation, PlannerNavigation)
- **Standard modals:** `z-[100]` (floats above navigation with backdrop blur)
- **Stacked modals:** `z-[110]` (e.g., EmailPreviewModal on top of SelectVendorsModal)

**Critical Requirements:**
- ✅ **Z-index:** Always use `z-[100]` for standard modals (NOT `z-[60]` or `z-50`)
- ✅ **Portal rendering:** MUST use `createPortal(modalContent, document.body)` to render at document root for proper z-index stacking
- ✅ **Backdrop blur:** Use `backdrop-blur-lg` with 80% black overlay (`bg-black/80`) for strong visual separation (v2.7+)
- ✅ **Safari support:** Include inline style `WebkitBackdropFilter: 'blur(20px)'` for older Safari versions
- ✅ **Body scroll lock:** MUST prevent body scrolling with `document.body.style.overflow = 'hidden'` in useEffect
- ✅ **Positioning:** Use `fixed inset-0` to cover entire viewport including navigation
- ✅ **Container:** `rounded-2xl overflow-hidden flex flex-col` - overflow-hidden prevents scrollbar from breaking rounded corners
- ✅ **Layout:** Flex column with header (`flex-shrink-0`), scrollable content (`flex-1 overflow-y-auto`), and sticky footer (`flex-shrink-0`)
- ✅ **Max height:** `max-h-[95vh]` to prevent modal from exceeding viewport
- ✅ **Padding:** `p-4` on outer backdrop container for consistent spacing
- ✅ **No rounded classes on header/footer:** Container's `overflow-hidden` handles corner clipping - DO NOT add `rounded-t-2xl` to header

**Why This Matters:**
- Modals must float above navigation bars (z-40) with clear visual separation
- **Portal rendering** ensures modal renders at document.body, bypassing any parent stacking contexts that could interfere with z-index
- **Stronger backdrop** (`backdrop-blur-lg` + `bg-black/80` with 20px blur) provides excellent focus and dramatically reduces visual noise (v2.7+)
- **Body scroll lock** prevents awkward scrolling behaviour and ensures modal stays properly positioned
- **Safari support** (WebkitBackdropFilter) ensures consistent blur across all browsers
- `overflow-hidden` on container prevents scrollbar from creating square corners
- Sticky footer ensures CTA buttons are always visible when scrolling long content
- `flex-shrink-0` prevents header/footer from shrinking when content is small
- High z-index (z-[100]) prevents any stacking issues across the application
- Consistent pattern eliminates z-index bugs, scrollbar issues, background scroll, and visual inconsistencies

### Modal Header Pattern

**ALL modals use the same clean, consistent pattern:**

```tsx
<div className="bg-white border-b border-stone-200 px-8 py-6 flex justify-between items-center flex-shrink-0">
  <h3 className={`font-display text-2xl md:text-3xl ${theme.textPrimary}`}>
    Modal Title
  </h3>
  <button
    onClick={onClose}
    className={`${theme.textMuted} hover:${theme.textSecondary} transition-colors`}
  >
    <X size={20} />
  </button>
</div>

<div className="flex-1 overflow-y-auto px-8 py-8">
  {/* Content */}
</div>
```

**Specifications:**
- **Header:** Clean white header with title and close button only
- **NO rounded-t-2xl:** Container's `overflow-hidden` handles corner rounding - adding `rounded-t-2xl` to header is redundant and causes issues
- **No icons, gradients, or subtitles** in header
- **Border:** Single pixel `border-b border-stone-200` (NOT `border-b-2`)
- **Padding:** `px-8 py-6` (NOT `px-6 py-4`)
- **Typography:** `font-display text-2xl md:text-3xl` (NOT `text-xl font-bold`)
- **Close button:** Small X icon with `size={20}`
- **Body padding:** `px-8 py-8` with `flex-1 overflow-y-auto` for scrolling

**Used in ALL modals:**
- AI modals: `AskBridezillaVendorModal`, `AskBridezillaCoupleModal`, `BulkImportModal`
- Feature modals: `AddVendorModal`, `InviteCoupleModal`, `CompleteDetailsModal`, `PaymentReminderSettingsModal`, `EmailPreviewModal`, `SelectVendorsModal`
- Admin forms: `VendorForm` (Add/Edit Vendor)

✅ **Single consistent pattern across all admin and planner workspaces.**

### Information Callout
```tsx
<div className="bg-yellow-50 border-left-4 border-yellow-400
                p-4 rounded-lg">
  <p className="text-sm text-yellow-900">
    <strong>Note:</strong> Important information here
  </p>
</div>
```

---

## Email Templates

### Standardized Heirloom Theme for All Emails

**Design Philosophy:** All email templates use the elegant Heirloom theme (dark green #1b3b2b) for a sophisticated, timeless appearance that works universally regardless of the sender's workspace theme preference.

**Why Heirloom for All Emails:**
- ✅ **Professional appearance:** Dark green conveys elegance and sophistication
- ✅ **Universal appeal:** Works for traditional and modern weddings
- ✅ **Brand consistency:** All couples receive the same elegant email aesthetic
- ✅ **Simplicity:** No need for theme-aware email generation
- ✅ **Timeless:** Heirloom palette has broader, more upscale appeal than Pop theme

### Email Template Structure

**VendorInviteEmailTemplate Pattern:**

```tsx
<div className="bg-white rounded-lg overflow-hidden">
  {/* Header - Heirloom dark green */}
  <div className="p-6" style={{ backgroundColor: '#1b3b2b' }}>
    <Image src="/images/bridezilla-logo-white.svg" alt="Bridezilla" />
  </div>

  {/* Email Body */}
  <div className="p-8 space-y-6">
    <h1 className="text-3xl font-semibold text-gray-900">
      Hi {coupleName}!
    </h1>

    <p className="text-base text-gray-700 leading-relaxed">
      Email message content...
    </p>

    {/* Content Box */}
    <div className="bg-stone-50 border border-stone-200 rounded-xl p-6">
      <h2 className="text-xs font-semibold text-stone-600 uppercase">
        Section Title:
      </h2>
      <ul className="space-y-3 text-sm text-stone-700">
        <li className="flex items-start gap-3">
          <span className="font-semibold text-base" style={{ color: '#1b3b2b' }}>✓</span>
          <span>List item content</span>
        </li>
      </ul>
    </div>

    {/* CTA Button - Heirloom dark green */}
    <div className="pt-4">
      <a
        href="#"
        className="inline-block px-6 py-3 text-white text-sm font-semibold rounded-lg"
        style={{ backgroundColor: '#1b3b2b' }}
      >
        Button Text
      </a>
    </div>
  </div>
</div>
```

### Email Color Standards

**Required Colors (Heirloom Theme):**
- **Header background:** `#1b3b2b` (dark forest green) via inline style
- **Checkmarks/bullets:** `#1b3b2b` via inline style
- **CTA buttons:** `#1b3b2b` via inline style
- **Logo:** White version (`bridezilla-logo-white.svg`) for dark header

**Body Colors (Neutral):**
- **Headings:** `text-gray-900`
- **Body text:** `text-gray-700`
- **Content boxes:** `bg-stone-50` with `border-stone-200`
- **Section labels:** `text-stone-600`

### Email Preview Modal Pattern

**Modal Structure:**
```tsx
<div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[110]">
  <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] border border-stone-200">
    {/* Header with rounded-t-2xl */}
    <div className="border-b border-stone-200 px-8 py-6 rounded-t-2xl">
      <h3 className="font-display text-2xl md:text-3xl">Email Preview</h3>
    </div>

    {/* Preview Content */}
    <div className="flex-1 overflow-y-auto px-8 py-8 bg-stone-50">
      <VendorInviteEmailTemplate />
    </div>

    {/* Footer Actions */}
    <div className="border-t border-stone-200 px-8 py-6">
      <button>Share & Send Email</button>
    </div>
  </div>
</div>
```

**Critical Requirements:**
- ✅ Modal header must have `rounded-t-2xl` to match container
- ✅ Modal container must have `border border-stone-200` for definition
- ✅ Use `z-[110]` for stacked modal (appears over SelectVendorsModal)
- ✅ Preview content area uses `bg-stone-50` to differentiate from email white

### Implementation Guidelines

**When Creating Email Templates:**
1. Always use Heirloom dark green (#1b3b2b) for branding elements
2. Use inline styles (`style={{ backgroundColor: '#1b3b2b' }}`) instead of Tailwind classes for email compatibility
3. Include white logo version in dark header
4. Use neutral stone/gray colors for body content
5. Maintain consistent spacing and typography
6. Test email rendering in preview modal before sending

**Files to Reference:**
- `components/planner/VendorInviteEmailTemplate.tsx` - Standard template structure
- `components/planner/EmailPreviewModal.tsx` - Preview modal pattern

---

## Common Mistakes to Avoid

### ❌ Controls Container Mistakes

**Height/Padding Issues:**
- ❌ Using `py-2 md:py-3` on filter buttons (causes height differences)
- ❌ Using `shadow-lg` instead of `shadow` on controls container
- ❌ Using `border-2 border-gray-200` instead of `shadow` on controls container
- ❌ Adding `flex-1` to filter or button groups (causes layout issues)
- ❌ Using different padding patterns across different views

**✅ Correct Pattern:**
- ✅ Always use `py-2` (fixed vertical padding) on all controls
- ✅ Use `shadow` (not `shadow-lg`) on controls container
- ✅ Use `px-3 md:px-4 py-2` for consistent button sizing
- ✅ Never add `flex-1` to filter/button group wrappers
- ✅ Follow the exact controls container structure documented above

---

### ❌ Stats Card Mistakes

**Grid Layout:**
- ❌ Using `grid-cols-3` instead of `grid-cols-4`
- ❌ Using `grid-cols-1 md:grid-cols-4` (inconsistent mobile view)
- ❌ Showing fewer than 4 cards

**Styling:**
- ❌ Missing icons in stats cards
- ❌ Using borders instead of `shadow-lg`
- ❌ Fixed padding (`p-6`) instead of responsive (`p-3 md:p-6`)

**✅ Correct Pattern:**
- ✅ Always use `grid-cols-2 md:grid-cols-4` (2 columns mobile, 4 desktop)
- ✅ Always show exactly 4 stats cards
- ✅ Include icons: `w-6 h-6 md:w-8 md:h-8`
- ✅ Use `shadow-lg` with colored borders (`border-2 border-COLOR/20`)
- ✅ Use responsive padding: `p-3 md:p-6`

---

### ❌ Button & Colour Mistakes

**Action Buttons:**
- ❌ Using `green-*` or `blue-*` for action buttons
- ❌ Using responsive text sizing (`text-sm md:text-base`) on buttons
- ❌ Inconsistent padding patterns across buttons

**Status Indicators:**
- ❌ Mixing action and status colours (e.g., green buttons instead of status pills)

**✅ Correct Pattern:**
- ✅ **Action buttons:** Pink (primary) → Orange (secondary) → Gray (tertiary) → Red (destructive)
- ✅ **Status indicators:** Green (completed) / Blue (info) / Yellow (pending) / Red (error)
- ✅ Always use `text-sm font-semibold` (no responsive text) on buttons
- ✅ Always use `px-3 md:px-4 py-2` for button padding
- ✅ Keep semantic colour meanings consistent

---

### ❌ General Layout Mistakes

**Container Width:**
- ❌ Using `max-w-7xl` for containers (too wide)
- ❌ Using fixed pixel widths

**Spacing:**
- ❌ Inconsistent spacing between mobile and desktop
- ❌ Missing responsive variants

**Interactive Elements:**
- ❌ Missing hover/focus states
- ❌ Inconsistent transition styles

**✅ Correct Pattern:**
- ✅ Use `max-w-6xl` for all container widths
- ✅ Always provide responsive spacing variants (`gap-3 md:gap-4`)
- ✅ Include hover and focus states on all interactive elements
- ✅ Use consistent transitions (`transition-all`, `transition-colors`)

---

## Quick Reference

### Workspace Theme Colours Summary

**Planner Workspace (Theme-Aware):**
| Property | Pop Theme | Heirloom Theme | Access Via |
|----------|-----------|----------------|-----------|
| Page Background | `bg-bridezilla-blue` (#5B9BD5) | `bg-[#FAF9F6]` | `theme.pageBackground` |
| Primary Button | `bg-bridezilla-pink` (#ec4899) | `bg-[#1b3b2b]` | `theme.primaryButton` |
| Primary Hover | `hover:bg-bridezilla-orange` (#f97316) | `hover:bg-[#2F5249]` | `theme.primaryButtonHover` |
| Nav Active | `text-bridezilla-orange` (#f97316) | `text-[#B76E79]` | `theme.navActive` |

**Admin Workspace (Fixed Colours):**
| Use Case | Colour | Tailwind Class |
|----------|--------|---------------|
| Primary Button | Pink | `bg-bridezilla-pink` |
| Secondary Button | Orange | `bg-bridezilla-orange` |
| Tertiary Button | Gray | `bg-gray-200` or `border-gray-200` |
| Error/Destructive | Red | `bg-red-600` |

**Status Indicators (Universal):**
| Use Case | Colour | Tailwind Class |
|----------|--------|---------------|
| Success/Paid | Green | `bg-green-100 text-green-700` |
| Info/Signed | Blue | `bg-blue-100 text-blue-700` |
| Warning/Pending | Yellow | `bg-yellow-100 text-yellow-700` |
| In Progress | Orange | `bg-orange-100 text-orange-700` |
| Error/Overdue | Red | `bg-red-100 text-red-700` |

### Spacing Scale
- **xs:** `p-2` (0.5rem / 8px)
- **sm:** `p-3` (0.75rem / 12px)
- **md:** `p-4` (1rem / 16px)
- **lg:** `p-6` (1.5rem / 24px)
- **xl:** `p-8` (2rem / 32px)

### Border Radius
- **Small:** `rounded-lg` (0.5rem / 8px)
- **Medium:** `rounded-xl` (0.75rem / 12px)
- **Large:** `rounded-2xl` (1rem / 16px)
- **Full:** `rounded-full` (9999px)

---

## Known Inconsistencies

~~All major inconsistencies have been resolved!~~

### Previously Fixed:
1. ✅ **DashboardTab Stats Font** - Standardised to `text-2xl md:text-3xl font-semibold`
2. ✅ **Controls Container Patterns** - Standardised to `rounded-xl shadow p-3 md:p-4`
3. ✅ **Button Padding Variants** - Standardised to `px-3 md:px-4 py-2`

---

## Remaining Minor Variations

### Icon Sizing in Stats Cards

VendorsTab uses fixed `w-5 h-5` icon sizing while other stats cards use responsive `w-6 h-6 md:w-8 md:h-8`. This is a minor variation that can be standardised if desired but is low priority.

---

## Troubleshooting Guide

### "Controls container looks taller in one view than another"

**Symptoms:**
- Filter/controls bar has different height between admin and planner views
- Buttons appear larger even though classes look the same

**Common Causes & Fixes:**

1. **Responsive vertical padding on filter buttons**
   - ❌ Problem: `py-2 md:py-3` on filter buttons
   - ✅ Fix: Change to `py-2` (no responsive vertical padding)

2. **Wrong shadow on outer container**
   - ❌ Problem: `shadow-lg` instead of `shadow`
   - ✅ Fix: Change to `shadow` only

3. **Border instead of shadow**
   - ❌ Problem: `border-2 border-gray-200` on controls container
   - ✅ Fix: Remove border, use `shadow` instead

4. **Flex-1 on filter group**
   - ❌ Problem: `<div className="flex gap-2 flex-wrap flex-1">`
   - ✅ Fix: Remove `flex-1` from filter group wrapper

5. **Flex-1 on search input wrapper**
   - ❌ Problem: `<div className="flex-1 min-w-[200px]">` around search input
   - ✅ Fix: Change to `<div className="min-w-[200px]">` (remove `flex-1`)

6. **Border-2 on inputs or buttons**
   - ❌ Problem: Any control has `border-2` (search inputs, filter buttons, etc.)
   - ✅ Fix: Change to `border` (single pixel) for consistent height across all controls

7. **Missing text-sm font-semibold on search input**
   - ❌ Problem: Search input missing `text-sm font-semibold` classes
   - ✅ Fix: Add `text-sm font-semibold` to match selects exactly (affects line-height)

8. **Inconsistent padding on container**
   - ❌ Problem: Fixed `p-4` or different padding values
   - ✅ Fix: Use `p-3 md:p-4` consistently

---

### "Stats cards look different across views"

**Symptoms:**
- Some views show 3 columns, others show 4
- Missing icons or different styling
- Cards have different padding or shadows

**Common Causes & Fixes:**

1. **Wrong grid columns**
   - ❌ Problem: `grid-cols-2 md:grid-cols-3` or `grid-cols-1 md:grid-cols-4`
   - ✅ Fix: Always use `grid-cols-2 md:grid-cols-4`

2. **Missing icons**
   - ❌ Problem: Stats cards without icons
   - ✅ Fix: Add icons with `w-6 h-6 md:w-8 md:h-8`

3. **Wrong shadow or border**
   - ❌ Problem: `shadow` or `border-2 border-gray-200` only
   - ✅ Fix: Use `shadow-lg` + `border-2 border-COLOR/20`

4. **Fixed padding**
   - ❌ Problem: `p-6` (no responsive)
   - ✅ Fix: Use `p-3 md:p-6` (responsive)

---

### "Buttons look different sizes across pages"

**Symptoms:**
- Same button classes but different visual sizes
- Buttons are inconsistent between admin and planner

**Common Causes & Fixes:**

1. **Parent container issues** (most common!)
   - ❌ Problem: Different padding/gap on parent controls container
   - ✅ Fix: Ensure parent follows controls container pattern exactly

2. **Responsive text sizing**
   - ❌ Problem: `text-sm md:text-base` on buttons
   - ✅ Fix: Use `text-sm` only (no responsive text)

3. **Inconsistent padding**
   - ❌ Problem: `px-4 py-2` or `px-3 py-3`
   - ✅ Fix: Use `px-3 md:px-4 py-2` consistently

---

### Quick Verification Checklist

When adding or modifying workspace UI components, verify:

**Layout & Structure:**
- [ ] Controls container uses `shadow` (not `shadow-lg` or borders)
- [ ] Controls container padding is `p-3 md:p-4`
- [ ] All controls use `py-2` (no responsive vertical padding)
- [ ] Filter buttons use `px-3 md:px-4 py-2`
- [ ] Action buttons use `px-3 md:px-4 py-2`
- [ ] No `flex-1` on filter or button group wrappers
- [ ] Stats cards use `grid-cols-2 md:grid-cols-4`
- [ ] Stats cards have icons sized `w-6 h-6 md:w-8 md:h-8`
- [ ] Stats cards use `shadow-lg` + coloured borders
- [ ] Stats cards padding is `p-3 md:p-6`
- [ ] All gaps use responsive pattern: `gap-3 md:gap-4` or `gap-2 md:gap-4`

**Theme Support (for planner routes only):**
- [ ] Component uses `useThemeStyles()` hook for colours
- [ ] No hardcoded colour values (use theme tokens instead)
- [ ] Tested in both Pop and Heirloom themes
- [ ] Contrast ratios meet WCAG AA in both themes

**General:**
- [ ] No changes made to wedding website routes

---

## 🔍 Quick Reference: Wedding Website vs Workspace

| Aspect | 🌿 Wedding Website | 💼 Admin Workspace | 💼 Planner Workspace |
|--------|-------------------|-------------------|---------------------|
| **Routes** | `/`, `/itinerary`, `/rsvp`, `/accommodation`, `/travel`, `/faq` | `/admin/*` | `/planner/*` |
| **Theme Support** | No themes | No themes | Pop & Heirloom themes |
| **Primary Colour** | Green (`primary-600` = `#16a34a`) | Pink (`bridezilla-pink` = `#ec4899`) | Pop: Pink (#ec4899)<br>Heirloom: Dark green (#1b3b2b) |
| **Background** | `bg-gradient-to-b from-green-50 via-green-100/50` | `bg-white` with coloured borders | Pop: Blue (#5B9BD5)<br>Heirloom: Cream (#FAF9F6) |
| **Colour Access** | Direct Tailwind classes | Hardcoded `bridezilla-pink`, `bridezilla-orange` | `useThemeStyles()` hook |
| **Button Style** | `bg-primary-600 hover:bg-primary-700 rounded-full` | `bg-bridezilla-pink hover:scale-105 rounded-full` | `theme.primaryButton` `theme.primaryButtonHover` |
| **Typography** | `font-display` (Playfair Display) for headings | `font-heading` (Bebas Neue) for headings | `font-heading` (Bebas Neue) for headings |
| **Table Padding** | N/A (no tables) | `px-2 py-3` (compact) | `px-2 py-3` (compact) |
| **Forms** | `focus:ring-primary-500` | `focus:ring-bridezilla-pink` | Pop: `focus:ring-bridezilla-pink`<br>Heirloom: `focus:ring-[#1b3b2b]` |
| **Mood** | Romantic, elegant, natural | Modern, energetic, branded | Pop: Fun, playful<br>Heirloom: Elegant, refined |
| **Target Audience** | Wedding guests | Couples (admin features) | Planners (professional workspace) |

### Common Mistakes to Avoid

**❌ DON'T:**
- Use `bridezilla-pink` or workspace colours on wedding website pages
- Use `primary-*` (green) colours on workspace pages
- Mix wedding and workspace styles
- Apply compact workspace table styles to wedding content
- Use workspace stats cards on wedding pages
- Hardcode colours in planner components (use `useThemeStyles()` instead)
- Assume admin and planner use the same colour approach (admin is hardcoded, planner uses themes)
- Forget to test planner features in both Pop and Heirloom themes

**✅ DO:**
- Check the current route before choosing colours
- Wedding website: Use green (`primary-*`) for ALL interactive elements
- Admin workspace: Use hardcoded `bridezilla-pink` and `bridezilla-orange`
- Planner workspace: Use `useThemeStyles()` hook for all colours
- Maintain separate, distinct aesthetics for each system
- Test both themes (Pop and Heirloom) when building planner features
- Test all three systems after making changes to shared components (like Navigation)

---

**For questions or design system updates, contact the Bridezilla team.**
