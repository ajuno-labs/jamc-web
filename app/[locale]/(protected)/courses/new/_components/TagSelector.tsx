"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Plus, X } from "lucide-react";

import type { CourseTag } from "@/lib/types/course";

interface TagSelectorProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  availableTags: CourseTag[];
}

export function TagSelector({
  selectedTags,
  onTagsChange,
  availableTags,
}: TagSelectorProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleSelect = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      onTagsChange([...selectedTags, tag]);
    }
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
              className="flex items-center gap-1 px-2.5 py-0.5 rounded-md text-sm font-medium"
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
            <Plus size={16} className="mr-2" />
            Add Tag
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
                    <Plus size={16} className="mr-2" />
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
