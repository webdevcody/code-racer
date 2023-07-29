import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Header from "@/components/header";

interface PaginationBarProps {
  nextURL: string;
  prevURL: string;
  className?: string;
  pages: number;
  totalPages: number;
}

export default function PaginationBar({
  nextURL,
  prevURL,
  className,
  pages,
  totalPages,
}: PaginationBarProps) {
  return (
    <div className={cn("flex flex-col", "gap-2", "items-center", className)} >
      <div className={cn("flex flex-row", "gap-2", className)}>
        <Link href={prevURL}>
          <Button variant="outline" size="icon" className="w-8 h-8">
            <Icons.chevronLeft className="w-5 h-5" aria-hidden="true" />
            <span className="sr-only">Previous page</span>
          </Button>
        </Link>
        <Link href={nextURL}>
          <Button variant="outline" size="icon" className="w-8 h-8">
            <Icons.chevronRight className="w-5 h-5" aria-hidden="true" />
            <span className="sr-only">Next page</span>
          </Button>
        </Link>
      </div>
      <h1>page {pages} out of {totalPages}</h1>
    </div>

  );
}
