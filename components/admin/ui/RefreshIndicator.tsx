// components/admin/ui/RefreshIndicator.tsx

'use client'

import { RefreshCw, Pause, Play } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface RefreshIndicatorProps {
  lastUpdated: Date | null
  isRefreshing: boolean
  isPaused: boolean
  onManualRefresh: () => void
  onPause: () => void
  onResume: () => void
  intervalSeconds: number
}

export function RefreshIndicator({
  lastUpdated,
  isRefreshing,
  isPaused,
  onManualRefresh,
  onPause,
  onResume,
  intervalSeconds,
}: RefreshIndicatorProps) {
  return (
    <div className="flex items-center gap-2 text-sm">
      
      {/* Last updated timestamp */}
      <span className="text-[#8B949E] hidden sm:block">
        {lastUpdated
          ? `Updated ${formatDistanceToNow(lastUpdated, { addSuffix: true })}`
          : 'Loading...'}
      </span>

      {/* Interval label */}
      {!isPaused && (
        <span className="text-[#8B949E] text-xs hidden md:block">
          (every {intervalSeconds}s)
        </span>
      )}

      {/* Manual refresh button */}
      <button
        type="button"
        onClick={onManualRefresh}
        disabled={isRefreshing}
        title="Refresh now"
        className="p-1.5 rounded-md hover:bg-[#21262D] text-[#8B949E] hover:text-[#C9A84C] transition-colors disabled:opacity-50"
      >
        <RefreshCw
          size={15}
          className={isRefreshing ? 'animate-spin text-[#C9A84C]' : ''}
        />
      </button>

      {/* Pause / Resume button */}
      <button
        type="button"
        onClick={isPaused ? onResume : onPause}
        title={isPaused ? 'Resume auto-refresh' : 'Pause auto-refresh'}
        className="p-1.5 rounded-md hover:bg-[#21262D] text-[#8B949E] hover:text-[#C9A84C] transition-colors"
      >
        {isPaused ? <Play size={15} /> : <Pause size={15} />}
      </button>

      {/* Live dot — green pulse when active, grey when paused */}
      <span
        title={isPaused ? 'Auto-refresh paused' : 'Auto-refresh active'}
        className={`w-2 h-2 rounded-full ${
          isPaused
            ? 'bg-gray-500'
            : isRefreshing
            ? 'bg-[#C9A84C] animate-pulse'
            : 'bg-emerald-500 animate-pulse'
        }`}
      />
    </div>
  )
}
