"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { Plus, Edit2, Trash2, Filter, X, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { FilterDialog, type FilterOptions } from "@/components/admin/filter-dialog";
import { SearchInput } from "@/components/admin/search-input";
import { ImageDropzone } from "@/components/ui/image-dropzone";
import { adminHooks } from "@/lib/api";
import type { MenuItemWithRelations } from "@/lib/api/admin/menu";
import { useForm } from "react-hook-form";

const perPage = 10;

function formatPrice(price: number) {
  return `₦${price.toLocaleString()}`;
}

export default function MenuItemsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 300);
  const [filters, setFilters] = useState<FilterOptions>({
    categoryId: "all",
    sectionId: "all",
    available: undefined,
    priceStatus: "all",
  });
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItemWithRelations | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewingItemId, setViewingItemId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<MenuItemWithRelations | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const listParams = useMemo(
    () => ({
      page: currentPage,
      perPage,
      search: debouncedSearch || undefined,
      categoryId: filters.categoryId && filters.categoryId !== "all" ? filters.categoryId : undefined,
      sectionId: filters.sectionId && filters.sectionId !== "all" ? filters.sectionId : undefined,
      includeDisabled: true,
      available: filters.available,
    }),
    [currentPage, debouncedSearch, filters]
  );

  const categoriesQuery = adminHooks.useCategories({ page: 1, perPage: 200 });
  const sectionsQuery = adminHooks.useSections({ page: 1, perPage: 200 });
  const menuItemsQuery = adminHooks.useMenuItems(listParams);
  const viewingItemQuery = adminHooks.useMenuItem(viewingItemId, { enabled: viewDialogOpen });
  const createMutation = adminHooks.useCreateMenuItem();
  const updateMutation = adminHooks.useUpdateMenuItem();
  const deleteMutation = adminHooks.useDeleteMenuItem();
  const setAvailabilityMutation = adminHooks.useSetMenuItemAvailability();

  const categories = categoriesQuery.data?.data ?? [];
  const sections = sectionsQuery.data?.data ?? [];
  const listResponse = menuItemsQuery.data;
  const menuItems = listResponse?.data ?? [];
  const meta = listResponse?.meta;
  const totalPages = meta?.lastPage ?? 1;
  const totalItems = meta?.total ?? 0;

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
    sectionId: string;
    basePrice: string;
    image: File | null;
    available: boolean;
  }>({
    defaultValues: {
      name: "",
      description: "",
      categoryId: "",
      sectionId: "",
      basePrice: "",
      image: null,
      available: true,
    },
  });

  const image = watch("image");
  const formCategoryId = watch("categoryId");

  const availableSections = useMemo(
    () => (formCategoryId ? sections.filter((s) => s.categoryId === formCategoryId) : []),
    [sections, formCategoryId]
  );

  const handleOpenModal = (item?: MenuItemWithRelations) => {
    if (item) {
      setEditingItem(item);
      setExistingImageUrl(item.imageUrl || null);
      reset({
        name: item.name,
        description: item.description || "",
        categoryId: item.categoryId,
        sectionId: item.sectionId,
        basePrice: String(item.basePrice),
        image: null,
        available: item.available,
      });
    } else {
      setEditingItem(null);
      setExistingImageUrl(null);
      reset({
        name: "",
        description: "",
        categoryId: categories[0]?.id ?? "",
        sectionId: "",
        basePrice: "",
        image: null,
        available: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setExistingImageUrl(null);
    reset({
      name: "",
      description: "",
      categoryId: "",
      sectionId: "",
      basePrice: "",
      image: null,
      available: true,
    });
  };

  const onSubmit = async (values: {
    name: string;
    description: string;
    categoryId: string;
    sectionId: string;
    basePrice: string;
    image: File | null;
    available: boolean;
  }) => {
    const basePrice = Number(values.basePrice);
    if (Number.isNaN(basePrice) || basePrice < 0) return;
    try {
      if (editingItem) {
        const body: Parameters<typeof updateMutation.mutateAsync>[0]["body"] = {};
        if (dirtyFields.name) body.name = values.name;
        if (dirtyFields.description) body.description = values.description;
        if (dirtyFields.categoryId) body.categoryId = values.categoryId;
        if (dirtyFields.sectionId) body.sectionId = values.sectionId;
        if (dirtyFields.basePrice) body.basePrice = basePrice;
        if (dirtyFields.available) body.available = values.available;
        if (values.image) body.image = values.image;
        if (Object.keys(body).length === 0) {
          handleCloseModal();
          return;
        }
        await updateMutation.mutateAsync({ id: editingItem.id, body });
      } else {
        await createMutation.mutateAsync({
          categoryId: values.categoryId,
          sectionId: values.sectionId,
          name: values.name,
          basePrice,
          description: values.description || undefined,
          image: values.image ?? undefined,
          available: values.available,
        });
      }
      handleCloseModal();
    } catch (error) {
      console.error("Error saving menu item:", error);
    }
  };

  const handleViewClick = (item: MenuItemWithRelations) => {
    setViewingItemId(item.id);
    setViewDialogOpen(true);
  };

  const handleDeleteClick = (item: MenuItemWithRelations) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    try {
      await deleteMutation.mutateAsync(itemToDelete.id);
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    } catch (error) {
      console.error("Error deleting menu item:", error);
    }
  };

  const handleToggleAvailable = (item: MenuItemWithRelations) => {
    setAvailabilityMutation.mutate({ id: item.id, available: !item.available });
  };

  const handleResetFilters = () => {
    setFilters({
      categoryId: "all",
      sectionId: "all",
      available: undefined,
      priceStatus: "all",
    });
    setSearchQuery("");
    setCurrentPage(1);
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.categoryId && filters.categoryId !== "all") count++;
    if (filters.sectionId && filters.sectionId !== "all") count++;
    if (filters.available !== undefined) count++;
    if (filters.priceStatus && filters.priceStatus !== "all") count++;
    return count;
  }, [filters]);

  const getCategoryName = (item: MenuItemWithRelations) =>
    item.category?.name ?? item.categoryId;
  const getSectionName = (item: MenuItemWithRelations) =>
    item.section?.name ?? item.sectionId;

  const columns: Column<MenuItemWithRelations>[] = useMemo(
    () => [
      {
        key: "name",
        header: "Item",
        render: (item) => (
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg border border-border bg-background-alt overflow-hidden shrink-0">
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-[10px] text-text-secondary">
                  No image
                </div>
              )}
            </div>
            <div className="font-semibold text-text-primary">{item.name}</div>
          </div>
        ),
      },
      {
        key: "category",
        header: "Category",
        render: (item) => (
          <Badge variant="outline" className="bg-background-alt">
            {getCategoryName(item)}
          </Badge>
        ),
      },
      {
        key: "section",
        header: "Section",
        render: (item) => (
          <span className="text-text-secondary text-sm">{getSectionName(item)}</span>
        ),
      },
      {
        key: "price",
        header: "Price",
        render: (item) => (
          <div className="space-y-1">
            <div className="font-semibold text-text-primary">
              {formatPrice(item.currentPrice ?? item.basePrice)}
            </div>
            {(item.currentPrice ?? item.basePrice) !== item.basePrice && (
              <span className="text-xs text-text-secondary line-through">
                {formatPrice(item.basePrice)}
              </span>
            )}
          </div>
        ),
      },
      {
        key: "available",
        header: "Status",
        render: (item) => (
          <div className="flex items-center gap-3">
            <Switch
              checked={item.available}
              onCheckedChange={() => handleToggleAvailable(item)}
              onClick={(e) => e.stopPropagation()}
            />
            <Badge
              variant={item.available ? "default" : "outline"}
              className={
                item.available ? "bg-primary/10 text-primary border-primary/20" : ""
              }
            >
              {item.available ? "Available" : "Unavailable"}
            </Badge>
          </div>
        ),
      },
      {
        key: "actions",
        header: "Actions",
        headerClassName: "text-right",
        className: "text-right",
        render: (item) => (
          <div className="flex items-center justify-end gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                handleViewClick(item);
              }}
              className="h-8 w-8 text-text-secondary hover:bg-background-alt hover:text-text-primary"
              title="View"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                handleOpenModal(item);
              }}
              className="h-8 w-8 text-text-secondary hover:bg-primary/10 hover:text-primary"
              title="Edit"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteClick(item);
              }}
              className="h-8 w-8 text-text-secondary hover:bg-destructive/10 hover:text-destructive"
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ),
      },
    ],
    [handleViewClick, handleOpenModal, handleDeleteClick, handleToggleAvailable]
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Menu Items</h1>
          <p className="text-text-secondary mt-1">Manage menu items, prices, and availability</p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="h-4 w-4" />
          Add Menu Item
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <SearchInput
          value={searchQuery}
          onChange={(value) => {
            setSearchQuery(value);
            setCurrentPage(1);
          }}
          placeholder="Search menu items..."
        />
        <Button
          variant="outline"
          onClick={() => setFilterDialogOpen(true)}
          className="relative text-text-primary"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {activeFiltersCount > 0 && (
            <span className="ml-2 px-2 py-0.5 text-xs bg-primary text-white rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </Button>
        {(activeFiltersCount > 0 || debouncedSearch) && (
          <Button variant="ghost" size="icon" onClick={handleResetFilters} className="h-9 w-9" title="Clear filters">
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="space-y-0">
        <DataTable
          data={menuItems}
          columns={columns}
          emptyMessage="No menu items found"
          emptyDescription={
            debouncedSearch || activeFiltersCount > 0
              ? "Try adjusting your search or filters."
              : "Create your first menu item to get started."
          }
          loading={menuItemsQuery.isLoading}
          loadingRows={5}
        />
        {totalItems > 0 && (
          <Pagination
            currentPage={meta?.currentPage ?? currentPage}
            totalPages={totalPages}
            pageSize={perPage}
            totalItems={totalItems}
            onPageChange={setCurrentPage}
            className="rounded-b-lg border-t-0 -mt-px"
          />
        )}
      </div>

      <FilterDialog
        open={filterDialogOpen}
        onOpenChange={setFilterDialogOpen}
        filters={filters}
        onFiltersChange={(newFilters) => {
          setFilters(newFilters);
          setCurrentPage(1);
        }}
        categories={categories}
        sections={sections}
        onReset={handleResetFilters}
      />

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-text-primary">
              {editingItem ? "Edit Menu Item" : "Add New Menu Item"}
            </DialogTitle>
            <DialogDescription className="text-text-secondary">
              {editingItem
                ? "Update the menu item details below."
                : "Create a new menu item. You can add temporary pricing after saving."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-text-secondary">
                  Item Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  {...register("name", { required: true })}
                  placeholder="e.g., Grilled Chicken"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-text-secondary">Category <span className="text-destructive">*</span></Label>
                  <Select
                    value={watch("categoryId")}
                    onValueChange={(v) => setValue("categoryId", v, { shouldDirty: true })}
                  >
                    <SelectTrigger className="w-full">
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
                <div className="space-y-2">
                  <Label className="text-text-secondary">Section <span className="text-destructive">*</span></Label>
                  <Select
                    value={watch("sectionId")}
                    onValueChange={(v) => setValue("sectionId", v, { shouldDirty: true })}
                    disabled={!watch("categoryId")}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select section" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableSections.map((sec) => (
                        <SelectItem key={sec.id} value={sec.id}>
                          {sec.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="basePrice" className="text-text-secondary">
                  Base Price (₦) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="basePrice"
                  type="number"
                  min={0}
                  step="1"
                  {...register("basePrice", { required: true })}
                  placeholder="5000"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-text-secondary">Image (optional)</Label>
                <ImageDropzone
                  value={image}
                  existingUrl={existingImageUrl}
                  onRemoveExisting={() => {
                    setExistingImageUrl(null);
                    setValue("image", null, { shouldDirty: true });
                  }}
                  onChange={(file) => setValue("image", file, { shouldDirty: true })}
                  disabled={createMutation.isPending || updateMutation.isPending}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-text-secondary">Description (optional)</Label>
                <Textarea
                  id="description"
                  {...register("description")}
                  placeholder="Item description..."
                  rows={3}
                  className="text-text-primary"
                />
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  id="available"
                  checked={watch("available")}
                  onCheckedChange={(c) => setValue("available", c, { shouldDirty: true })}
                />
                <Label htmlFor="available" className="cursor-pointer text-text-secondary text-sm">
                  Item is available
                </Label>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseModal} disabled={createMutation.isPending || updateMutation.isPending} className="text-text-secondary">
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {createMutation.isPending || updateMutation.isPending ? "Saving..." : editingItem ? "Update Item" : "Create Item"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={viewDialogOpen}
        onOpenChange={(open) => {
          setViewDialogOpen(open);
          if (!open) setViewingItemId(null);
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[560px]">
          <DialogHeader>
            <DialogTitle className="text-text-primary">Menu Item Details</DialogTitle>
          </DialogHeader>
          {viewingItemQuery.isLoading ? (
            <div className="space-y-3">
              <div className="h-28 rounded-lg border border-border bg-background-alt/40" />
              <div className="h-10 rounded-lg border border-border bg-background-alt/40" />
            </div>
          ) : viewingItemQuery.data ? (
            <div className="space-y-4">
              <div className="overflow-hidden rounded-lg border border-border bg-white">
                {viewingItemQuery.data.imageUrl ? (
                  <div className="w-full aspect-video bg-background-alt">
                    <img
                      src={viewingItemQuery.data.imageUrl}
                      alt={viewingItemQuery.data.name}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div className="w-full aspect-video bg-background-alt flex items-center justify-center text-sm text-text-secondary border-b border-border">
                    No image
                  </div>
                )}
                <div className="p-4 space-y-4">
                  <div>
                    <div className="text-xs font-medium text-text-secondary uppercase tracking-wide mb-1">Name</div>
                    <div className="text-lg font-semibold text-text-primary">{viewingItemQuery.data.name}</div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-text-secondary uppercase tracking-wide mb-1">Description</div>
                    <div className="text-sm text-text-primary">
                      {viewingItemQuery.data.description || "—"}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs font-medium text-text-secondary uppercase tracking-wide mb-1">Category</div>
                      <div className="text-sm text-text-primary">
                        {viewingItemQuery.data.category?.name ?? "—"}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-text-secondary uppercase tracking-wide mb-1">Section</div>
                      <div className="text-sm text-text-primary">
                        {viewingItemQuery.data.section?.name ?? "—"}
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-text-secondary uppercase tracking-wide mb-1">Slug</div>
                    <code className="text-xs font-mono text-text-secondary bg-background-alt px-2 py-1 rounded-md border border-border">
                      {viewingItemQuery.data.slug || "—"}
                    </code>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs font-medium text-text-secondary uppercase tracking-wide mb-1">Base price</div>
                      <div className="text-sm font-semibold text-text-primary">
                        {formatPrice(viewingItemQuery.data.basePrice)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-text-secondary uppercase tracking-wide mb-1">Current price</div>
                      <div className="text-sm font-semibold text-text-primary">
                        {(viewingItemQuery.data.currentPrice ?? viewingItemQuery.data.basePrice) !== viewingItemQuery.data.basePrice
                          ? formatPrice(viewingItemQuery.data.currentPrice ?? viewingItemQuery.data.basePrice)
                          : formatPrice(viewingItemQuery.data.basePrice)}
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-text-secondary uppercase tracking-wide mb-2">Status</div>
                    <div className="flex flex-wrap gap-2">
                      <span
                        className={`inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium ${
                          viewingItemQuery.data.available
                            ? "bg-primary/10 text-primary border-primary/20"
                            : "border-border text-text-secondary"
                        }`}
                      >
                        {viewingItemQuery.data.available ? "Available" : "Unavailable"}
                      </span>
                      <span
                        className={`inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium ${
                          viewingItemQuery.data.enabled
                            ? "bg-primary/10 text-primary border-primary/20"
                            : "border-border text-text-secondary"
                        }`}
                      >
                        {viewingItemQuery.data.enabled ? "Enabled" : "Disabled"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-sm text-text-secondary">Could not load menu item details.</div>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setViewDialogOpen(false)} className="text-text-secondary">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        title="Delete Menu Item"
        itemName={itemToDelete?.name}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
