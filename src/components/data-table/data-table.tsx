"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table as ShadcnTable,
  type ColumnDef,
  type PaginationState,
} from "unstyled-table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTableFilterableColumn, DataTableSearchableColumn } from "./types";
import { DataTableToolbar } from "./data-table-toolbar";

interface ColumnSort {
  id: string;
  desc: boolean;
}

type SortingState = ColumnSort[];

export function DataTable<TData, TValue>({
  columns,
  data,
  pageCount,
  defaultSorting,
  filterableColumns = [],
  searchableColumns = [],
  newRowLink,
  deleteRowsAction,
}: {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageCount: number;
  defaultSorting?: {
    prop: string;
    val: "asc" | "desc";
  };
  filterableColumns?: DataTableFilterableColumn<TData>[];
  searchableColumns?: DataTableSearchableColumn<TData>[];
  newRowLink?: string;
  deleteRowsAction?: React.MouseEventHandler<HTMLButtonElement>;
}) {
  const [isPending, startTransition] = React.useTransition();

  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const page = searchParams?.get("page") ?? "1";
  const per_page = searchParams?.get("per_page") ?? "5";
  const sort = searchParams?.get("sort");
  const [column, order] = sort?.split(".") ?? [];

  const [sorting, setSorting] = React.useState<SortingState>([
    {
      id: column ?? defaultSorting?.prop,
      desc: order
        ? order === "desc"
        : defaultSorting?.val
        ? defaultSorting.val === "desc"
        : true,
    },
  ]);

  React.useEffect(() => {
    router.push(
      `${pathname}?${createQueryString({
        page,
        sort: sorting[0]?.id
          ? `${sorting[0]?.id}.${sorting[0]?.desc ? "desc" : "asc"}`
          : null,
      })}`,
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sorting]);

  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: Number(page) - 1,
    pageSize: Number(per_page),
  });

  const createQueryString = React.useCallback(
    (params: Record<string, string | number | null>) => {
      const newSearchParams = new URLSearchParams(searchParams?.toString());

      for (const [key, value] of Object.entries(params)) {
        if (value === null) {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, String(value));
        }
      }

      return newSearchParams.toString();
    },
    [searchParams],
  );

  return (
    <ShadcnTable
      columns={columns}
      data={data}
      pageCount={pageCount}
      state={{ sorting, pagination }}
      manualPagination
      manualSorting
      setSorting={setSorting}
      setPagination={setPagination}
      renders={{
        table: ({ children, tableInstance }) => {
          return (
            <div className="w-full space-y-4 p-1">
              <DataTableToolbar
                table={tableInstance}
                filterableColumns={filterableColumns}
                searchableColumns={searchableColumns}
                newRowLink={newRowLink}
                deleteRowsAction={deleteRowsAction}
              />
              <div className="rounded-md border">
                <Table>{children}</Table>
              </div>
            </div>
          );
        },
        header: ({ children }) => <TableHeader>{children}</TableHeader>,
        headerRow: ({ children }) => <TableRow>{children}</TableRow>,
        headerCell: ({ children }) => (
          <TableHead className="whitespace-nowrap">{children}</TableHead>
        ),
        body: ({ children }) => (
          <TableBody>
            {data.length ? (
              children
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        ),
        bodyRow: ({ children }) => (
          <TableRow className="table-row">{children}</TableRow>
        ),
        // here in children we get our data that we defined in columns
        // by specifying values in accessorKey / or if we made our
        // custom cell by specifying cell function
        bodyCell: ({ children }) => (
          <TableCell className="body-cell">
            {isPending ? <Skeleton className="w-20 h-6" /> : children}
          </TableCell>
        ),
        // filter inputs for columns
        // we can also specify them in our
        // columns
        filterInput: () => null,
        // custom pagination bar
        paginationBar: () => {
          return (
            <div className="flex flex-col-reverse items-center justify-center gap-4 py-2 md:flex-row">
              <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-6">
                <div className="flex flex-wrap items-center space-x-2">
                  <span className="text-sm font-medium">Rows per page</span>
                  <Select
                    value={per_page ?? "10"}
                    onValueChange={(value) => {
                      startTransition(() => {
                        router.push(
                          `${pathname}?${createQueryString({
                            page: 1,
                            per_page: value,
                            sort: sort as string | number | null,
                          })}`,
                        );
                      });
                    }}
                    disabled={isPending}
                  >
                    <SelectTrigger className="w-16 h-8">
                      <SelectValue placeholder={per_page} />
                    </SelectTrigger>
                    <SelectContent>
                      {[5, 10, 15, 20].map((item) => (
                        <SelectItem key={item} value={item.toString()}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="text-sm font-medium">{`Page ${page} of ${pageCount}`}</div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="w-8 h-8"
                    onClick={() => {
                      startTransition(() => {
                        router.push(
                          `${pathname}?${createQueryString({
                            page: 1,
                            per_page,
                            sort: sort as string | number | null,
                          })}`,
                        );
                      });
                    }}
                    disabled={Number(page) === 1 || isPending}
                  >
                    <Icons.chevronsLeft
                      className="w-5 h-5"
                      aria-hidden="true"
                    />
                    <span className="sr-only">First page</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="w-8 h-8"
                    onClick={() => {
                      startTransition(() => {
                        router.push(
                          `${pathname}?${createQueryString({
                            page: Number(page) - 1,
                            per_page,
                            sort: sort as string | number | null,
                          })}`,
                        );
                      });
                    }}
                    disabled={Number(page) === 1 || isPending}
                  >
                    <Icons.chevronLeft className="w-5 h-5" aria-hidden="true" />
                    <span className="sr-only">Previous page</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="w-8 h-8"
                    onClick={() => {
                      startTransition(() => {
                        router.push(
                          `${pathname}?${createQueryString({
                            page: Number(page) + 1,
                            per_page,
                            sort: sort as string | number | null,
                          })}`,
                        );
                      });
                    }}
                    disabled={Number(page) >= (pageCount ?? 1) || isPending}
                  >
                    <Icons.chevronRight
                      className="w-5 h-5"
                      aria-hidden="true"
                    />
                    <span className="sr-only">Next page</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="w-8 h-8"
                    onClick={() => {
                      router.push(
                        `${pathname}?${createQueryString({
                          page: pageCount ?? 1,
                          per_page,
                          sort: sort as string | number | null,
                        })}`,
                      );
                    }}
                    disabled={Number(page) >= (pageCount ?? 1) || isPending}
                  >
                    <Icons.chevronsRight
                      className="w-5 h-5"
                      aria-hidden="true"
                    />
                    <span className="sr-only">Last page</span>
                  </Button>
                </div>
              </div>
            </div>
          );
        },
      }}
    />
  );
}
