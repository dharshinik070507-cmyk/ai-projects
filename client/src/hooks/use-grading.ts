import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type GradeRequest } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useGradingReports() {
  return useQuery({
    queryKey: [api.grading.list.path],
    queryFn: async () => {
      const res = await fetch(api.grading.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch reports");
      return api.grading.list.responses[200].parse(await res.json());
    },
  });
}

export function useGradingReport(id: number) {
  return useQuery({
    queryKey: [api.grading.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.grading.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch report");
      return api.grading.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

export function useGradeProduce() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: GradeRequest) => {
      const res = await fetch(api.grading.grade.path, {
        method: api.grading.grade.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = api.grading.grade.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to analyze produce");
      }
      return api.grading.grade.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.grading.list.path] });
      toast({
        title: "Analysis Complete",
        description: "Your produce has been successfully graded.",
      });
    },
    onError: (error) => {
      toast({
        title: "Analysis Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
