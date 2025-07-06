import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { useTranslations } from 'next-intl'

interface QuestionPaginationProps {
  currentPage: number
  totalPages: number
  hasMore: boolean
  onPageChange: (page: number) => void
  totalItems: number
  itemsPerPage: number
  maxVisiblePages?: number
}

/**
 * Renders a paginated navigation UI for a list of questions, including localized item range summary and page controls.
 *
 * Displays the current range of items being shown, and provides navigation buttons for previous, next, and specific pages, with ellipsis for skipped ranges when there are many pages.
 *
 * @param currentPage - The currently active page number.
 * @param totalPages - The total number of available pages.
 * @param hasMore - Whether there are more pages after the current one.
 * @param onPageChange - Callback invoked with the new page number when a page is selected.
 * @param totalItems - The total number of items across all pages.
 * @param itemsPerPage - The number of items displayed per page.
 * @param maxVisiblePages - The maximum number of page buttons to display in the pagination control (defaults to 5).
 *
 * @returns The pagination UI component.
 */
export function QuestionPagination({
  currentPage,
  totalPages,
  hasMore,
  onPageChange,
  totalItems,
  itemsPerPage,
  maxVisiblePages = 5,
}: QuestionPaginationProps) {
  const t = useTranslations('QuestionsPage.pagination')
  // Generate array of page numbers to display
  const getPageNumbers = () => {
    const pageNumbers: (number | 'ellipsis')[] = []
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is less than or equal to max visible pages
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    // Always show first page
    pageNumbers.push(1)

    // Calculate start and end of the middle range
    const startPage = Math.max(2, currentPage - Math.floor(maxVisiblePages / 2))
    const endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 3)

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
    <div className="mt-8 space-y-4">
      <div className="text-sm text-muted-foreground text-center">
        {t('showing', {
          from: (currentPage - 1) * itemsPerPage + 1,
          to: Math.min(currentPage * itemsPerPage, totalItems),
          total: totalItems
        })}
      </div>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
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
                  onClick={() => onPageChange(pageNum)}
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
              onClick={() => onPageChange(currentPage + 1)}
              className={!hasMore ? "pointer-events-none opacity-50" : "cursor-pointer"}
              aria-disabled={!hasMore}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
} 
