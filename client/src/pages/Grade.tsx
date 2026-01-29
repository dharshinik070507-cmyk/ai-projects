import { useState, useRef } from "react";
import { Upload, X, Camera, Loader2, Leaf, Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useGradeProduce } from "@/hooks/use-grading";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function Grade() {
  const [produceType, setProduceType] = useState<"coconut" | "turmeric">("coconut");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { mutate: analyze, isPending } = useGradeProduce();

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Upload JPG or PNG image",
        variant: "destructive",
      });
      return;
    }
    const reader = new FileReader();
    reader.onload = e => setSelectedImage(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleAnalyze = () => {
    if (!selectedImage) return;
    analyze({ image: selectedImage, produceType });
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center mb-10 space-y-4">
          <h1 className="text-3xl md:text-4xl font-display font-bold">Analyze Produce</h1>
          <p className="text-muted-foreground text-lg">
            Upload a clear photo for instant AI grading
          </p>
        </div>

        {/* Produce Type Cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => setProduceType("coconut")}
            className={cn(
              "p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all",
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
              "p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all",
              produceType === "turmeric"
                ? "border-yellow-600 bg-yellow-50 text-yellow-700"
                : "border-border bg-card hover:border-yellow-600/50 text-muted-foreground"
            )}
          >
            <Sprout className="w-8 h-8" />
            <span className="font-semibold">Turmeric</span>
          </button>
        </div>

        {/* Upload Card */}
        <Card className={cn(
          "border-2 border-dashed transition-all",
          isDragging ? "border-primary bg-primary/5" : "border-border"
        )}>
          <CardContent className="p-0">
            {!selectedImage ? (
              <div
                className="py-16 px-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-muted/30"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <Upload className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Click to upload</h3>
                <p className="text-muted-foreground">Supports JPG, PNG</p>
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
                <img src={selectedImage} className="w-full h-[400px] object-contain bg-black/5" />
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full"
                >
                  <X />
                </button>
              </div>
            )}
          </CardContent>
        </Card>

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
                Analyzing...
              </>
            ) : (
              <>
                <Camera className="w-5 h-5 mr-2" />
                Analyze Image
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
