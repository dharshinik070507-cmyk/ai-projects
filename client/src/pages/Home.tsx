import { Link } from "wouter";
import { ArrowRight, Leaf, Sprout, TrendingUp, CheckCircle2, History, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useGradingReports } from "@/hooks/use-grading";
import { GradeBadge } from "@/components/GradeBadge";
import { format } from "date-fns";

export default function Home() {
  const { data: reports, isLoading } = useGradingReports();
  const recentReports = reports?.slice(0, 3) || [];

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-primary/5 border-b border-primary/10">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=2000&auto=format&fit=crop')] opacity-5 bg-cover bg-center" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium animate-in">
              <Leaf className="w-4 h-4" />
              AI-Powered Produce Grading
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground tracking-tight animate-in [animation-delay:100ms]">
              Quality Grading for <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-600">
                Modern Agriculture
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground animate-in [animation-delay:200ms]">
              Instantly analyze Tender Coconut and Turmeric quality with computer vision. 
              Get accurate grades, confidence scores, and detailed reports in seconds.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-in [animation-delay:300ms]">
              <Link href="/grade?type=coconut">
                <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
                  <Leaf className="w-5 h-5" />
                  Grade Coconut
                </Button>
              </Link>
              <Link href="/grade?type=turmeric">
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-lg gap-2 bg-white/50 backdrop-blur-sm hover:bg-white/80">
                  <Sprout className="w-5 h-5 text-yellow-600" />
                  Grade Turmeric
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats / Features */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="glass-card">
            <CardContent className="p-6 flex items-start gap-4">
              <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg">99% Accuracy</h3>
                <p className="text-sm text-muted-foreground">High precision computer vision models tailored for produce.</p>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="p-6 flex items-start gap-4">
              <div className="p-3 rounded-xl bg-green-100 text-green-600">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Instant Results</h3>
                <p className="text-sm text-muted-foreground">Get detailed grading reports in under 5 seconds.</p>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="p-6 flex items-start gap-4">
              <div className="p-3 rounded-xl bg-orange-100 text-orange-600">
                <History className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Historical Data</h3>
                <p className="text-sm text-muted-foreground">Track quality trends over time with detailed logs.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold font-display">Recent Activity</h2>
          <Link href="/history">
            <Button variant="ghost" className="text-primary hover:text-primary/80 hover:bg-primary/5">
              View All <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-muted animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : recentReports.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentReports.map((report) => (
              <Link key={report.id} href={`/reports/${report.id}`}>
                <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden border-border/60">
                  <div className="aspect-video relative overflow-hidden bg-muted">
                    <img 
                      src={report.imageUrl} 
                      alt={`${report.produceType} grading`}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute top-3 right-3">
                      <GradeBadge grade={report.grade} size="sm" />
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg capitalize flex items-center gap-2">
                        {report.produceType === 'coconut' ? <Leaf className="w-4 h-4 text-green-600"/> : <Sprout className="w-4 h-4 text-yellow-600"/>}
                        {report.produceType}
                      </h3>
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                        {format(new Date(report.createdAt), 'MMM d, h:mm a')}
                      </span>
                    </div>
                    <div className="mt-4 flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Confidence</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary" 
                            style={{ width: `${report.confidence}%` }}
                          />
                        </div>
                        <span className="font-medium">{report.confidence}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-muted/30 rounded-2xl border border-dashed border-border">
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Upload className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground">No gradings yet</h3>
            <p className="text-muted-foreground mt-2">Start by analyzing your first produce item.</p>
            <Link href="/grade">
              <Button className="mt-4">Start Grading</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
