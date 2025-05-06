"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu as Menu,
  DropdownMenuTrigger as MenuTrigger,
  DropdownMenuContent as MenuContent,
  DropdownMenuItem as MenuItem,
} from "@/components/ui/dropdown-menu";
import React from "react";

// Types for flexible course structure nodes
export type NodeType = "module" | "chapter" | "lesson";

export interface TreeNode {
  id: string;
  type: NodeType;
  title: string;
  children: TreeNode[];
}

interface TreeBuilderProps {
  nodes: TreeNode[];
  onChange: (nodes: TreeNode[]) => void;
  parentType: NodeType | null;
}

// Returns which child types are allowed under a given parent
function allowedChildTypes(type: NodeType | null): NodeType[] {
  if (type === null) return ["module", "lesson"];
  if (type === "module") return ["chapter", "lesson"];
  if (type === "chapter") return ["lesson"];
  return [];
}

export default function TreeBuilder({
  nodes,
  onChange,
  parentType,
}: TreeBuilderProps) {
  // Add a new node at this level
  const addNode = (type: NodeType) => {
    const newNode: TreeNode = {
      id: crypto.randomUUID(),
      type,
      title: "",
      children: [],
    };
    onChange([...nodes, newNode]);
  };

  // Update a node's fields
  const updateNode = (id: string, patch: Partial<TreeNode>) => {
    onChange(nodes.map((n) => (n.id === id ? { ...n, ...patch } : n)));
  };

  // Remove a node from this level
  const removeNode = (id: string) => {
    onChange(nodes.filter((n) => n.id !== id));
  };

  return (
    <ul className="space-y-2">
      {nodes.map((n) => (
        <li key={n.id} className="pl-4 border-l border-muted">
          <div className="flex items-center space-x-2">
            <span className="font-medium uppercase">{n.type}</span>
            <Input
              placeholder={`${n.type} title`}
              value={n.title}
              onChange={(e) => updateNode(n.id, { title: e.target.value })}
            />
            <Menu>
              <MenuTrigger asChild>
                <Button size="icon" variant="ghost">
                  +
                </Button>
              </MenuTrigger>
              <MenuContent>
                {allowedChildTypes(n.type).map((t) => (
                  <MenuItem
                    key={t}
                    onSelect={() =>
                      updateNode(n.id, {
                        children: [
                          ...n.children,
                          {
                            id: crypto.randomUUID(),
                            type: t,
                            title: "",
                            children: [],
                          },
                        ],
                      })
                    }
                  >
                    Add {t}
                  </MenuItem>
                ))}
              </MenuContent>
            </Menu>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => removeNode(n.id)}
            >
              ×
            </Button>
          </div>
          {n.children.length > 0 && (
            <TreeBuilder
              nodes={n.children}
              onChange={(c) => updateNode(n.id, { children: c })}
              parentType={n.type}
            />
          )}
        </li>
      ))}

      {/* Buttons to add at this level */}
      {allowedChildTypes(parentType).length > 0 && (
        <li className="pl-4">
          {allowedChildTypes(parentType).map((t) => (
            <Button
              key={t}
              size="sm"
              variant="outline"
              className="mr-2"
              onClick={() => addNode(t)}
            >
              + {t}
            </Button>
          ))}
        </li>
      )}
    </ul>
  );
}