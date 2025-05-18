import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import FileIcon from "./FileIcon";
import type { LessonSummary } from "../_actions/summary-actions";

interface LessonResourcesProps {
  files: LessonSummary["files"];
}

export default function LessonResources({ files }: LessonResourcesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5 text-primary" />
          Lesson Resources
        </CardTitle>
        <CardDescription>Files uploaded by your instructor</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {files.map((file) => {
          const fileName = file.url.split("/").pop();
          return (
            <div
              key={file.id}
              className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <FileIcon fileType={file.type} />
                <div>
                  <p className="text-sm font-medium">{fileName}</p>
                </div>
              </div>

              <Button asChild size="icon" variant="ghost">
                <a href={file.url} download>
                  <Download className="h-4 w-4" />
                  <span className="sr-only">Download {fileName}</span>
                </a>
              </Button>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
} 