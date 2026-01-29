import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { auth } from "../firebase";

/* ================= GET ALL REPORTS (HISTORY) ================= */
export function useGradingReports() {
  return useQuery({
    queryKey: ["reports"],
    queryFn: async () => {
      const user = auth.currentUser;
      if (!user) throw new Error("Login required");

      const token = await user.getIdToken();

      const res = await fetch("/api/reports", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch reports");
      return res.json();
    },
  });
}

/* ================= GET SINGLE REPORT ================= */
export function useGradingReport(id: number) {
  return useQuery({
    queryKey: ["report", id],
    queryFn: async () => {
      const user = auth.currentUser;
      if (!user) throw new Error("Login required");

      const token = await user.getIdToken();

      const res = await fetch(`/api/reports/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch report");
      return res.json();
    },
    enabled: !!id,
  });
}

/* ================= ANALYZE PRODUCE ================= */
export function useGradeProduce() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: { image: string; produceType: string }) => {
      const user = auth.currentUser;
      if (!user) throw new Error("You must login first");

      const token = await user.getIdToken();

      const res = await fetch("/api/grade", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Grading failed");
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
