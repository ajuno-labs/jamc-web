"use client";

import * as React from "react";
import { useRouter } from "@/i18n/navigation";
import { DialogProps } from "@radix-ui/react-dialog";
import { Command as CommandPrimitive } from "cmdk";
import { Search, MessageSquare, ThumbsUp, Tag } from "lucide-react";
import { format } from "date-fns";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { searchQuestions } from "@/lib/actions/search-actions";

interface SearchResult {
  id: string;
  title: string;
  content: string;
  type: "YOLO" | "FORMAL";
  author: {
    name: string | null;
    image: string | null;
  };
  tags: Array<{ name: string }>;
  answerCount: number;
  voteCount: number;
  createdAt: string;
  slug: string;
}

export function CommandMenu({ ...dialogProps }: DialogProps) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const debouncedQuery = useDebounce(query, 300);
  const [results, setResults] = React.useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  React.useEffect(() => {
    if (!debouncedQuery) {
      setResults([]);
      return;
    }

    const performSearch = async () => {
      setIsLoading(true);
      try {
        const result = await searchQuestions(debouncedQuery);
        setResults(result.items);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    performSearch();
  }, [debouncedQuery]);

  const handleSelect = React.useCallback(
    (questionId: string, slug: string) => {
      setOpen(false);
      router.push(`/questions/${questionId}/${slug}`);
    },
    [router]
  );

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
      >
        <span className="hidden lg:inline-flex">Search questions...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>
      <Dialog open={open} onOpenChange={setOpen} {...dialogProps}>
        <DialogContent className="overflow-hidden p-0">
          <CommandPrimitive className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
            <div
              className="flex items-center border-b px-3"
              cmdk-input-wrapper=""
            >
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <CommandPrimitive.Input
                value={query}
                onValueChange={setQuery}
                placeholder="Type to search..."
                className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <CommandPrimitive.List className="max-h-[400px] overflow-y-auto overflow-x-hidden">
              {isLoading ? (
                <div className="py-6 text-center text-sm">Searching...</div>
              ) : results.length === 0 ? (
                <CommandPrimitive.Empty className="py-6 text-center text-sm">
                  {query ? "No results found." : "Type to start searching..."}
                </CommandPrimitive.Empty>
              ) : (
                results.map((result) => (
                  <CommandPrimitive.Item
                    key={result.id}
                    value={result.id}
                    onSelect={() => handleSelect(result.id, result.slug)}
                    className="flex flex-col gap-2 px-4 py-2 cursor-pointer hover:bg-accent"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{result.title}</h3>
                      <Badge
                        variant={
                          result.type === "YOLO" ? "secondary" : "default"
                        }
                      >
                        {result.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {result.content}
                    </p>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          {result.answerCount}
                        </div>
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="h-4 w-4" />
                          {result.voteCount}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {result.tags.slice(0, 3).map((tag) => (
                          <Badge
                            key={tag.name}
                            variant="outline"
                            className="flex items-center gap-1"
                          >
                            <Tag className="h-3 w-3" />
                            {tag.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Avatar className="h-4 w-4">
                        <AvatarImage src={result.author.image || undefined} />
                        <AvatarFallback>
                          {result.author.name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <span>{result.author.name}</span>
                      <span>•</span>
                      <span>
                        {format(new Date(result.createdAt), "MMM d, yyyy")}
                      </span>
                    </div>
                  </CommandPrimitive.Item>
                ))
              )}
            </CommandPrimitive.List>
          </CommandPrimitive>
        </DialogContent>
      </Dialog>
    </>
  );
}
