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
import { Skeleton } from "@/components/ui/skeleton";
import { TableSkeleton } from "./table-skeleton";
import { cn } from "@/lib/utils";

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
  headerClassName?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  emptyMessage?: string;
  emptyDescription?: string;
  onRowClick?: (item: T) => void;
  className?: string;
  loading?: boolean;
  loadingRows?: number;
}

export function DataTable<T extends { id: string }>({
  data,
  columns,
  emptyMessage = "No items found",
  emptyDescription,
  onRowClick,
  className,
  loading = false,
  loadingRows = 5,
}: DataTableProps<T>) {
  // Show skeleton when loading
  if (loading) {
    return <TableSkeleton columns={columns.length} rows={loadingRows} />;
  }

  return (
    <div className="bg-white border border-border rounded-t-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <Table className={className}>
          <TableHeader>
            <TableRow className="border-b border-border bg-background-alt/50 hover:bg-background-alt/50">
              {columns.map((column) => (
                <TableHead
                  key={column.key}
                  className={cn(
                    "h-12 px-6 font-semibold text-text-primary",
                    column.headerClassName
                  )}
                >
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center text-text-secondary py-12"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <p className="text-base font-medium">{emptyMessage}</p>
                    {emptyDescription && (
                      <p className="text-sm text-text-light">{emptyDescription}</p>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <TableRow
                  key={item.id}
                  className={cn(
                    "border-b border-border/50 hover:bg-background-alt/30 transition-colors",
                    onRowClick && "cursor-pointer"
                  )}
                  onClick={() => onRowClick?.(item)}
                >
                  {columns.map((column) => (
                    <TableCell
                      key={column.key}
                      className={cn("px-6 py-4", column.className)}
                    >
                      {column.render
                        ? column.render(item)
                        : String((item as any)[column.key] ?? "")}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
