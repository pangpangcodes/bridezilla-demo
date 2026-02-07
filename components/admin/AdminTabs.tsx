'use client'

import { Users, Briefcase } from 'lucide-react'

export type AdminTab = 'rsvp' | 'vendors'

interface AdminTabsProps {
  activeTab: AdminTab
  onTabChange: (tab: AdminTab) => void
}

export default function AdminTabs({ activeTab, onTabChange }: AdminTabsProps) {
  const tabs = [
    { id: 'rsvp' as AdminTab, label: 'RSVP Tracking', icon: Users },
    { id: 'vendors' as AdminTab, label: 'Vendor Management', icon: Briefcase },
  ]

  return (
    <div className="bg-white rounded-xl shadow mb-6 sticky top-20 z-10">
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-semibold transition-colors ${
                isActive
                  ? 'bg-gray-900 text-white border-b-2 border-gray-900'
                  : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
