"use client";

import { useCallback, useMemo, useState } from "react";
import { Plus, Edit2, Trash2, ChevronUp, ChevronDown } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable, type Column } from "@/components/admin/data-table";
import { Pagination } from "@/components/admin/pagination";
import { DeleteConfirmationDialog } from "@/components/admin/delete-confirmation-dialog";
import { adminHooks, ApiError, type Section } from "@/lib/api";
import { ImageDropzone } from "@/components/ui/image-dropzone";
import { useForm } from "react-hook-form";

export default function SectionsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [toggleDialogOpen, setToggleDialogOpen] = useState(false);
  const [toggleTarget, setToggleTarget] = useState<{ id: string; name: string; nextEnabled: boolean } | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [sectionToDelete, setSectionToDelete] = useState<Section | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const perPage = 20;

  const categoriesQuery = adminHooks.useCategories({ page: 1, perPage: 200 });
  const categories = categoriesQuery.data?.data ?? [];

  const sectionsParams = useMemo(
    () => ({
      page: currentPage,
      perPage,
      categoryId: selectedCategoryId === "all" ? undefined : selectedCategoryId,
      includeDisabled: true,
    }),
    [currentPage, perPage, selectedCategoryId]
  );

  const sectionsQuery = adminHooks.useSections(sectionsParams);
  const sections = sectionsQuery.data?.data ?? [];
  const meta = sectionsQuery.data?.meta;
  const totalPages = meta?.lastPage ?? 1;
  const totalItems = meta?.total ?? sections.length;

  const createSectionMutation = adminHooks.useCreateSection();
  const updateSectionMutation = adminHooks.useUpdateSection();
  const setSectionEnabledMutation = adminHooks.useSetSectionEnabled();
  const reorderSectionsMutation = adminHooks.useReorderSections();
  const deleteSectionMutation = adminHooks.useDeleteSection();

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
    categoryId: string;
    enabled: boolean;
    image: File | null;
  }>({
    defaultValues: { name: "", description: "", categoryId: "", enabled: true, image: null },
  });

  const image = watch("image");
  const categoryId = watch("categoryId");

  const nextSectionOrder = useMemo(() => {
    if (sections.length === 0) return 0;
    return Math.max(0, ...sections.map((s) => (s.order ?? 0))) + 1;
  }, [sections]);

  const handleOpenModal = (section?: Section) => {
    if (section) {
      setEditingSection(section);
      setExistingImageUrl(section.imageUrl || null);
      reset({
        name: section.name,
        description: section.description || "",
        categoryId: section.categoryId,
        enabled: section.enabled,
        image: null,
      });
    } else {
      setEditingSection(null);
      setExistingImageUrl(null);
      reset({
        name: "",
        description: "",
        categoryId: selectedCategoryId !== "all" ? selectedCategoryId : categories[0]?.id ?? "",
        enabled: true,
        image: null,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSection(null);
    setExistingImageUrl(null);
    reset({ name: "", description: "", categoryId: "", enabled: true, image: null });
  };

  const onSubmit = async (values: {
    name: string;
    description: string;
    categoryId: string;
    enabled: boolean;
    image: File | null;
  }) => {
    try {
      const nextImage = values.image ?? undefined;

      if (editingSection) {
        const body: Parameters<typeof updateSectionMutation.mutateAsync>[0]["body"] = {};
        if (dirtyFields.name) body.name = values.name;
        if (dirtyFields.description) body.description = values.description;
        if (dirtyFields.categoryId) body.categoryId = values.categoryId;
        if (dirtyFields.enabled) body.enabled = values.enabled;
        if (nextImage) body.image = nextImage;

        if (Object.keys(body).length === 0) {
          handleCloseModal();
          return;
        }

        await updateSectionMutation.mutateAsync({
          id: editingSection.id,
          body,
        });
      } else {
        await createSectionMutation.mutateAsync({
          name: values.name,
          categoryId: values.categoryId,
          description: values.description || undefined,
          enabled: values.enabled,
          image: nextImage,
          order: nextSectionOrder,
        });
      }
      handleCloseModal();
    } catch (error) {
      console.error("Error saving section:", error);
    }
  };

  const handleToggleEnabled = (section: Section) => {
    setToggleTarget({ id: section.id, name: section.name, nextEnabled: !section.enabled });
    setToggleDialogOpen(true);
  };

  const handleToggleConfirm = async () => {
    if (!toggleTarget) return;
    try {
      await setSectionEnabledMutation.mutateAsync({
        id: toggleTarget.id,
        enabled: toggleTarget.nextEnabled,
      });
      setToggleDialogOpen(false);
      setToggleTarget(null);
    } catch (error) {
      console.error("Error toggling section:", error);
    }
  };

  const handleDeleteClick = (section: Section) => {
    setSectionToDelete(section);
    setDeleteError(null);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!sectionToDelete) return;
    try {
      await deleteSectionMutation.mutateAsync(sectionToDelete.id);
      setDeleteDialogOpen(false);
      setSectionToDelete(null);
      setDeleteError(null);
    } catch (error) {
      if (error instanceof ApiError && error.message) {
        setDeleteError(error.message);
      } else {
        setDeleteError("Something went wrong. Please try again.");
      }
    }
  };

  const getCategoryName = useCallback(
    (id: string) => categories.find((c) => c.id === id)?.name ?? "—",
    [categories]
  );

  const sectionIds = useMemo(() => sections.map((s) => s.id), [sections]);
  const canReorderSections = selectedCategoryId !== "all";

  const handleMoveSection = useCallback(
    (section: Section, direction: "up" | "down") => {
      if (!canReorderSections) return;
      const i = sectionIds.indexOf(section.id);
      if (i < 0) return;
      if (direction === "up" && i === 0) return;
      if (direction === "down" && i === sectionIds.length - 1) return;
      const next = [...sectionIds];
      const j = direction === "up" ? i - 1 : i + 1;
      [next[i], next[j]] = [next[j], next[i]];
      reorderSectionsMutation.mutate({ categoryId: selectedCategoryId, sectionIds: next });
    },
    [canReorderSections, sectionIds, selectedCategoryId, reorderSectionsMutation]
  );

  const columns: Column<Section>[] = useMemo(
    () => [
      {
        key: "image",
        header: "Section",
        render: (section) => (
          <div className="flex items-center gap-3">
            {section.imageUrl ? (
              <div className="h-10 w-10 rounded-md overflow-hidden bg-background-alt border border-border shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={section.imageUrl}
                  alt={section.name}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="h-10 w-10 rounded-md bg-background-alt border border-dashed border-border flex items-center justify-center text-xs text-text-secondary shrink-0">
                No image
              </div>
            )}
            <div className="font-semibold text-text-primary">{section.name}</div>
          </div>
        ),
      },
      {
        key: "category",
        header: "Category",
        render: (section) => (
          <Badge variant="outline" className="bg-background-alt">
            {getCategoryName(section.categoryId)}
          </Badge>
        ),
      },
      {
        key: "order",
        header: "Order",
        render: (section) => {
          if (!canReorderSections) {
            return (
              <span className="text-text-secondary tabular-nums">
                {section.order != null ? section.order : "—"}
              </span>
            );
          }
          const i = sectionIds.indexOf(section.id);
          const canMoveUp = i > 0;
          const canMoveDown = i >= 0 && i < sectionIds.length - 1;
          return (
            <div className="flex items-center gap-1">
              <span className="text-text-secondary tabular-nums min-w-[1.5rem]">
                {section.order != null ? section.order : "—"}
              </span>
              <div className="flex flex-col">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-text-secondary hover:text-text-primary disabled:opacity-40"
                  disabled={!canMoveUp || reorderSectionsMutation.isPending}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMoveSection(section, "up");
                  }}
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 -mt-1 text-text-secondary hover:text-text-primary disabled:opacity-40"
                  disabled={!canMoveDown || reorderSectionsMutation.isPending}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMoveSection(section, "down");
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
        key: "slug",
        header: "Slug",
        render: (section) => (
          <code className="text-xs font-mono text-text-secondary bg-background-alt px-2 py-1 rounded border border-border">
            {section.slug}
          </code>
        ),
      },
      {
        key: "enabled",
        header: "Status",
        render: (section) => (
          <div className="flex items-center gap-3">
            <Switch
              checked={section.enabled}
              onCheckedChange={() => handleToggleEnabled(section)}
              onClick={(e) => e.stopPropagation()}
            />
            <Badge
              variant={section.enabled ? "default" : "outline"}
              className={section.enabled ? "bg-primary/10 text-primary border-primary/20" : ""}
            >
              {section.enabled ? "Enabled" : "Disabled"}
            </Badge>
          </div>
        ),
      },
      {
        key: "actions",
        header: "Actions",
        headerClassName: "text-right",
        className: "text-right",
        render: (section) => (
          <div className="flex items-center justify-end gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                handleOpenModal(section);
              }}
              className="h-8 w-8 text-text-secondary hover:bg-primary/10 hover:text-primary cursor-pointer"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteClick(section);
              }}
              className="h-8 w-8 text-text-secondary hover:text-destructive hover:bg-destructive/10 cursor-pointer"
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ),
      },
    ],
    [
      canReorderSections,
      getCategoryName,
      handleDeleteClick,
      handleMoveSection,
      handleOpenModal,
      handleToggleEnabled,
      reorderSectionsMutation.isPending,
      sectionIds,
    ]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Sections</h1>
          <p className="text-text-secondary mt-1">Manage menu sections</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          Add Section
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <Label htmlFor="category-filter" className="text-text-secondary shrink-0">
          Filter by category
        </Label>
        <Select
          value={selectedCategoryId}
          onValueChange={(v) => {
            setSelectedCategoryId(v);
            setCurrentPage(1);
          }}
        >
          <SelectTrigger id="category-filter" className="w-full sm:w-56">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {canReorderSections && (
          <p className="text-sm text-text-secondary">
            Order is per category. Use the drag handle or arrows to reorder sections within the selected category.
          </p>
        )}
      </div>

      <div className="space-y-0">
        <DataTable
          data={sections}
          columns={columns}
          emptyMessage="No sections found"
          emptyDescription={
            selectedCategoryId === "all"
              ? "Create your first section or filter by category."
              : "No sections in this category."
          }
          loading={sectionsQuery.isLoading}
          loadingRows={5}
          sortableConfig={
            canReorderSections
              ? {
                  sortableIds: sectionIds,
                  onReorder: (orderedIds) =>
                    reorderSectionsMutation.mutate({
                      categoryId: selectedCategoryId,
                      sectionIds: orderedIds,
                    }),
                  isReordering: reorderSectionsMutation.isPending,
                }
              : undefined
          }
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

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[640px]">
          <DialogHeader>
            <DialogTitle className="text-text-primary">
              {editingSection ? "Edit Section" : "Add New Section"}
            </DialogTitle>
            <DialogDescription className="text-text-secondary">
              {editingSection
                ? "Update the section details. Only changed fields are sent."
                : "Create a new menu section. Slug is generated automatically."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-5 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-text-secondary">
                    Section name
                  </Label>
                  <Input
                    id="name"
                    {...register("name", { required: true })}
                    placeholder="e.g. Signature Cocktails, Small Chops"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-text-secondary">
                    Category
                  </Label>
                  <Select
                    value={categoryId}
                    onValueChange={(v) => setValue("categoryId", v, { shouldDirty: true, shouldTouch: true })}

                  >
                    <SelectTrigger id="category" className="w-full">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="description" className="text-text-secondary">
                    Description (optional)
                  </Label>
                  <Input
                    id="description"
                    {...register("description")}
                    placeholder="Short description for this section"
                  />
                </div>
                <div className="sm:col-span-2 space-y-2">
                  <Label className="text-text-secondary">Image (optional)</Label>
                  <ImageDropzone
                    value={image}
                    existingUrl={existingImageUrl}
                    onRemoveExisting={() => {
                      setExistingImageUrl(null);
                      setValue("image", null, { shouldDirty: true, shouldTouch: true });
                    }}
                    onChange={(file) =>
                      setValue("image", file, { shouldDirty: true, shouldTouch: true })
                    }
                    disabled={createSectionMutation.isPending || updateSectionMutation.isPending}
                  />
                </div>
                <div className="sm:col-span-2 flex items-center justify-between gap-3 rounded-lg border border-border bg-background-alt/40 px-4 py-3">
                  <div>
                    <div className="text-sm font-medium text-text-primary">Enable section</div>
                    <div className="text-xs text-text-secondary mt-0.5">
                      Controls visibility on the public menu
                    </div>
                  </div>
                  <Switch
                    checked={watch("enabled")}
                    onCheckedChange={(checked) =>
                      setValue("enabled", checked, { shouldDirty: true, shouldTouch: true })
                    }
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseModal}
                disabled={createSectionMutation.isPending || updateSectionMutation.isPending}
                className="text-text-secondary"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createSectionMutation.isPending || updateSectionMutation.isPending}
              >
                {createSectionMutation.isPending || updateSectionMutation.isPending
                  ? "Saving..."
                  : editingSection
                    ? "Update Section"
                    : "Create Section"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <DeleteConfirmationDialog
        open={toggleDialogOpen}
        onOpenChange={(open) => {
          if (setSectionEnabledMutation.isPending) return;
          setToggleDialogOpen(open);
          if (!open) setToggleTarget(null);
        }}
        onConfirm={handleToggleConfirm}
        title={toggleTarget?.nextEnabled ? "Enable Section" : "Disable Section"}
        description={
          toggleTarget
            ? toggleTarget.nextEnabled
              ? `Enable "${toggleTarget.name}"? It will appear on the public menu.`
              : `Disable "${toggleTarget.name}"? It will be hidden from the public menu.`
            : undefined
        }
        confirmText={toggleTarget?.nextEnabled ? "Enable" : "Disable"}
        confirmLoadingText={toggleTarget?.nextEnabled ? "Enabling..." : "Disabling..."}
        confirmVariant={toggleTarget?.nextEnabled ? "default" : "destructive"}
        isLoading={setSectionEnabledMutation.isPending}
      />

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          if (deleteSectionMutation.isPending) return;
          setDeleteDialogOpen(open);
          if (!open) {
            setSectionToDelete(null);
            setDeleteError(null);
          }
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Section"
        description={
          sectionToDelete
            ? `Are you sure you want to delete "${sectionToDelete.name}"? This action cannot be undone.`
            : undefined
        }
        itemName={sectionToDelete?.name}
        errorMessage={deleteError}
        isLoading={deleteSectionMutation.isPending}
        confirmText="Delete"
        confirmLoadingText="Deleting..."
      />
    </div>
  );
}
