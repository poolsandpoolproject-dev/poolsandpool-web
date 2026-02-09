"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Edit2, Trash2, Eye, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DataTable, type Column } from "@/components/admin/data-table";
import { Pagination } from "@/components/admin/pagination";
import { DeleteConfirmationDialog } from "@/components/admin/delete-confirmation-dialog";
import { adminHooks, type Category } from "@/lib/api";
import { ImageDropzone } from "@/components/ui/image-dropzone";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useForm } from "react-hook-form";

export default function CategoriesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewingCategoryId, setViewingCategoryId] = useState<string | null>(null);
  const [toggleDialogOpen, setToggleDialogOpen] = useState(false);
  const [toggleTarget, setToggleTarget] = useState<{ id: string; name: string; nextEnabled: boolean } | null>(
    null
  );
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 20;

  const categoriesQuery = adminHooks.useCategories({ page: currentPage, perPage });
  const viewingCategoryQuery = adminHooks.useCategory(viewingCategoryId, { enabled: viewDialogOpen });
  const createCategoryMutation = adminHooks.useCreateCategory();
  const updateCategoryMutation = adminHooks.useUpdateCategory();
  const setCategoryEnabledMutation = adminHooks.useSetCategoryEnabled();
  const reorderCategoriesMutation = adminHooks.useReorderCategories();

  const categories = categoriesQuery.data?.data ?? [];
  const meta = categoriesQuery.data?.meta;
  const totalPages = meta?.lastPage ?? 1;
  const totalItems = meta?.total ?? categories.length;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { dirtyFields },
  } = useForm<{
    name: string;
    description: string;
    enabled: boolean;
    image: File | null;
  }>({
    defaultValues: { name: "", description: "", enabled: true, image: null },
  });

  const image = watch("image");

  const nextCategoryOrder = useMemo(() => {
    if (categories.length === 0) return 0;
    const max = Math.max(0, ...categories.map((c) => (c.order ?? 0)));
    return max + 1;
  }, [categories]);

  const handleOpenModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setExistingImageUrl(category.imageUrl || null);
      reset({
        name: category.name,
        description: category.description || "",
        enabled: category.enabled,
        image: null,
      });
    } else {
      setEditingCategory(null);
      setExistingImageUrl(null);
      reset({
        name: "",
        description: "",
        enabled: true,
        image: null,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setExistingImageUrl(null);
    reset({ name: "", description: "", enabled: true, image: null });
  };

  const onSubmit = async (values: {
    name: string;
    description: string;
    enabled: boolean;
    image: File | null;
  }) => {
    try {
      const nextImage = values.image ?? undefined;

      if (editingCategory) {
        const body: Parameters<typeof updateCategoryMutation.mutateAsync>[0]["body"] = {};
        if (dirtyFields.name) body.name = values.name;
        if (dirtyFields.description) body.description = values.description;
        if (dirtyFields.enabled) body.enabled = values.enabled;
        if (nextImage) body.image = nextImage;

        if (Object.keys(body).length === 0) {
          handleCloseModal();
          return;
        }

        await updateCategoryMutation.mutateAsync({
          id: editingCategory.id,
          body,
        });
      } else {
        await createCategoryMutation.mutateAsync({
          name: values.name,
          description: values.description || undefined,
          enabled: values.enabled,
          image: nextImage,
          order: nextCategoryOrder,
        });
      }
      handleCloseModal();
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  const handleViewClick = (category: Category) => {
    setViewingCategoryId(category.id);
    setViewDialogOpen(true);
  };

  const handleToggleEnabled = async (category: Category) => {
    setToggleTarget({ id: category.id, name: category.name, nextEnabled: !category.enabled });
    setToggleDialogOpen(true);
  };

  const handleToggleConfirm = async () => {
    if (!toggleTarget) return;
    try {
      await setCategoryEnabledMutation.mutateAsync({
        id: toggleTarget.id,
        enabled: toggleTarget.nextEnabled,
      });
      setToggleDialogOpen(false);
      setToggleTarget(null);
    } catch (error) {
      console.error("Error toggling category:", error);
    }
  };

  const categoryIds = useMemo(() => categories.map((c) => c.id), [categories]);

  const handleMoveCategory = (category: Category, direction: "up" | "down") => {
    const i = categoryIds.indexOf(category.id);
    if (i < 0) return;
    if (direction === "up" && i === 0) return;
    if (direction === "down" && i === categoryIds.length - 1) return;
    const next = [...categoryIds];
    const j = direction === "up" ? i - 1 : i + 1;
    [next[i], next[j]] = [next[j], next[i]];
    reorderCategoriesMutation.mutate(next);
  };

  // Table columns - memoized to prevent recreation
  const columns: Column<Category>[] = useMemo(() => [
    {
      key: "image",
      header: "Category",
      render: (category) => (
        <div className="flex items-center gap-3">
          {category.imageUrl ? (
            <div className="h-10 w-10 rounded-md overflow-hidden bg-background-alt border border-border shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={category.imageUrl}
                alt={category.name}
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="h-10 w-10 rounded-md bg-background-alt border border-dashed border-border flex items-center justify-center text-xs text-text-secondary shrink-0">
              No image
            </div>
          )}
          <div className="space-y-0.5">
            <div className="font-semibold text-text-primary">{category.name}</div>
          </div>
        </div>
      ),
    },
    {
      key: "order",
      header: "Order",
      render: (category) => {
        const i = categoryIds.indexOf(category.id);
        const canMoveUp = i > 0;
        const canMoveDown = i >= 0 && i < categoryIds.length - 1;
        return (
          <div className="flex items-center gap-1">
            <span className="text-text-secondary tabular-nums min-w-[1.5rem]">
              {category.order != null ? category.order : "—"}
            </span>
            <div className="flex flex-col">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-text-secondary hover:text-text-primary disabled:opacity-40"
                disabled={!canMoveUp || reorderCategoriesMutation.isPending}
                onClick={(e) => {
                  e.stopPropagation();
                  handleMoveCategory(category, "up");
                }}
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-6 w-6 -mt-1 text-text-secondary hover:text-text-primary disabled:opacity-40"
                disabled={!canMoveDown || reorderCategoriesMutation.isPending}
                onClick={(e) => {
                  e.stopPropagation();
                  handleMoveCategory(category, "down");
                }}
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          </div>
        );
      },
    },
    {
      key: "enabled",
      header: "Status",
      render: (category) => (
        <div className="flex items-center gap-3">
          <Switch
            checked={category.enabled}
            onCheckedChange={() => handleToggleEnabled(category)}
            onClick={(e) => e.stopPropagation()}
          />
          <Badge
            variant={category.enabled ? "default" : "outline"}
            className={
              category.enabled
                ? "bg-primary/10 text-primary border-primary/20"
                : ""
            }
          >
            {category.enabled ? "Enabled" : "Disabled"}
          </Badge>
        </div>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      headerClassName: "text-right",
      className: "text-right",
      render: (category) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              handleViewClick(category);
            }}
            className="h-8 w-8 text-text-secondary hover:bg-background-alt hover:text-text-primary cursor-pointer"
            title="View"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              handleOpenModal(category);
            }}
            className="h-8 w-8 text-text-secondary hover:bg-primary/10 hover:text-primary cursor-pointer"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="inline-flex">
                <Button
                  variant="ghost"
                  size="icon"
                  disabled
                  className="h-8 w-8 text-text-secondary/60 cursor-not-allowed"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </span>
            </TooltipTrigger>
            <TooltipContent sideOffset={8}>
              Coming soon
            </TooltipContent>
          </Tooltip>
        </div>
      ),
    },
  ], [categoryIds, handleMoveCategory, handleOpenModal, handleToggleEnabled, reorderCategoriesMutation.isPending]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Categories</h1>
          <p className="text-text-secondary mt-1">Manage menu categories</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          Add Category
        </Button>
      </div>

      <div className="space-y-0">
        <DataTable
          data={categories}
          columns={columns}
          emptyMessage="No categories found"
          emptyDescription="Create your first category to get started."
          loading={categoriesQuery.isLoading}
          loadingRows={5}
          sortableConfig={{
            sortableIds: categoryIds,
            onReorder: (orderedIds) => reorderCategoriesMutation.mutate(orderedIds),
            isReordering: reorderCategoriesMutation.isPending,
          }}
        />
        {totalItems > 0 && (
          <Pagination
            currentPage={meta?.currentPage ?? currentPage}
            totalPages={totalPages}
            pageSize={meta?.perPage ?? perPage}
            totalItems={totalItems}
            onPageChange={(page) => setCurrentPage(page)}
            className="rounded-b-lg border-t-0 -mt-px"
          />
        )}
      </div>

      {/* Add/Edit Category Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[640px]">
          <DialogHeader>
            <DialogTitle className="text-text-primary">
              {editingCategory ? "Edit Category" : "Add New Category"}
            </DialogTitle>
            <DialogDescription className="text-text-secondary">
              {editingCategory
                ? "Update the category details below."
                : "Create a new menu category. The slug will be generated automatically."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-5 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="name" className="text-text-secondary">
                  Category Name
                </Label>
                <Input
                  id="name"
                  {...register("name", { required: true })}
                  placeholder="e.g., Food, Drinks, Smoke"
                  required
                />
              </div>

                <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="description" className="text-text-secondary">
                  Description (optional)
                </Label>
                <Input
                  id="description"
                  {...register("description")}
                  placeholder="Short description for public menu"
                />
              </div>

                <div className="sm:col-span-2 space-y-2">
                  <Label className="text-text-secondary">
                    Image (optional)
                  </Label>
                  <ImageDropzone
                    value={image}
                    existingUrl={existingImageUrl}
                    onRemoveExisting={() => {
                      setExistingImageUrl(null);
                      setValue("image", null, { shouldDirty: true, shouldTouch: true });
                    }}
                    onChange={(file) => setValue("image", file, { shouldDirty: true, shouldTouch: true })}
                    disabled={createCategoryMutation.isPending || updateCategoryMutation.isPending}
                  />
                </div>

                <div className="sm:col-span-2 flex items-center justify-between gap-3 rounded-lg border border-border bg-background-alt/40 px-4 py-3">
                  <div>
                    <div className="text-sm font-medium text-text-primary">Enable category</div>
                    <div className="text-xs text-text-secondary mt-0.5">Controls visibility on the public menu</div>
                  </div>
                <Switch
                  id="enabled"
                  checked={watch("enabled")}
                  onCheckedChange={(checked) => setValue("enabled", checked, { shouldDirty: true, shouldTouch: true })}
                />
              </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseModal}
                disabled={createCategoryMutation.isPending || updateCategoryMutation.isPending}
                className="text-text-secondary"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createCategoryMutation.isPending || updateCategoryMutation.isPending}>
                {createCategoryMutation.isPending || updateCategoryMutation.isPending
                  ? "Saving..."
                  : editingCategory
                    ? "Update Category"
                    : "Create Category"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={viewDialogOpen}
        onOpenChange={(open) => {
          setViewDialogOpen(open);
          if (!open) setViewingCategoryId(null);
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[560px]">
          <DialogHeader>
            <DialogTitle className="text-text-primary">Category Details</DialogTitle>
          
          </DialogHeader>

          {viewingCategoryQuery.isLoading ? (
            <div className="space-y-3">
              <div className="h-28 rounded-lg border border-border bg-background-alt/40" />
              <div className="h-10 rounded-lg border border-border bg-background-alt/40" />
            </div>
          ) : viewingCategoryQuery.data ? (
            <div className="space-y-4">
              <div className="overflow-hidden rounded-lg border border-border bg-white">
                {viewingCategoryQuery.data.imageUrl ? (
                  <div className="w-full aspect-video bg-background-alt">
                    <img
                      src={viewingCategoryQuery.data.imageUrl}
                      alt={viewingCategoryQuery.data.name}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div className="w-full aspect-video bg-background-alt flex items-center justify-center text-sm text-text-secondary border-b border-border">
                    No image
                  </div>
                )}

                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-lg font-semibold text-text-primary truncate">
                        {viewingCategoryQuery.data.name}
                      </div>
                      {viewingCategoryQuery.data.description ? (
                        <div className="text-sm text-text-secondary mt-1">
                          {viewingCategoryQuery.data.description}
                        </div>
                      ) : null}
                    </div>
                    <Badge
                      variant={viewingCategoryQuery.data.enabled ? "default" : "outline"}
                      className={
                        viewingCategoryQuery.data.enabled
                          ? "bg-primary/10 text-primary border-primary/20"
                          : ""
                      }
                    >
                      {viewingCategoryQuery.data.enabled ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-sm text-text-secondary">Could not load category details.</div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setViewDialogOpen(false)} className="text-text-secondary">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DeleteConfirmationDialog
        open={toggleDialogOpen}
        onOpenChange={(open) => {
          if (setCategoryEnabledMutation.isPending) return;
          setToggleDialogOpen(open);
          if (!open) setToggleTarget(null);
        }}
        onConfirm={handleToggleConfirm}
        title={toggleTarget?.nextEnabled ? "Enable Category" : "Disable Category"}
        description={
          toggleTarget
            ? toggleTarget.nextEnabled
              ? `Enable "${toggleTarget.name}"? It will be visible on the public menu.`
              : `Disable "${toggleTarget.name}"? It will be hidden from the public menu.`
            : undefined
        }
        confirmText={toggleTarget?.nextEnabled ? "Enable" : "Disable"}
        confirmLoadingText={toggleTarget?.nextEnabled ? "Enabling..." : "Disabling..."}
        confirmVariant={toggleTarget?.nextEnabled ? "default" : "destructive"}
        isLoading={setCategoryEnabledMutation.isPending}
      />

    </div>
  );
}
