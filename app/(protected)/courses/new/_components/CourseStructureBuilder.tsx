"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import type { TreeNode, NodeType } from "@/lib/types/course-structure";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Folder,
  BookOpen,
  FileText,
  Trash2,
  Edit2,
  Check,
  X,
  ChevronDown,
  ChevronRight,
  Plus,
} from "lucide-react";

export function allowedChildTypes(type: NodeType | null): NodeType[] {
  if (type === null) return ["module", "lesson"];
  if (type === "module") return ["chapter", "lesson"];
  if (type === "chapter") return ["lesson"];
  return [];
}

export function EnhancedTreeBuilder({
  nodes,
  onChange,
}: {
  nodes: TreeNode[];
  onChange: (nodes: TreeNode[]) => void;
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
              {allowedChildTypes(node.type).length > 0 && (
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
                      <DropdownMenuItem asChild key={type}>
                        <Button
                          type="button"
                          variant="ghost"
                          className="w-full text-left"
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
                            {type === "module" && (
                              <Folder className="h-4 w-4" />
                            )}
                            {type === "chapter" && (
                              <BookOpen className="h-4 w-4" />
                            )}
                            {type === "lesson" && (
                              <FileText className="h-4 w-4" />
                            )}
                            <span className="capitalize">Add {type}</span>
                          </div>
                        </Button>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
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
          />
        </div>
      )}
    </div>
  );
}
