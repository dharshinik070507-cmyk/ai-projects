import { useState } from "react";
import { Link } from "wouter";
import { Search, Filter, Calendar, ChevronRight } from "lucide-react";
import { useGradingReports } from "@/hooks/use-grading";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { GradeBadge } from "@/components/GradeBadge";
import { format } from "date-fns";

export default function History() {
  const { data: reports, isLoading } = useGradingReports();
  const [filterType, setFilterType] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredReports = reports?.filter((report) => {
    const matchesType = filterType === "all" || report.produceType === filterType;
    const matchesSearch = report.grade.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          report.produceType.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold">Grading History</h1>
            <p className="text-muted-foreground">View and manage your past grading reports.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search grades..." 
                className="pl-9 w-full sm:w-64 bg-card"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-40 bg-card">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <SelectValue placeholder="Filter Type" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Items</SelectItem>
                <SelectItem value="coconut">Coconut</SelectItem>
                <SelectItem value="turmeric">Turmeric</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 bg-muted animate-pulse rounded-xl" />
            ))}
          </div>
        ) : filteredReports?.length === 0 ? (
          <div className="text-center py-20 bg-muted/30 rounded-2xl border border-dashed">
            <p className="text-muted-foreground">No reports found matching your criteria.</p>
            <Button variant="link" onClick={() => { setFilterType("all"); setSearchTerm(""); }}>
              Clear filters
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredReports?.map((report) => (
              <Link key={report.id} href={`/reports/${report.id}`}>
                <Card className="hover:shadow-md transition-all duration-200 cursor-pointer group border-border/60">
                  <div className="p-4 flex items-center gap-4">
                    <div className="h-16 w-16 rounded-lg overflow-hidden shrink-0 bg-muted">
                      <img 
                        src={report.imageUrl} 
                        alt={report.produceType} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg capitalize truncate">
                          {report.produceType}
                        </h3>
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {format(new Date(report.createdAt), 'MMM d, yyyy')}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        Confidence: {report.confidence}% • ID: #{report.id}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <GradeBadge grade={report.grade} />
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
