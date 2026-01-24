"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { Plus, Edit2, Trash2, Filter, X } from "lucide-react";
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
import {
  getAllMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  toggleMenuItemAvailability,
  type MenuItem,
} from "@/lib/data/menu-items";
import { getActiveTemporaryPrice } from "@/lib/data/temporary-prices";
import {
  getAllCategories,
  type Category,
} from "@/lib/data/categories";
import {
  getAllSections,
  type Section,
} from "@/lib/data/sections";

export default function MenuItemsPage() {
  const router = useRouter();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [filters, setFilters] = useState<FilterOptions>({
    categoryId: "all",
    sectionId: "all",
    available: undefined,
    priceStatus: "all",
  });
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    categoryId: "",
    sectionId: "",
    basePrice: "",
    imageUrl: "",
    available: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<MenuItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      loadCategories();
      loadSections();
      loadMenuItems();
      setIsLoading(false);
    };
    loadData();
  }, []);

  const loadCategories = () => {
    setCategories(getAllCategories());
  };

  const loadSections = () => {
    setSections(getAllSections());
  };

  const loadMenuItems = () => {
    const items = getAllMenuItems();
    // Resolve temporary prices for each item
    const itemsWithPrices = items.map((item) => {
      const activePrice = getActiveTemporaryPrice(item.id);
      const resolvedItem = {
        ...item,
        currentPrice: activePrice ? activePrice.price : item.basePrice,
        temporaryPrice: activePrice
          ? {
              price: activePrice.price,
              ruleName: activePrice.ruleName,
              startAt: activePrice.startAt,
              endAt: activePrice.endAt,
            }
          : undefined,
      };
      return resolvedItem;
    });
    setMenuItems(itemsWithPrices);
  };

  // Get sections filtered by category
  const availableSections = useMemo(() => {
    if (formData.categoryId) {
      return sections.filter((s) => s.categoryId === formData.categoryId);
    }
    return sections;
  }, [sections, formData.categoryId]);

  // Filter and search menu items
  const filteredMenuItems = useMemo(() => {
    let filtered = [...menuItems];

    // Search filter (using debounced value)
    if (debouncedSearchQuery.trim()) {
      const query = debouncedSearchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.description?.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (filters.categoryId && filters.categoryId !== "all") {
      filtered = filtered.filter((item) => item.categoryId === filters.categoryId);
    }

    // Section filter
    if (filters.sectionId && filters.sectionId !== "all") {
      filtered = filtered.filter((item) => item.sectionId === filters.sectionId);
    }

    // Availability filter
    if (filters.available !== undefined) {
      filtered = filtered.filter((item) => item.available === filters.available);
    }

    // Price status filter
    if (filters.priceStatus && filters.priceStatus !== "all") {
      if (filters.priceStatus === "temporary") {
        filtered = filtered.filter((item) => item.temporaryPrice !== undefined);
      } else if (filters.priceStatus === "base") {
        filtered = filtered.filter((item) => item.temporaryPrice === undefined);
      }
    }

    return filtered;
  }, [menuItems, debouncedSearchQuery, filters]);

  // Pagination
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredMenuItems.slice(start, end);
  }, [filteredMenuItems, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredMenuItems.length / pageSize);

  // Helper functions
  const getCategoryName = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category?.name || "Unknown";
  };

  const getSectionName = (sectionId: string) => {
    const section = sections.find((sec) => sec.id === sectionId);
    return section?.name || "Unknown";
  };

  const formatPrice = (price: number) => {
    return `₦${price.toLocaleString()}`;
  };

  const handleOpenModal = useCallback((item?: MenuItem) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        description: item.description || "",
        categoryId: item.categoryId,
        sectionId: item.sectionId,
        basePrice: item.basePrice.toString(),
        imageUrl: item.imageUrl || item.image || "",
        available: item.available,
      });
    } else {
      setEditingItem(null);
      setFormData({
        name: "",
        description: "",
        categoryId: categories[0]?.id || "",
        sectionId: "",
        basePrice: "",
        imageUrl: "",
        available: true,
      });
    }
    setIsModalOpen(true);
  }, [categories]);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingItem(null);
    setFormData({
      name: "",
      description: "",
      categoryId: "",
      sectionId: "",
      basePrice: "",
      imageUrl: "",
      available: true,
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingItem) {
        updateMenuItem(editingItem.id, {
          name: formData.name,
          description: formData.description || undefined,
          categoryId: formData.categoryId,
          sectionId: formData.sectionId,
          basePrice: parseFloat(formData.basePrice),
          imageUrl: formData.imageUrl || undefined,
          available: formData.available,
        });
      } else {
        createMenuItem(
          formData.name,
          formData.categoryId,
          formData.sectionId,
          parseFloat(formData.basePrice),
          formData.description || undefined,
          formData.imageUrl || undefined,
          formData.available
        );
      }
      loadMenuItems();
      handleCloseModal();
    } catch (error) {
      console.error("Error saving menu item:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = useCallback((item: MenuItem) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!itemToDelete) return;

    setIsDeleting(true);
    try {
      deleteMenuItem(itemToDelete.id);
      loadMenuItems();
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    } catch (error) {
      console.error("Error deleting menu item:", error);
    } finally {
      setIsDeleting(false);
    }
  }, [itemToDelete]);

  const handleToggleAvailable = useCallback((id: string) => {
    toggleMenuItemAvailability(id);
    loadMenuItems();
  }, []);

  const handleResetFilters = () => {
    setFilters({
      categoryId: "all",
      sectionId: "all",
      available: undefined,
      priceStatus: "all",
    });
    setSearchQuery("");
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.categoryId && filters.categoryId !== "all") count++;
    if (filters.sectionId && filters.sectionId !== "all") count++;
    if (filters.available !== undefined) count++;
    if (filters.priceStatus && filters.priceStatus !== "all") count++;
    return count;
  }, [filters]);

  // Table columns
  const columns: Column<MenuItem>[] = useMemo(() => [
    {
      key: "name",
      header: "Item",
      render: (item) => (
        <div className="flex items-start gap-3">
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
          <div>
            <div className="font-semibold text-text-primary">{item.name}</div>
            {item.description && (
              <div className="text-sm text-text-secondary mt-1">{item.description}</div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      render: (item) => (
        <Badge variant="outline" className="bg-background-alt">
          {getCategoryName(item.categoryId)}
        </Badge>
      ),
    },
    {
      key: "section",
      header: "Section",
      render: (item) => (
        <span className="text-text-secondary text-sm">
          {getSectionName(item.sectionId)}
        </span>
      ),
    },
    {
      key: "price",
      header: "Price",
      render: (item) => {
        const hasTemporaryPrice = item.temporaryPrice && item.currentPrice !== item.basePrice;
        return (
          <div className="space-y-1">
            <div className="font-semibold text-text-primary">
              {formatPrice(item.currentPrice)}
            </div>
            {hasTemporaryPrice && item.temporaryPrice ? (
              <div className="flex items-center gap-1">
                <Badge variant="default" className="bg-primary/10 text-primary border-primary/20 text-xs">
                  {item.temporaryPrice.ruleName}
                </Badge>
                <span className="text-xs text-text-secondary line-through">
                  {formatPrice(item.basePrice)}
                </span>
              </div>
            ) : (
              <span className="text-xs text-text-light">Base price</span>
            )}
          </div>
        );
      },
    },
    {
      key: "available",
      header: "Status",
      render: (item) => (
        <div className="flex items-center gap-3">
          <Switch
            checked={item.available}
            onCheckedChange={() => handleToggleAvailable(item.id)}
            onClick={(e) => e.stopPropagation()}
          />
          <Badge
            variant={item.available ? "default" : "outline"}
            className={
              item.available
                ? "bg-primary/10 text-primary border-primary/20"
                : ""
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
              router.push(`/admin/menu/items/${item.id}`);
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
              handleDeleteClick(item);
            }}
            className="h-8 w-8 text-text-secondary hover:bg-destructive/10 hover:text-destructive cursor-pointer"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ], [categories, sections, handleOpenModal, handleDeleteClick, handleToggleAvailable]);

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

      {/* Search and Filter Row */}
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
          <Filter className="h-4 w-4 mr-2 text-text-primary" />
          Filters
          {activeFiltersCount > 0 && (
            <span className="ml-2 px-2 py-0.5 text-xs bg-primary text-white rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </Button>
        {(activeFiltersCount > 0 || debouncedSearchQuery) && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleResetFilters}
            className="h-9 w-9"
            title="Clear all filters"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="space-y-0">
        <DataTable
          data={paginatedItems}
          columns={columns}
          emptyMessage="No menu items found"
          emptyDescription={
            debouncedSearchQuery || activeFiltersCount > 0
              ? "Try adjusting your search or filters."
              : "Create your first menu item to get started."
          }
          loading={isLoading}
          loadingRows={5}
        />
        {filteredMenuItems.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={filteredMenuItems.length}
            onPageChange={setCurrentPage}
            className="rounded-b-lg border-t-0 -mt-px"
          />
        )}
      </div>

      {/* Filter Dialog */}
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

      {/* Add/Edit Menu Item Modal */}
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
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-text-secondary">
                  Item Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., Grilled Chicken"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-text-secondary">
                    Category <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.categoryId}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        categoryId: value,
                        sectionId: "", // Reset section when category changes
                      })
                    }
                  >
                    <SelectTrigger id="category" className="w-full">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="section" className="text-text-secondary">
                    Section <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.sectionId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, sectionId: value })
                    }
                    disabled={!formData.categoryId}
                  >
                    <SelectTrigger id="section" className="w-full">
                      <SelectValue placeholder="Select section" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableSections.map((section) => (
                        <SelectItem key={section.id} value={section.id}>
                          {section.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="basePrice" className="text-text-secondary">
                    Base Price (₦) <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="basePrice"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.basePrice}
                    onChange={(e) =>
                      setFormData({ ...formData, basePrice: e.target.value })
                    }
                    placeholder="5000"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="imageUrl" className="text-text-secondary">
                    Image URL (Optional)
                  </Label>
                  <Input
                    id="imageUrl"
                    value={formData.imageUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, imageUrl: e.target.value })
                    }
                    placeholder="https://..."
                  />
                </div>
              </div>

              {formData.imageUrl ? (
                <div className="rounded-lg border border-border bg-background-alt p-3">
                  <div className="text-xs text-text-secondary mb-2">Preview</div>
                  <div className="h-36 w-full overflow-hidden rounded-md border border-border bg-white">
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>
              ) : null}

              <div className="space-y-2">
                <Label htmlFor="description" className="text-text-secondary">
                  Description (Optional)
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Item description..."
                  rows={3}
                  className="text-text-primary"
                />
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  id="available"
                  checked={formData.available}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, available: checked })
                  }
                />
                <Label htmlFor="available" className="cursor-pointer text-text-secondary text-sm">
                  Item is available
                </Label>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseModal}
                disabled={isSubmitting}
                className="text-text-secondary"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? "Saving..."
                  : editingItem
                    ? "Update Item"
                    : "Create Item"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        title="Delete Menu Item"
        itemName={itemToDelete?.name}
        isLoading={isDeleting}
      />
    </div>
  );
}
