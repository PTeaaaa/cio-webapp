import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/pagination";
import { cn } from "@/lib/utils";

export default function PaginationControl({ currentPage, totalPages }: { currentPage: number, totalPages: number }) {
  // Generate up to 5 page numbers, centered around currentPage
  const getPageNumbers = () => {
    const maxVisible = 5
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2))
    let end = Math.min(totalPages, start + maxVisible - 1)
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1)
    }
    const pages = []
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    return pages
  }

  const pageNumbers = getPageNumbers()

  const isFirstPage = currentPage === 1
  const isLastPage = currentPage === totalPages


  return (
    <div>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              className={`hover:bg-[#0f804f] hover:text-white transition-all duration-150 ${isFirstPage ? ' opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
              href={!isFirstPage ? `?page=${currentPage - 1}` : undefined}
            />
          </PaginationItem>

          {/* Always show first page if not in range */}
          {pageNumbers[0] > 1 && (
            <PaginationItem>
              <PaginationLink
                className="hover:bg-[#0f804f] hover:text-white transition-all duration-150"
                href="?page=1"
              >1</PaginationLink>
            </PaginationItem>
          )}
          {pageNumbers[0] > 2 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          {/* Main page numbers */}
          {pageNumbers.map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                className={cn("hover:bg-[#0f804f] hover:text-white transition-all duration-150",
                  page === currentPage ? "pointer-events-none" : "",
                )}
                href={`?page=${page}`}
                isActive={page === currentPage}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}

          {/* Always show last page if not in range */}
          {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}
          {pageNumbers[pageNumbers.length - 1] < totalPages && (
            <PaginationItem>
              <PaginationLink className="hover:bg-[#0f804f] hover:text-white transition-all duration-150" href={`?page=${totalPages}`}>{totalPages}</PaginationLink>
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationNext
              className={`hover:bg-[#0f804f] hover:text-white transition-all duration-150
                ${isLastPage ? ' opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
              href={!isLastPage ? `?page=${currentPage + 1}` : undefined}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div >
  )
}