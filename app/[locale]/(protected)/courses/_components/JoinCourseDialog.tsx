"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Loader2 } from "lucide-react";
import { joinCourseWithCode } from "../_actions/course-actions";
import { toast } from "sonner";
import { useRouter } from "@/i18n/navigation";

export default function JoinCourseDialog() {
  const [open, setOpen] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim()) {
      toast.error("Please enter a join code");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("joinCode", joinCode.trim());
      
      const result = await joinCourseWithCode(formData);
      
      if (result.success) {
        toast.success(result.message);
        setOpen(false);
        setJoinCode("");
        // Optionally navigate to the course
        if (result.courseSlug) {
          router.push(`/courses/${result.courseSlug}`);
        }
        // Refresh the page to update the course list
        router.refresh();
      }
    } catch (error) {
      console.error("Error joining course:", error);
      toast.error(error instanceof Error ? error.message : "Failed to join course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Join Course
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Join a Course</DialogTitle>
          <DialogDescription>
            Enter the course join code provided by your instructor to enroll in a course.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="joinCode">Course Join Code</Label>
              <Input
                id="joinCode"
                placeholder="Enter join code..."
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                disabled={loading}
                autoComplete="off"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !joinCode.trim()}>
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Join Course
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 