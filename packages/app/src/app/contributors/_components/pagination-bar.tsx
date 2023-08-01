import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface PaginationBarProps {
  nextURL: string;
  prevURL: string;
  lastURL: string;
  firstURL: string;
  className?: string;
  pages: number;
  totalPages: number;
}

export default function PaginationBar({
  nextURL,
  prevURL,
  lastURL,
  firstURL,
  className,
  pages,
  totalPages,
}: PaginationBarProps) {
  return (
    <div className={cn("flex flex-col", "gap-2", "items-center", className)} >
      <div className={cn("flex flex-row", "gap-2", className)}>
        {pages === 1 ? (
          <div className={cn("flex", "gap-2")}>
            <Button variant="outline" size="icon" className="w-8 h-8" disabled>
              <Icons.chevronsLeft className="w-5 h-5" aria-hidden="true" />
              <span className="sr-only">Previous page</span>
            </Button>
            <Button variant="outline" size="icon" className="w-8 h-8" disabled>
              <Icons.chevronLeft className="w-5 h-5" aria-hidden="true" />
              <span className="sr-only">First page</span>
            </Button>
          </div>
        ) : (
          <div className={cn("flex", "gap-2")}>
            <Link href={firstURL}>
              <Button variant="outline" size="icon" className="w-8 h-8" disabled={false}>
                <Icons.chevronsLeft className="w-5 h-5" aria-hidden="true" />
                <span className="sr-only">Previous page</span>
              </Button>
            </Link>
            <Link href={prevURL}>
              <Button variant="outline" size="icon" className="w-8 h-8" disabled={false}>
                <Icons.chevronLeft className="w-5 h-5" aria-hidden="true" />
                <span className="sr-only">First page</span>
              </Button>
            </Link>
          </div>
        )}

        {pages === totalPages ? (
          <div className={cn("flex", "gap-2")}>
            <Button variant="outline" size="icon" className="w-8 h-8" disabled>
              <Icons.chevronRight className="w-5 h-5" aria-hidden="true" />
              <span className="sr-only">Next page</span>
            </Button>
            <Button variant="outline" size="icon" className="w-8 h-8" disabled>
              <Icons.chevronsRight className="w-5 h-5" aria-hidden="true" />
              <span className="sr-only">Last page</span>
            </Button>
          </div>
        ) : (
          <div className={cn("flex", "gap-2")}>
            <Link href={nextURL}>
              <Button variant="outline" size="icon" className="w-8 h-8">
                <Icons.chevronRight className="w-5 h-5" aria-hidden="true" />
                <span className="sr-only">Next page</span>
              </Button>
            </Link>
            <Link href={lastURL}>
              <Button variant="outline" size="icon" className="w-8 h-8">
                <Icons.chevronsRight className="w-5 h-5" aria-hidden="true" />
                <span className="sr-only">Last page</span>
              </Button>
            </Link>
          </div>
        )}
        
      </div>
      <h1>page {pages} out of {totalPages}</h1>
    </div>

  );
}
