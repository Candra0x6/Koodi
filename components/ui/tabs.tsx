"use client"

import { cn } from "@/lib/utils"

export const Tabs = ({
  tabs,
  activeTab,
  onChange,
}: { tabs: string[]; activeTab: string; onChange: (tab: string) => void }) => (
  <div className="flex p-1 bg-muted rounded-2xl border-2 border-border">
    {tabs.map((tab) => (
      <button
        key={tab}
        onClick={() => onChange(tab)}
        className={cn(
          "flex-1 py-2 px-4 rounded-xl text-sm font-bold uppercase tracking-wide transition-all",
          activeTab === tab
            ? "bg-background text-primary shadow-sm border-2 border-border"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        {tab}
      </button>
    ))}
  </div>
)
