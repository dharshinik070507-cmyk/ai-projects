import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { Upload, X, Camera, Loader2, Leaf, Sprout, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useGradeProduce } from "@/hooks/use-grading";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { GradeBadge } from "@/components/GradeBadge";

export default function Grade() {
  const [location, setLocation] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const typeParam = searchParams.get("type");
  
  const [produceType, setProduceType] = useState<"coconut" | "turmeric">(
    (typeParam as "coconut" | "turmeric") || "coconut"
  );
  
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const { mutate: analyze, isPending, data: result } = useGradeProduce();

  // Reset result when changing image or type
  useEffect(() => {
    // Intentionally not resetting result on type change to keep UX smooth if user misclicked
  }, [produceType]);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (JPG, PNG)",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleAnalyze = () => {
    if (!selectedImage) return;
    analyze({
      image: selectedImage,
      produceType,
    });
  };

  const resetForm = () => {
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // If we have a result, show the result view
  if (result) {
    return (
      <div className="min-h-screen bg-background pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-display font-bold">Analysis Result</h1>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Analyze Another
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Image Preview */}
            <Card className="overflow-hidden border-border/60 shadow-lg">
              <div className="aspect-square bg-muted relative">
                <img 
                  src={result.imageUrl} 
                  alt="Analyzed produce" 
                  className="w-full h-full object-cover"
                />
              </div>
            </Card>

            {/* Results Details */}
            <div className="space-y-6">
              <Card className="bg-card border-border/60 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Assigned Grade</h2>
                      <div className="flex items-center gap-3">
                        <GradeBadge grade={result.grade} size="lg" />
                      </div>
                    </div>
                    <div className="text-right">
                      <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Confidence</h2>
                      <p className="text-3xl font-bold text-foreground">{result.confidence}%</p>
                    </div>
                  </div>
                  
                  <div className="h-px bg-border my-6" />
                  
                  <div>
                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-primary" />
                      Analysis Details
                    </h3>
                    
                    {/* Assuming analysis is a JSON object with reasons/details */}
                    <div className="space-y-3">
                      {(result.analysis as any).factors ? (
                        (result.analysis as any).factors.map((factor: string, i: number) => (
                          <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 text-sm">
                            <CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                            <span>{factor}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted-foreground">
                          {(result.analysis as any).summary || "Analysis completed successfully."}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-4">
                <Button className="flex-1 h-12" onClick={() => setLocation("/history")}>
                  View History
                </Button>
                <Button variant="secondary" className="flex-1 h-12" onClick={() => window.location.reload()}>
                  New Scan
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center mb-10 space-y-4">
          <h1 className="text-3xl md:text-4xl font-display font-bold">Analyze Produce</h1>
          <p className="text-muted-foreground text-lg">
            Upload a clear photo of your produce for instant AI grading
          </p>
        </div>

        {/* Type Selector */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => setProduceType("coconut")}
            className={cn(
              "p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all duration-200",
              produceType === "coconut"
                ? "border-primary bg-primary/5 text-primary"
                : "border-border bg-card hover:border-primary/50 text-muted-foreground"
            )}
          >
            <Leaf className="w-8 h-8" />
            <span className="font-semibold">Tender Coconut</span>
          </button>
          <button
            onClick={() => setProduceType("turmeric")}
            className={cn(
              "p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all duration-200",
              produceType === "turmeric"
                ? "border-yellow-600 bg-yellow-50 text-yellow-700"
                : "border-border bg-card hover:border-yellow-600/50 text-muted-foreground"
            )}
          >
            <Sprout className="w-8 h-8" />
            <span className="font-semibold">Turmeric</span>
          </button>
        </div>

        {/* Upload Area */}
        <Card className={cn(
          "border-2 border-dashed transition-all duration-200",
          isDragging ? "border-primary bg-primary/5" : "border-border",
          selectedImage ? "border-solid" : ""
        )}>
          <CardContent className="p-0">
            {!selectedImage ? (
              <div
                className="py-16 px-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-muted/30 transition-colors"
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <Upload className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Click to upload or drag & drop</h3>
                <p className="text-muted-foreground max-w-sm mx-auto">
                  Supports JPG, PNG. Make sure the item is well-lit and centered.
                </p>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                />
              </div>
            ) : (
              <div className="relative">
                <img 
                  src={selectedImage} 
                  alt="Preview" 
                  className="w-full h-[400px] object-contain bg-black/5"
                />
                <button
                  onClick={resetForm}
                  className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Button */}
        <div className="mt-8">
          <Button
            size="lg"
            className="w-full h-14 text-lg font-semibold shadow-lg shadow-primary/20"
            disabled={!selectedImage || isPending}
            onClick={handleAnalyze}
          >
            {isPending ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Analyzing {produceType}...
              </>
            ) : (
              <>
                <Camera className="w-5 h-5 mr-2" />
                Analyze Image
              </>
            )}
          </Button>
          <p className="text-xs text-center text-muted-foreground mt-4">
            Analysis typically takes 3-5 seconds. Results are saved automatically.
          </p>
        </div>
      </div>
    </div>
  );
}
