import Link from "next/link"
import { ChevronRight } from "lucide-react"

export function Breadcrumb() {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-1 text-sm">
        <li>
          <Link href="/courses" className="text-muted-foreground hover:text-foreground">
            Course
          </Link>
        </li>
        <li className="flex items-center">
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <Link href="/modules" className="ml-1 text-muted-foreground hover:text-foreground">
            Module
          </Link>
        </li>
        <li className="flex items-center">
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <span className="ml-1 font-medium">Lesson Summary</span>
        </li>
      </ol>
    </nav>
  )
}
