'use client'
import React from 'react'
import Link from 'next/link'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MessageCircle, FileText, Download } from 'lucide-react'
import type { LessonSummary } from '../_actions/summary-actions'

// Define props interface
interface QuickActionsProps {
  files: LessonSummary['files']
}

export default function QuickActions({ files }: QuickActionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button asChild variant="outline" className="w-full justify-start">
          <Link href="/questions">
            <MessageCircle className="mr-2 h-4 w-4" />
            Discussion Forum
          </Link>
        </Button>
        <Button variant="outline" className="w-full justify-start" disabled title="Coming soon">
          <FileText className="mr-2 h-4 w-4" />
          Take Notes (Coming Soon)
        </Button>
        {files.length > 0 ? (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                <Download className="mr-2 h-4 w-4" />
                Download All Files
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Download All Files</DialogTitle>
                <DialogDescription>
                  You are about to download {files.length} file{files.length !== 1 ? 's' : ''}.
                </DialogDescription>
              </DialogHeader>
              <ul className="list-disc pl-5 space-y-1 max-h-40 overflow-y-auto my-4">
                {files.map((file) => {
                  const fileName = file.url.split('/').pop();
                  return (
                    <li key={file.id} className="text-sm">
                      {fileName}
                    </li>
                  )
                })}
              </ul>
              <DialogFooter>
                <Button variant="outline" asChild>
                  <DialogClose>Cancel</DialogClose>
                </Button>
                <Button onClick={async () => {
                  for (const file of files) {
                    try {
                      const response = await fetch(file.url);
                      const blob = await response.blob();
                      const blobUrl = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = blobUrl;
                      a.download = file.url.split('/').pop() || '';
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      URL.revokeObjectURL(blobUrl);
                    } catch (error) {
                      console.error('Failed to download file', file.url, error);
                    }
                  }
                }}>
                  Download
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        ) : (
          <Button variant="outline" className="w-full justify-start" disabled title="No files to download">
            <Download className="mr-2 h-4 w-4" />
            Download All Files
          </Button>
        )}
      </CardContent>
    </Card>
  )
} 