"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { createCourse } from "../_actions/course-actions";
import type { CourseTag } from "@/lib/types/course";
import { TreeNode, NodeType } from "@/lib/types/course-structure";

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
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Plus,
  Folder,
  BookOpen,
  FileText,
  Trash2,
  Edit2,
  Check,
  X,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
  CommandGroup,
} from "@/components/ui/command";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

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

// Allowed children per node
function allowedChildTypes(type: NodeType | null): NodeType[] {
  if (type === null) return ["module", "lesson"];
  if (type === "module") return ["chapter", "lesson"];
  if (type === "chapter") return ["lesson"];
  return [];
}

// TagSelector component
function TagSelector({
  selectedTags,
  onTagsChange,
  availableTags,
}: {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  availableTags: CourseTag[];
}) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleSelect = (tag: string) => {
    if (!selectedTags.includes(tag)) onTagsChange([...selectedTags, tag]);
    setInputValue("");
  };

  const handleRemove = (tag: string) => {
    onTagsChange(selectedTags.filter((t) => t !== tag));
  };

  const handleCreateTag = () => {
    const name = inputValue.trim();
    if (name && !selectedTags.includes(name)) {
      onTagsChange([...selectedTags, name]);
      setInputValue("");
      setOpen(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {selectedTags.length > 0 ? (
          selectedTags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="flex items-center gap-1 px-3 py-1"
            >
              {tag}
              <button
                type="button"
                onClick={() => handleRemove(tag)}
                className="ml-1 rounded-full hover:bg-muted-foreground/20"
              >
                <X size={12} />
                <span className="sr-only">Remove {tag}</span>
              </button>
            </Badge>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">No tags selected</p>
        )}
      </div>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-center">
            <Plus size={16} className="mr-2" /> Add Tag
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-[240px] p-0">
          <Command>
            <CommandInput
              placeholder="Search or create tag..."
              value={inputValue}
              onValueChange={setInputValue}
            />
            <CommandList>
              <CommandEmpty>
                {inputValue.trim() ? (
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={handleCreateTag}
                  >
                    <Plus size={16} className="mr-2" />{" "}
                    {`Create "${inputValue}"`}
                  </Button>
                ) : (
                  "No tags found"
                )}
              </CommandEmpty>

              <CommandGroup>
                {availableTags
                  .filter((t) => !selectedTags.includes(t.name))
                  .filter((t) =>
                    t.name.toLowerCase().includes(inputValue.toLowerCase())
                  )
                  .map((t) => (
                    <CommandItem
                      key={t.id}
                      value={t.name}
                      onSelect={() => handleSelect(t.name)}
                    >
                      {t.name}
                    </CommandItem>
                  ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
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
      if (valid) setActiveTab("structure");
    } else if (activeTab === "structure") {
      setActiveTab("tags");
    }
  };

  const prevTab = () => {
    if (activeTab === "structure") setActiveTab("basic");
    else if (activeTab === "tags") setActiveTab("structure");
  };

  const onSubmit = async (data: CourseFormValues) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("structure", JSON.stringify(data.structure));
      data.tags?.forEach((tag) => formData.append("tags", tag));

      const result = await createCourse(formData);
      if (result.success) {
        toast.success("Course created successfully");
        router.push("/courses");
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
          <TabsList className="grid grid-cols-3 bg-muted/10 rounded-lg p-1">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="structure">Structure</TabsTrigger>
            <TabsTrigger value="tags">Tags & Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="basic">
            <Card className="border">
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course Title</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Course Title" />
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
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="What will students learn?"
                          rows={4}
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
                  <Button onClick={nextTab}>Next: Structure</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="structure">
            <Card className="border">
              <CardHeader className="flex items-center justify-between">
                <CardTitle>Course Structure</CardTitle>
                <div className="flex space-x-2">
                  {allowedChildTypes(null).map((t) => (
                    <Button
                      key={t}
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
                              parentType={null}
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
              <div className="flex justify-between p-4 pt-0">
                <Button variant="outline" onClick={prevTab}>
                  Back
                </Button>
                <Button onClick={nextTab}>Next: Tags</Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="tags">
            <Card className="border">
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
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

            <Card className="border">
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
            </Card>

            <div className="flex justify-between">
              <Button variant="outline" onClick={prevTab}>
                Back
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Course"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </form>
    </Form>
  );
}

// EnhancedTreeBuilder and TreeNodeItem definitions
function EnhancedTreeBuilder({
  nodes,
  onChange,
  parentType,
}: {
  nodes: TreeNode[];
  onChange: (nodes: TreeNode[]) => void;
  parentType: NodeType | null;
}) {
  const updateNode = (id: string, patch: Partial<TreeNode>) => {
    onChange(nodes.map((n) => (n.id === id ? { ...n, ...patch } : n)));
  };
  const removeNode = (id: string) => {
    onChange(nodes.filter((n) => n.id !== id));
  };
  return (
    <div className="space-y-2">
      {nodes.map((node) => (
        <TreeNodeItem
          key={node.id}
          node={node}
          updateNode={updateNode}
          removeNode={removeNode}
        />
      ))}
    </div>
  );
}

function TreeNodeItem({
  node,
  updateNode,
  removeNode,
}: {
  node: TreeNode;
  updateNode: (id: string, patch: Partial<TreeNode>) => void;
  removeNode: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const [editing, setEditing] = useState(node.title === "");
  const [title, setTitle] = useState(node.title);
  const handleSave = () => {
    updateNode(node.id, { title });
    setEditing(false);
  };
  const handleCancel = () => {
    setTitle(node.title);
    setEditing(false);
  };
  const getNodeIcon = () => {
    switch (node.type) {
      case "module":
        return <Folder className="h-4 w-4 text-blue-500" />;
      case "chapter":
        return <BookOpen className="h-4 w-4 text-emerald-500" />;
      case "lesson":
        return <FileText className="h-4 w-4 text-amber-500" />;
      default:
        return null;
    }
  };
  const getNodeColor = () => {
    switch (node.type) {
      case "module":
        return "border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/30";
      case "chapter":
        return "border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/30";
      case "lesson":
        return "border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30";
      default:
        return "border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/30";
    }
  };
  return (
    <div className={cn("border rounded-md overflow-hidden", getNodeColor())}>
      <div className="flex items-center p-2 gap-2">
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="p-1 rounded-sm hover:bg-black/5 dark:hover:bg-white/5"
          disabled={node.children.length === 0}
        >
          {node.children.length > 0 ? (
            expanded ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )
          ) : (
            <div className="w-4" />
          )}
        </button>
        <div className="flex items-center gap-1.5">
          {getNodeIcon()}
          <Badge
            variant="outline"
            className="text-xs font-normal capitalize px-1.5 py-0"
          >
            {node.type}
          </Badge>
        </div>
        {editing ? (
          <div className="flex-1 flex items-center gap-1">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={`${node.type} title`}
              className="h-8 flex-1"
              autoFocus
            />
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={handleSave}
              className="h-8 w-8"
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={handleCancel}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <>
            <span className="flex-1 font-medium truncate">
              {node.title || (
                <span className="italic text-muted-foreground">
                  Untitled {node.type}
                </span>
              )}
            </span>
            <div className="flex items-center gap-1">
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => setEditing(true)}
                className="h-8 w-8"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {allowedChildTypes(node.type).map((type) => (
                    <DropdownMenuItem
                      key={type}
                      onClick={() =>
                        updateNode(node.id, {
                          children: [
                            ...node.children,
                            {
                              id: crypto.randomUUID(),
                              type,
                              title: "",
                              children: [],
                            },
                          ],
                        })
                      }
                    >
                      <div className="flex items-center gap-2">
                        {type === "module" && <Folder className="h-4 w-4" />}
                        {type === "chapter" && <BookOpen className="h-4 w-4" />}
                        {type === "lesson" && <FileText className="h-4 w-4" />}
                        <span className="capitalize">Add {type}</span>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => removeNode(node.id)}
                className="h-8 w-8 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </>
        )}
      </div>
      {expanded && node.children.length > 0 && (
        <div className="pl-8 pr-2 pb-2">
          <EnhancedTreeBuilder
            nodes={node.children}
            onChange={(children) => updateNode(node.id, { children })}
            parentType={node.type}
          />
        </div>
      )}
    </div>
  );
}
