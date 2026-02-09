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
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Loader2 } from "lucide-react";

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
  sortableConfig?: {
    sortableIds: string[];
    onReorder: (orderedIds: string[]) => void;
    isReordering?: boolean;
  };
}

function SortableTableRow<T extends { id: string }>({
  item,
  columns,
  onRowClick,
}: {
  item: T;
  columns: Column<T>[];
  onRowClick?: (item: T) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={cn(
        "border-b border-border/50 hover:bg-background-alt/30 transition-colors",
        onRowClick && "cursor-pointer",
        isDragging && "opacity-50 bg-background-alt z-10"
      )}
      onClick={() => onRowClick?.(item)}
    >
      <TableCell
        className="w-10 px-2 cursor-grab active:cursor-grabbing text-text-secondary hover:text-text-primary"
        onClick={(e) => e.stopPropagation()}
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4" />
      </TableCell>
      {columns.map((column) => (
        <TableCell
          key={column.key}
          className={cn("px-6 py-4", column.className)}
        >
          {column.render
            ? column.render(item)
            : String((item as Record<string, unknown>)[column.key] ?? "")}
        </TableCell>
      ))}
    </tr>
  );
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
  sortableConfig,
}: DataTableProps<T>) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const colCount = columns.length + (sortableConfig ? 1 : 0);

  if (loading) {
    return <TableSkeleton columns={colCount} rows={loadingRows} />;
  }

  const tableContent = (
    <Table className={className}>
      <TableHeader>
        <TableRow className="border-b border-border bg-background-alt/50 hover:bg-background-alt/50">
          {sortableConfig && (
            <TableHead className="w-10 px-2" aria-label="Drag handle" />
          )}
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
              colSpan={colCount}
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
        ) : sortableConfig ? (
          data.map((item) => (
            <SortableTableRow
              key={item.id}
              item={item}
              columns={columns}
              onRowClick={onRowClick}
            />
          ))
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
                    : String((item as Record<string, unknown>)[column.key] ?? "")}
                </TableCell>
              ))}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );

  const isReordering = sortableConfig?.isReordering ?? false;

  const wrapper = (
    <div className="bg-white border border-border rounded-t-lg shadow-sm overflow-hidden relative">
      {isReordering && (
        <div
          className="absolute inset-0 z-20 flex items-center justify-center bg-white/80 rounded-t-lg"
          aria-busy="true"
          aria-label="Updating order"
        >
          <div className="flex flex-col items-center gap-2 text-text-secondary">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="text-sm font-medium">Updating order…</span>
          </div>
        </div>
      )}
      <div className={cn("overflow-x-auto", isReordering && "pointer-events-none")}>
        {sortableConfig ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={(event) => {
              if (isReordering) return;
              const { active, over } = event;
              if (over && active.id !== over.id) {
                const ids = [...sortableConfig.sortableIds];
                const oldIndex = ids.indexOf(String(active.id));
                const newIndex = ids.indexOf(String(over.id));
                if (oldIndex !== -1 && newIndex !== -1) {
                  sortableConfig.onReorder(arrayMove(ids, oldIndex, newIndex));
                }
              }
            }}
          >
            <SortableContext
              items={sortableConfig.sortableIds}
              strategy={verticalListSortingStrategy}
            >
              {tableContent}
            </SortableContext>
          </DndContext>
        ) : (
          tableContent
        )}
      </div>
    </div>
  );

  return wrapper;
}
