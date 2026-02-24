# Hardcoded Colours Audit

Audit of components using hardcoded Tailwind colour classes instead of theme tokens from `lib/themes.ts`.

**Theme tokens available:**
- `theme.error` — `{ bg: 'bg-red-50', text: 'text-red-700' }`
- `theme.warning` — `{ bg: 'bg-amber-50', text: 'text-amber-700' }`
- `theme.success` — `{ bg: 'bg-emerald-50', text: 'text-emerald-700' }`

**Date:** 2026-02-12

---

## Priority 1 — Error Banners

These use `bg-red-50 border-red-200 text-red-700` instead of `theme.error.*`.

| File | Lines | Context |
|------|-------|---------|
| `components/admin/AdminAuth.tsx` | ~50 | Authentication error display |
| `components/admin/BulkImportModal.tsx` | ~236 | Error message in bulk import |
| `components/admin/CompleteDetailsModal.tsx` | ~242, ~314 | Error display in vendor details completion |
| `components/admin/VendorForm.tsx` | ~700 | Form validation error |
| `components/planner/SelectVendorsModal.tsx` | ~323 | Error in vendor selection |
| `components/planner/AskBridezillaCoupleModal.tsx` | ~202, ~437 | API/validation errors |
| `components/planner/AskBridezillaVendorModal.tsx` | ~362, ~432, ~591 | API/validation errors |
| `components/planner/AddVendorModal.tsx` | ~349 | Error message |
| `components/planner/InviteCoupleModal.tsx` | ~286 | Error display |

## Priority 2 — Warning/Info Sections

These use `bg-amber-50`/`bg-yellow-50` instead of `theme.warning.*`.

| File | Lines | Context |
|------|-------|---------|
| `components/admin/BulkImportModal.tsx` | ~243 | Clarifications needed section |
| `components/planner/AskBridezillaCoupleModal.tsx` | ~351, ~387 | Warnings and clarifications |
| `components/planner/AskBridezillaVendorModal.tsx` | ~511 | Clarifications needed section |
| `components/planner/VendorLibraryOperationCard.tsx` | ~335 | Warnings section |

## Priority 3 — Partial Theme Usage

| File | Lines | Issue |
|------|-------|-------|
| `components/planner/Notification.tsx` | ~39, ~47, ~62-66 | Uses `theme.error.bg`/`theme.success.bg` but hardcodes border (`border-red-200`) and icon (`text-red-600`) colours. `info` and `warning` types fully hardcoded. |
| `components/admin/ConfidenceBadge.tsx` | ~7 | Uses `bg-red-100` instead of `bg-red-50` for low confidence |

## No Action Needed

| File | Reason |
|------|--------|
| `components/planner/PlannerVendorCard.tsx` | Contextual status badges (data-driven colour coding) |
| `components/admin/VendorsTab.tsx` payment timeline | Overdue/due-soon colour coding is contextual |
| `components/ValidationNotifications.tsx` | Dev-only component with intentional vibrant styling |

---

## Already Fixed (2026-02-12)

These were updated to use theme tokens as part of the graceful error handling work:

- `components/planner/CouplesCalendarView.tsx`
- `components/planner/VendorLibraryTab.tsx`
- `components/planner/CoupleDetail.tsx`
- `components/admin/VendorsTab.tsx` (error state in table)
- `components/admin/RSVPTab.tsx`
- `components/admin/DashboardTab.tsx`
- `components/shared/SharedWorkspace.tsx`
