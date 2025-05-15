import { useQuery } from "@tanstack/react-query"
import { DateRange } from "react-day-picker"
import { getFilteredPostsByDateRange } from "@/utils/edgeFunctions"

export function useFilteredPostMeta(userId: string, dateRange?: DateRange) {
  return useQuery({
    queryKey: ["filtered-post-meta", userId, dateRange],
    queryFn: async () => {
      if (!dateRange?.from || !dateRange?.to) return []
      return getFilteredPostsByDateRange({
        from: dateRange.from,
        to: dateRange.to
      })
    },
    enabled: !!userId && !!dateRange?.from && !!dateRange?.to,
  })
}
