import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationWrapperProps {
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

export function PaginationWrapper({
  currentPage,
  totalPages,
  hasNext,
  hasPrev,
  onPageChange,
  loading = false,
}: PaginationWrapperProps) {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();

  const handlePageClick = (page: number) => {
    if (!loading) {
      onPageChange(page);
    }
  };

  const handlePrevious = () => {
    if (hasPrev && !loading) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (hasNext && !loading) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <Pagination className="mt-8">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious 
            onClick={handlePrevious}
            className={`cursor-pointer ${(!hasPrev || loading) ? 'opacity-50 cursor-not-allowed' : ''}`}
          />
        </PaginationItem>
        
        {visiblePages.map((page, index) => (
          <PaginationItem key={index}>
            {page === "..." ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                onClick={() => handlePageClick(page as number)}
                isActive={currentPage === page}
                className={`cursor-pointer ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {page}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}
        
        <PaginationItem>
          <PaginationNext 
            onClick={handleNext}
            className={`cursor-pointer ${(!hasNext || loading) ? 'opacity-50 cursor-not-allowed' : ''}`}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
} 