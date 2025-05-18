import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, FileText, Download } from "lucide-react";

export default function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button variant="outline" className="w-full justify-start">
          <MessageCircle className="mr-2 h-4 w-4" />
          Discussion Forum
        </Button>
        <Button variant="outline" className="w-full justify-start">
          <FileText className="mr-2 h-4 w-4" />
          Take Notes
        </Button>
        <Button variant="outline" className="w-full justify-start">
          <Download className="mr-2 h-4 w-4" />
          Download All Files
        </Button>
      </CardContent>
    </Card>
  );
} 