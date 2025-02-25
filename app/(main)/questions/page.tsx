"use client"

import * as React from "react"
import { Search, MessageSquare, ThumbsUp, Tag } from "lucide-react"
import { format } from "date-fns"

import { searchQuestions } from "./_actions/search"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useDebounce } from "@/lib/hooks/use-debounce"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import Link from "next/link"
import { QuestionType } from "@prisma/client"

interface SearchResult {
  id: string
  slug: string
  title: string
  content: string
  type: QuestionType
  author: {
    name: string | null
    image: string | null
  }
  tags: Array<{ name: string }>
  answerCount: number
  voteCount: number
  createdAt: string
}

const ITEMS_PER_PAGE = 10
const MAX_VISIBLE_PAGES = 5

export default function QuestionsPage() {
  const [query, setQuery] = React.useState("")
  const debouncedQuery = useDebounce(query, 300)
  const [results, setResults] = React.useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [selectedType, setSelectedType] = React.useState<"all" | QuestionType>("all")
  const [currentPage, setCurrentPage] = React.useState(1)
  const [total, setTotal] = React.useState(0)
  const [hasMore, setHasMore] = React.useState(false)

  // Function to perform search
  const performSearch = React.useCallback(async (resetPage: boolean = false) => {
    setIsLoading(true)
    try {
      const page = resetPage ? 1 : currentPage
      const result = await searchQuestions(debouncedQuery, selectedType, page, ITEMS_PER_PAGE)
      setResults(result.items)
      setTotal(result.total)
      setHasMore(result.hasMore)
      if (resetPage) {
        setCurrentPage(1)
      }
    } catch (error) {
      console.error("Search error:", error)
    } finally {
      setIsLoading(false)
    }
  }, [debouncedQuery, selectedType, currentPage])

  // Load initial questions
  React.useEffect(() => {
    performSearch()
  }, [])

  // Perform search when query or type changes
  React.useEffect(() => {
    performSearch(true) // Reset to first page when filters change
  }, [debouncedQuery, selectedType])

  // Load more questions when page changes
  React.useEffect(() => {
    if (currentPage > 1) {
      performSearch()
    }
  }, [currentPage])

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE)

  // Generate array of page numbers to display
  const getPageNumbers = () => {
    const pageNumbers: (number | 'ellipsis')[] = []
    
    if (totalPages <= MAX_VISIBLE_PAGES) {
      // Show all pages if total pages is less than or equal to max visible pages
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    // Always show first page
    pageNumbers.push(1)

    // Calculate start and end of the middle range
    let startPage = Math.max(2, currentPage - Math.floor(MAX_VISIBLE_PAGES / 2))
    let endPage = Math.min(totalPages - 1, startPage + MAX_VISIBLE_PAGES - 3)

    // Adjust if we're near the end
    if (endPage === totalPages - 1) {
      startPage = Math.max(2, endPage - (MAX_VISIBLE_PAGES - 3))
    }

    // Add ellipsis after first page if needed
    if (startPage > 2) {
      pageNumbers.push('ellipsis')
    }

    // Add middle pages
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i)
    }

    // Add ellipsis before last page if needed
    if (endPage < totalPages - 1) {
      pageNumbers.push('ellipsis')
    }

    // Always show last page
    if (totalPages > 1) {
      pageNumbers.push(totalPages)
    }

    return pageNumbers
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Questions</h1>
        <Button asChild>
          <Link href="/questions/new">Ask a Question</Link>
        </Button>
      </div>

      <div className="flex gap-4 mb-8">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search questions..."
              className="w-full pl-10 pr-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={selectedType === "all" ? "default" : "outline"}
            onClick={() => setSelectedType("all")}
          >
            All
          </Button>
          <Button
            variant={selectedType === "YOLO" ? "default" : "outline"}
            onClick={() => setSelectedType("YOLO")}
          >
            YOLO
          </Button>
          <Button
            variant={selectedType === "FORMAL" ? "default" : "outline"}
            onClick={() => setSelectedType("FORMAL")}
          >
            Formal
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {isLoading && currentPage === 1 ? (
          <div className="text-center py-8">Loading questions...</div>
        ) : results.length === 0 ? (
          <div className="text-center py-8">
            {query ? "No questions found." : "No questions yet. Be the first to ask!"}
          </div>
        ) : (
          <>
            {results.map((question) => (
              <div key={question.id} className="bg-card rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <Link 
                    href={`/questions/${question.id}/${question.slug}`}
                    className="text-xl font-semibold hover:text-primary"
                  >
                    {question.title}
                  </Link>
                  <Badge variant={question.type === "YOLO" ? "secondary" : "default"}>
                    {question.type}
                  </Badge>
                </div>
                <p className="text-muted-foreground mb-4 line-clamp-2">
                  {question.content}
                </p>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      {question.answerCount}
                    </div>
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="h-4 w-4" />
                      {question.voteCount}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {question.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag.name} variant="outline" className="flex items-center gap-1">
                        <Tag className="h-3 w-3" />
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={question.author.image || undefined} />
                    <AvatarFallback>{question.author.name?.[0]}</AvatarFallback>
                  </Avatar>
                  <span>{question.author.name}</span>
                  <span>•</span>
                  <span>{format(new Date(question.createdAt), "MMM d, yyyy")}</span>
                </div>
              </div>
            ))}

            {/* Pagination */}
            <div className="mt-8 space-y-4">
              <div className="text-sm text-muted-foreground text-center">
                Showing {results.length} of {total} questions
              </div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      aria-disabled={currentPage === 1}
                    />
                  </PaginationItem>

                  {getPageNumbers().map((pageNum, idx) => (
                    <PaginationItem key={`${pageNum}-${idx}`}>
                      {pageNum === 'ellipsis' ? (
                        <PaginationEllipsis />
                      ) : (
                        <PaginationLink
                          onClick={() => setCurrentPage(pageNum)}
                          isActive={currentPage === pageNum}
                          className="cursor-pointer"
                        >
                          {pageNum}
                        </PaginationLink>
                      )}
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage(p => p + 1)}
                      className={!hasMore ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      aria-disabled={!hasMore}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </>
        )}
      </div>
    </div>
  )
} 