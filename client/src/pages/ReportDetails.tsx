import { Link, useRoute } from "wouter";
import { ArrowLeft, Calendar, Share2, Download, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGradingReport } from "@/hooks/use-grading";
import { GradeBadge } from "@/components/GradeBadge";
import { format } from "date-fns";
import NotFound from "./not-found";

export default function ReportDetails() {
  const [, params] = useRoute("/reports/:id");
  const id = params ? parseInt(params.id) : 0;
  const { data: report, isLoading } = useGradingReport(id);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (!report) return <NotFound />;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/history">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="w-4 h-4" /> Back to History
            </Button>
          </Link>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Share2 className="w-4 h-4" /> Share
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" /> Export PDF
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Visual */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="overflow-hidden border-border/60 shadow-lg">
              <div className="aspect-video bg-muted relative">
                <img 
                  src={report.imageUrl} 
                  alt="Graded produce" 
                  className="w-full h-full object-contain bg-black/5"
                />
                <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-lg flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Detected Item</p>
                    <h2 className="text-2xl font-bold capitalize text-foreground">{report.produceType}</h2>
                  </div>
                  <GradeBadge grade={report.grade} size="lg" className="text-lg px-6 py-2" />
                </div>
              </div>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-primary" />
                  Analysis Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(report.analysis as any).factors ? (
                    (report.analysis as any).factors.map((factor: string, i: number) => (
                      <div key={i} className="flex gap-4 p-4 rounded-xl bg-muted/50 border border-border/50">
                        <div className="mt-1">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{factor}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Detected by AI model with high certainty.
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground">
                      {(report.analysis as any).summary || "Analysis completed successfully."}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Stats */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Grading Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Date Analyzed</p>
                  <div className="flex items-center gap-2 font-medium">
                    <Calendar className="w-4 h-4 text-primary" />
                    {format(new Date(report.createdAt), 'MMMM d, yyyy')}
                  </div>
                  <p className="text-sm text-muted-foreground ml-6">
                    {format(new Date(report.createdAt), 'h:mm a')}
                  </p>
                </div>

                <div className="h-px bg-border" />

                <div>
                  <p className="text-sm text-muted-foreground mb-2">AI Confidence Score</p>
                  <div className="flex items-end gap-2 mb-2">
                    <span className="text-4xl font-bold text-primary">{report.confidence}%</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-1000" 
                      style={{ width: `${report.confidence}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    The AI is {report.confidence}% certain of this grade based on visual features.
                  </p>
                </div>
                
                <div className="h-px bg-border" />

                <div className="bg-primary/5 p-4 rounded-lg">
                  <h4 className="font-medium text-primary mb-2">Quality Standards</h4>
                  <p className="text-xs text-muted-foreground">
                    Grading is based on industry standards for size, color uniformity, and surface defects specific to {report.produceType}.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
