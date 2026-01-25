import { Link } from "wouter";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md mx-auto text-center border-border/60 shadow-xl">
        <CardContent className="pt-12 pb-12 px-6">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="h-10 w-10 text-orange-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-foreground mb-2 font-display">Page Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          
          <Link href="/">
            <Button className="w-full">
              Return Home
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
