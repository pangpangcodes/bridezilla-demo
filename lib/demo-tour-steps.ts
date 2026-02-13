export interface DemoStep {
  title: string
  description: string
  highlightId?: string
  actionRequired?: boolean
}

export const PLANNER_TOUR_STEPS: DemoStep[] = [
  {
    title: 'Welcome to Your Planner',
    description:
      'Your command centre for managing wedding couples. Let\'s walk through the key features.',
  },
  {
    title: 'Your Couples Database',
    description:
      'All your couples at a glance. Try "Ask Bridezilla" to add a new couple - just paste their details and our AI organizes everything for you.',
    highlightId: 'tour-ask-bridezilla-couples',
  },
  {
    title: 'Inside a Couple\'s File',
    description:
      'Click on Bella & Edward\'s file to explore their wedding workspace.',
    highlightId: 'tour-couple-bella',
    actionRequired: true,
  },
  {
    title: 'The Shared Portal',
    description:
      'This is what makes Bridezilla special. Click "Preview Portal" to see what your couple sees - they can review vendors and approve recommendations without needing a login.',
    highlightId: 'tour-preview-portal',
    actionRequired: true,
  },
  {
    title: 'Your Vendor Library',
    description:
      'Your curated vendor collection. Click "Vendors" to explore it.',
    highlightId: 'tour-nav-vendors',
    actionRequired: true,
  },
  {
    title: 'Add Vendors with AI',
    description:
      'Hit "Ask Bridezilla" to add vendors instantly - upload any PDF files or input any text and AI does the rest.',
    highlightId: 'tour-ask-bridezilla-vendors',
  },
  {
    title: 'You\'re All Set!',
    description:
      'Start inviting couples, building your vendor library, and sharing recommendations through your branded portal.',
  },
]

export const COUPLES_TOUR_STEPS: DemoStep[] = [
  {
    title: 'Welcome to Your Wedding Hub',
    description:
      'Everything you need to plan your big day, all in one place. Let\'s take a quick look around.',
  },
  {
    title: 'Your Dashboard',
    description:
      'Your wedding at a glance - guest counts, upcoming payments, and milestones.',
  },
  {
    title: 'RSVP Tracking',
    description:
      'Track who\'s attending, dietary needs, and plus-ones. Click "RSVP Tracking" to explore it.',
    highlightId: 'tour-nav-rsvp',
    actionRequired: true,
  },
  {
    title: 'Your Vendor Team',
    description:
      'Manage all your wedding vendors in one place - track contracts, payments, and contact details. Click "Vendor Management" to explore it.',
    highlightId: 'tour-nav-vendors-couples',
    actionRequired: true,
  },
  {
    title: 'Add Vendors with AI',
    description:
      'Hit "Ask Bridezilla" to add vendors instantly - just paste your vendor details and AI organizes everything for you.',
    highlightId: 'tour-ask-bridezilla-vendors-couples',
  },
  {
    title: 'You\'re All Set!',
    description:
      'Start managing your vendors, track your RSVPs, or visit your live wedding website using "View Website" in the navigation above.',
    highlightId: 'tour-nav-view-website',
  },
]
