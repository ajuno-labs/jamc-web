'use client';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Download, Eye, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import FileIcon from "./FileIcon";
import type { LessonSummary } from "../_actions/summary-actions";
import { useCallback } from 'react';

interface LessonResourcesProps {
  files: LessonSummary["files"];
}

export default function LessonResources({ files }: LessonResourcesProps) {
  const downloadFile = useCallback(async (url: string, fileName?: string) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName || '';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Download failed', error);
    }
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
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

              <div className="flex items-center gap-2">
                <Button asChild size="icon" variant="outline">
                  <a href={file.url} target="_blank" rel="noopener noreferrer">
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">View {fileName}</span>
                  </a>
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => downloadFile(file.url, fileName)}
                >
                  <Download className="h-4 w-4" />
                  <span className="sr-only">Download {fileName}</span>
                </Button>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
} 