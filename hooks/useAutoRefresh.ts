// hooks/useAutoRefresh.ts

import { useState, useEffect, useCallback, useRef } from 'react'

interface UseAutoRefreshOptions {
  intervalMs: number          // How often to refresh (in milliseconds)
  enabled?: boolean           // Can be toggled off (default: true)
  onRefresh: () => Promise<void>  // The fetch function to call
  refreshOnFocus?: boolean    // Re-fetch when browser tab becomes active (default: true)
}

interface UseAutoRefreshReturn {
  lastUpdated: Date | null    // Timestamp of last successful refresh
  isRefreshing: boolean       // True while a refresh is in progress
  refresh: () => void         // Manually trigger a refresh
  pause: () => void           // Pause auto-refresh
  resume: () => void          // Resume auto-refresh
  isPaused: boolean
}

export function useAutoRefresh({
  intervalMs,
  enabled = true,
  onRefresh,
  refreshOnFocus = true,
}: UseAutoRefreshOptions): UseAutoRefreshReturn {
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const onRefreshRef = useRef(onRefresh)

  // Keep ref updated to latest callback (avoids stale closure)
  useEffect(() => {
    onRefreshRef.current = onRefresh
  }, [onRefresh])

  const runRefresh = useCallback(async () => {
    if (isRefreshing) return // Prevent overlapping requests
    setIsRefreshing(true)
    try {
      await onRefreshRef.current()
      setLastUpdated(new Date())
    } catch (error) {
      console.error('Auto-refresh failed:', error)
      // Silently fail — don't crash the page
    } finally {
      setIsRefreshing(false)
    }
  }, [isRefreshing])

  // Start/stop interval
  useEffect(() => {
    if (!enabled || isPaused) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      return
    }

    intervalRef.current = setInterval(runRefresh, intervalMs)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [enabled, isPaused, intervalMs, runRefresh])

  // Refresh when tab becomes visible again
  useEffect(() => {
    if (!refreshOnFocus) return

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        runRefresh()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [refreshOnFocus, runRefresh])

  return {
    lastUpdated,
    isRefreshing,
    refresh: runRefresh,
    pause: () => setIsPaused(true),
    resume: () => setIsPaused(false),
    isPaused,
  }
}
