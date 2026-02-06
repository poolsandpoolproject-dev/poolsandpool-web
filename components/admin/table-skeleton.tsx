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
import { cn } from "@/lib/utils";

export interface TableSkeletonProps {
  columns: number;
  rows?: number;
  showHeader?: boolean;
  className?: string;
}

export function TableSkeleton({
  columns,
  rows = 5,
  showHeader = true,
  className,
}: TableSkeletonProps) {
  return (
    <div className="bg-white border border-border rounded-t-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <Table className={className}>
          {showHeader && (
            <TableHeader>
              <TableRow className="border-b border-border bg-background-alt/50">
                {Array.from({ length: columns }).map((_, index) => (
                  <TableHead
                    key={index}
                    className="h-12 px-6 font-semibold text-text-primary"
                  >
                    <Skeleton className="h-4 w-24" />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
          )}
          <TableBody>
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <TableRow
                key={rowIndex}
                className="border-b border-border/50"
              >
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <TableCell key={colIndex} className="px-6 py-4">
                    <Skeleton
                      className={cn(
                        "h-4",
                        // Vary skeleton widths for more realistic look
                        colIndex === 0 && "w-32", // First column (usually name) - wider
                        colIndex === columns - 1 && "w-20", // Last column (usually actions) - narrower
                        colIndex !== 0 &&
                          colIndex !== columns - 1 &&
                          "w-24" // Middle columns - medium
                      )}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
