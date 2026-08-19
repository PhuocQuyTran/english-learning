import React, { useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  ArrowUpNarrowWide,
  ArrowDownWideNarrow,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  UserX,
} from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Skeleton } from "./skeleton";
import InputSelect from "./inputs/Select";
import { PAGE_SIZE_OPTIONS } from "@/constants";

export type Column<T> = {
  key: keyof T;
  title: string;
  sortable?: boolean;
  className?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  render?: (value: any, record: T) => React.ReactNode;
  titleAction?: React.ReactNode | (() => React.ReactNode);
};

type Order = "asc" | "desc" | null;

interface CommonTableProps<T> {
  data: T[];
  columns: Column<T>[];
  total?: number;
  allowOffline?: boolean;
  isLoading?: boolean;
  emptyIcon?: React.ReactNode;
  emptyString?: string;
  emptySearchString?: string;
  handleUpdatePagination?: (page: number, limit: number) => void;
  paginationData?: {
    page: number;
    pageSize: number;
    total: number;
  };
  rowKey?: keyof T;
  wrapClassName?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function CommonTable<T extends Record<string, any>>({
  data,
  columns,
  total = 0,
  allowOffline = false,
  isLoading = false,
  emptyIcon = <UserX size={22} />,
  emptyString = "common_table_empty_string",
  emptySearchString = "common_table_empty_search_string",
  handleUpdatePagination,
  paginationData,
  rowKey,
  wrapClassName,
}: CommonTableProps<T>) {
  const [searchParams, setSearchParams] = useSearchParams();

  const isSearch = useMemo(() => {
    const searchData = Object.fromEntries(searchParams.entries());
    delete searchData.page;
    delete searchData.limit;
    delete searchData.sort;
    delete searchData.order;
    return searchData;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString()]);

  const page = Number(paginationData?.page || searchParams.get("page") || 1);
  const limit = Number(
    paginationData?.pageSize || searchParams.get("limit") || 10,
  );
  const sort = searchParams.get("sort");
  const order = (searchParams.get("order") as Order) || null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateQuery = (newParams: Record<string, any>) => {
    const params = Object.fromEntries(searchParams.entries());

    Object.entries(newParams).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") {
        delete params[key];
      } else {
        params[key] = String(value);
      }
      if (key === "limit") {
        params.page = "1";
      }
    });

    setSearchParams(params);
  };

  const handleSort = (key: string) => {
    let newOrder: Order = "asc";

    if (sort === key) {
      if (order === "asc") newOrder = "desc";
      else if (order === "desc") newOrder = null;
    }

    if (!newOrder) {
      updateQuery({ sort: undefined, order: undefined, page: 1 });
    } else {
      updateQuery({ sort: key, order: newOrder, page: 1 });
    }
  };

  const totalPages = Math.ceil(total / limit);

  const paginatedData = data;

  const pages = getPagination(page, totalPages);

  return (
    <div className="space-y-4">
      <div className="rounded-md border border-border overflow-hidden relative z-10">
        <Table wrapClassName={wrapClassName}>
          <TableHeader>
            <TableRow className="border-border bg-neutral">
              {columns.map((col, index) => (
                <TableHead
                  key={String(col.key) + index}
                  className={cn(
                    "font-medium text-base text-foreground",
                    col.sortable ? "cursor-pointer select-none" : "",
                    col.className,
                  )}
                  onClick={() => col.sortable && handleSort(String(col.key))}
                >
                  <div className="flex items-center gap-1">
                    {col.title}
                    {col.titleAction && (
                      <div>
                        {typeof col.titleAction === "function"
                          ? col.titleAction()
                          : col.titleAction}
                      </div>
                    )}
                    {col.sortable && (!sort || sort !== col.key) && (
                      <ArrowUpDown size={14} className="text-[#525252]" />
                    )}
                    {col.sortable && sort === col.key && (
                      <>
                        {order === "asc" && (
                          <ArrowUpNarrowWide
                            size={14}
                            className="text-[#525252]"
                          />
                        )}
                        {order === "desc" && (
                          <ArrowDownWideNarrow
                            size={14}
                            className="text-[#525252]"
                          />
                        )}
                      </>
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i} className={`text-base border-border`}>
                  {columns.map((col, index) => (
                    <TableCell
                      key={String(col.key) + index}
                      className={col.className}
                    >
                      <Skeleton className="h-8 my-2 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : paginatedData.length > 0 ? (
              paginatedData.map((row, idx) => (
                <TableRow key={rowKey ? row[rowKey] : idx}>
                  {columns.map((col, index) => (
                    <TableCell
                      key={String(col.key) + index}
                      className={col.className}
                    >
                      {col.render
                        ? col.render(row[col.key], row)
                        : String(row[col.key])}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className={`text-base border-border`}>
                <TableCell colSpan={columns.length}>
                  <div className="flex flex-col items-center gap-2 min-h-53.5 justify-center text-muted-foreground">
                    {emptyIcon}
                    <p className="text-muted-foreground text-base">
                      {isSearch ? emptySearchString : emptyString}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {!isLoading && !!paginatedData.length && total > 0 && (
        <div className="flex items-center justify-between flex-col md:flex-row gap-y-4">
          <div className="flex items-center gap-2">
            <InputSelect
              name="pagination"
              onChange={(val) => {
                if (handleUpdatePagination) {
                  handleUpdatePagination(1, Number(val));
                  return;
                }
                updateQuery({ limit: val });
              }}
              options={PAGE_SIZE_OPTIONS.map((option) => ({
                label: option.label,
                value: option.value,
              }))}
              value={String(limit)}
            />
            <div className="text-muted-foreground text-base md:w-auto w-full">
              {`Showing ${Math.min(total, limit)} of ${total} records`}
            </div>
          </div>
          <div className="flex md:gap-2 gap-1">
            <Button
              variant="link"
              size="sm"
              disabled={page === 1}
              onClick={() => {
                if (handleUpdatePagination) {
                  handleUpdatePagination(page - 1, limit);
                  return;
                }
                updateQuery({ page: page - 1 });
              }}
              className="text-base font-normal px-0 lg:px-3 min-w-8"
            >
              <ChevronLeft />
            </Button>

            {pages.map((p, idx) =>
              p === "..." ? (
                <span
                  key={`ellipsis-${idx}`}
                  className="text-sm px-0 min-w-4 text-center"
                >
                  ...
                </span>
              ) : (
                <Button
                  key={`page-${p}`}
                  size="sm"
                  variant={p === page ? "outline" : "link"}
                  onClick={() => {
                    if (handleUpdatePagination) {
                      handleUpdatePagination(p, limit);
                      return;
                    }
                    updateQuery({ page: p });
                  }}
                  className="text-base font-normal px-0 lg:px-2 min-w-8"
                >
                  {p}
                </Button>
              ),
            )}

            <Button
              variant="link"
              size="sm"
              disabled={page === totalPages}
              onClick={() => {
                if (handleUpdatePagination) {
                  handleUpdatePagination(page + 1, limit);
                  return;
                }
                updateQuery({ page: page + 1 });
              }}
              className="text-base font-normal px-0 lg:px-3 min-w-8"
            >
              <ChevronRight />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function getPagination(page: number, totalPages: number) {
  const delta = 1;
  const pages = new Set<number | "...">();

  const rangeStart = Math.max(1, page - delta);
  const rangeEnd = Math.min(totalPages, page + delta);

  pages.add(1);
  pages.add(totalPages);

  for (let i = rangeStart; i <= rangeEnd; i++) {
    pages.add(i);
  }

  const sortedPages = Array.from(pages).sort((a, b) =>
    a === "..." || b === "..." ? 0 : (a as number) - (b as number),
  );

  const result: (number | "...")[] = [];

  for (let i = 0; i < sortedPages.length; i++) {
    const curr = sortedPages[i];
    const prev = sortedPages[i - 1];

    if (
      typeof curr === "number" &&
      typeof prev === "number" &&
      curr - prev > 1
    ) {
      result.push("...");
    }

    result.push(curr);
  }

  return result;
}
