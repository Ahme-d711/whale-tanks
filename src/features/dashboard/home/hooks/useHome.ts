import { mockHomeData } from "../utils/mockHomeData"
import { useAuthStore } from "@/features/auth/stores/authStore"

export const useHome = () => {
  const { user } = useAuthStore()
  
  const userName = user?.name?.split(' ')[0] || user?.username || "User"

  // Commented out real API call to make it static as requested
  /*
  const { data: stats, isLoading, error } = useQuery<DashboardStats>({
    queryKey: ["dashboard-stats"],
    queryFn: getDashboardStats,
  })
  */

  const stats = mockHomeData
  const isLoading = false
  const error = null

  return {
    userName,
    stats,
    isLoading,
    error
  }
}
