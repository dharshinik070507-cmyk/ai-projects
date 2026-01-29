import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { auth } from "@/firebase"; // ✅ correct alias path

/* ================= HELPER: GET AUTH TOKEN ================= */
async function getAuthToken() {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Please login first");
  }

  // 🔥 force refresh prevents expired-token 401
  return await user.getIdToken(true);
}

/* ================= GET ALL REPORTS (HISTORY) ================= */
export function useGradingReports() {
  return useQuery({
    queryKey: ["reports"],
    queryFn: async () => {
      const token = await getAuthToken();

      const res = await fetch("/api/reports", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const msg = await res.text();
        console.error("Reports error:", msg);
        throw new Error("Failed to fetch reports");
      }

      return res.json();
    },
  });
}

/* ================= GET SINGLE REPORT ================= */
export function useGradingReport(id: number) {
  return useQuery({
    queryKey: ["report", id],
    enabled: !!id,
    queryFn: async () => {
      const token = await getAuthToken();

      const res = await fetch(`/api/reports/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const msg = await res.text();
        console.error("Report error:", msg);
        throw new Error("Failed to fetch report");
      }

      return res.json();
    },
  });
}

/* ================= ANALYZE PRODUCE ================= */
export function useGradeProduce() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: { image: string; produceType: string }) => {
      const token = await getAuthToken();

      const res = await fetch("/api/grade", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // 🔥 THIS fixes 401
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const msg = await res.text();
        console.error("Grading error:", msg);
        throw new Error("Grading failed");
      }

      return res.json();
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      toast({
        title: "Analysis Complete",
        description: "Your produce has been graded successfully.",
      });
    },

    onError: (error: any) => {
      toast({
        title: "Analysis Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
