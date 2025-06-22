"use client";

import React, { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { createCourse } from "../_actions/course-actions";
import type { CourseTag } from "@/lib/types/course";
import { TreeNode } from "@/lib/types/course-structure";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Folder } from "lucide-react";
import { TagSelector } from "./TagSelector";
import {
  EnhancedTreeBuilder,
  allowedChildTypes,
} from "./CourseStructureBuilder";

// Zod schema for course form
const courseFormSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters" })
    .max(100, { message: "Title must be less than 100 characters" }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" })
    .max(1000, { message: "Description must be less than 1000 characters" }),
  structure: z.array(z.any()).optional(),
  tags: z.array(z.string()).optional(),
});

type CourseFormValues = z.infer<typeof courseFormSchema>;

interface CreateCourseFormProps {
  availableTags: CourseTag[];
}

export function CreateCourseForm({ availableTags }: CreateCourseFormProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"basic" | "structure" | "tags">(
    "basic"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      title: "",
      description: "",
      structure: [],
      tags: [],
    },
  });

  const { handleSubmit, control, watch, trigger } = form;

  const nextTab = async () => {
    if (activeTab === "basic") {
      const valid = await trigger(["title", "description"]);
      if (valid) {
        setActiveTab("structure");
      }
    } else if (activeTab === "structure") {
      const struct = watch("structure");
      if (struct && struct.length > 0) {
        setActiveTab("tags");
      } else {
        toast.error("Please add at least one item to the structure");
      }
    }
  };

  const prevTab = () => {
    if (activeTab === "structure") setActiveTab("basic");
    else if (activeTab === "tags") setActiveTab("structure");
  };

  const onSubmit = async (data: CourseFormValues) => {
    setIsSubmitting(true);
    try {
      // Serialize form data
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("structure", JSON.stringify(data.structure || []));
      data.tags?.forEach((tag) => formData.append("tags", tag));

      const result = await createCourse(formData);
      if (result.success) {
        toast.success("Course created successfully");
        router.push(`/courses/${result.slug}`);
      } else {
        toast.error("Failed to create course");
      }
    } catch (e) {
      console.error(e);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Tabs
          value={activeTab}
          onValueChange={(v) =>
            setActiveTab(v as "basic" | "structure" | "tags")
          }
        >
          <TabsList className="inline-flex h-9 items-center justify-center space-x-1 rounded-full bg-muted p-1 text-muted-foreground">
            <TabsTrigger
              value="basic"
              disabled={activeTab !== "basic"}
              className="flex-1 px-4 py-2 text-sm font-medium whitespace-nowrap rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow"
            >
              Basic
            </TabsTrigger>
            <TabsTrigger
              value="structure"
              disabled={activeTab !== "structure"}
              className="flex-1 px-4 py-2 text-sm font-medium whitespace-nowrap rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow"
            >
              Structure
            </TabsTrigger>
            <TabsTrigger
              value="tags"
              disabled={activeTab !== "tags"}
              className="flex-1 px-4 py-2 text-sm font-medium whitespace-nowrap rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow"
            >
              Tags & Preview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic">
            <Card className="shadow-sm rounded-lg">
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course Title</FormLabel>
                      <FormControl className="border border-gray-200 rounded-md px-3 py-2 focus-within:ring-1 focus-within:ring-primary focus-within:border-transparent">
                        <Input
                          {...field}
                          placeholder="Course Title"
                          className="border-0"
                        />
                      </FormControl>
                      <FormDescription>
                        Enter the name of your course.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl className="border border-gray-200 rounded-md px-3 py-2 focus-within:ring-1 focus-within:ring-primary focus-within:border-transparent">
                        <Textarea
                          {...field}
                          placeholder="What will students learn?"
                          rows={4}
                          className="border-0 resize-none"
                        />
                      </FormControl>
                      <FormDescription>
                        Describe the course in a few sentences.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end">
                  <Button
                    onClick={nextTab}
                    className="px-4 py-2 transition-colors focus:ring-2 focus:ring-primary/50"
                  >
                    Next: Structure
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="structure">
            <Card className="shadow-sm rounded-lg">
              <CardHeader className="flex items-center justify-between">
                <CardTitle>Course Structure</CardTitle>
                <div className="flex space-x-2">
                  {allowedChildTypes(null).map((t) => (
                    <Button
                      key={t}
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const nodes = watch("structure") || [];
                        const newNode: TreeNode = {
                          id: crypto.randomUUID(),
                          type: t,
                          title: "",
                          children: [],
                        };
                        form.setValue("structure", [...nodes, newNode]);
                      }}
                    >
                      <Plus size={16} className="mr-1" /> Add {t}
                    </Button>
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <FormField
                  control={control}
                  name="structure"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="min-h-[240px] rounded-lg bg-muted/20 p-4">
                          {field.value && field.value.length > 0 ? (
                            <EnhancedTreeBuilder
                              nodes={field.value}
                              onChange={field.onChange}
                            />
                          ) : (
                            <div className="text-center text-muted-foreground mt-16">
                              <Folder size={48} />
                              <p className="mt-2">
                                No structure defined. Add items to begin.
                              </p>
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormDescription>
                        Organize modules, chapters, and lessons.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="flex justify-between p-4 pt-0">
                <Button
                  variant="outline"
                  onClick={prevTab}
                  className="px-4 py-2 transition-colors hover:bg-primary/10 focus:ring-2 focus:ring-primary/50"
                >
                  Back
                </Button>
                <Button
                  onClick={nextTab}
                  className="px-4 py-2 transition-colors focus:ring-2 focus:ring-primary/50"
                >
                  Next: Tags
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="tags">
            <Card className="shadow-sm rounded-lg">
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl className="border border-gray-200 rounded-md px-3 py-2 focus-within:ring-1 focus-within:ring-primary focus-within:border-transparent">
                        <TagSelector
                          selectedTags={field.value || []}
                          onTagsChange={field.onChange}
                          availableTags={availableTags}
                        />
                      </FormControl>
                      <FormDescription>
                        Select or create tags for categorization.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card className="shadow-sm rounded-lg">
              <CardHeader>
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 grid grid-cols-2 gap-x-6">
                <div className="space-y-1">
                  <p className="font-semibold">Title:</p>
                  <p>{watch("title") || "-"}</p>
                </div>
                <div className="space-y-1">
                  <p className="font-semibold">Description:</p>
                  <p className="line-clamp-3">{watch("description") || "-"}</p>
                </div>
                <div className="space-y-1 col-span-2">
                  <p className="font-semibold">Tags:</p>
                  <div className="flex flex-wrap gap-2">
                    {watch("tags")?.length ? (
                      (watch("tags") as string[]).map((t) => (
                        <Badge key={t} variant="secondary">
                          {t}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-muted-foreground">No tags</p>
                    )}
                  </div>
                </div>
                <div className="space-y-1 col-span-2">
                  <p className="font-semibold">Structure:</p>
                  {watch("structure") &&
                  (watch("structure") as TreeNode[]).length ? (
                    <ul className="list-disc list-inside text-sm text-muted-foreground">
                      {(watch("structure") as TreeNode[]).map((n) => (
                        <li key={n.id}>
                          {n.title || `Untitled ${n.type}`}
                          {n.children.length > 0 &&
                            ` (${n.children.length} children)`}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground">No structure</p>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between p-4 pt-0">
                <Button
                  variant="outline"
                  onClick={prevTab}
                  className="px-4 py-2 transition-colors hover:bg-primary/10 focus:ring-2 focus:ring-primary/50"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 transition-colors focus:ring-2 focus:ring-primary/50"
                >
                  {isSubmitting ? "Creating..." : "Create Course"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </Form>
  );
}
