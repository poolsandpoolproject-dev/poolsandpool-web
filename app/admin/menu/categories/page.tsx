"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
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
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  toggleCategoryEnabled,
  type Category,
} from "@/lib/data/categories";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    imageUrl: "",
    enabled: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; // Fixed page size
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load categories
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      // Simulate API call delay (2 seconds)
      await new Promise((resolve) => setTimeout(resolve, 2000));
      loadCategories();
      setIsLoading(false);
    };
    loadData();
  }, []);

  const loadCategories = () => {
    setCategories(getAllCategories());
  };

  const handleOpenModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        description: category.description || "",
        imageUrl: category.imageUrl || "",
        enabled: category.enabled,
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: "",
        description: "",
        imageUrl: "",
        enabled: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setFormData({
      name: "",
      description: "",
      imageUrl: "",
      enabled: true,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingCategory) {
        // Update existing category
        updateCategory(editingCategory.id, {
          name: formData.name,
          description: formData.description || undefined,
          imageUrl: formData.imageUrl || undefined,
          enabled: formData.enabled,
        });
      } else {
        // Create new category
        createCategory(
          formData.name,
          formData.enabled,
          formData.description || undefined,
          formData.imageUrl || undefined
        );
      }
      loadCategories();
      handleCloseModal();
    } catch (error) {
      console.error("Error saving category:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (category: Category) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;
    
    setIsDeleting(true);
    try {
      deleteCategory(categoryToDelete.id);
      loadCategories();
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
    } catch (error) {
      console.error("Error deleting category:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleEnabled = (id: string) => {
    toggleCategoryEnabled(id);
    loadCategories();
  };

  // Pagination logic
  const paginatedCategories = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return categories.slice(start, end);
  }, [categories, currentPage, pageSize]);

  const totalPages = Math.ceil(categories.length / pageSize);

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
            {category.description && (
              <p className="text-xs text-text-secondary line-clamp-1">
                {category.description}
              </p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "slug",
      header: "Slug",
      render: (category) => (
        <code className="text-xs font-mono text-text-secondary bg-background-alt px-2 py-1 rounded border border-border">
          {category.slug}
        </code>
      ),
    },
    {
      key: "enabled",
      header: "Status",
      render: (category) => (
        <div className="flex items-center gap-3">
          <Switch
            checked={category.enabled}
            onCheckedChange={() => handleToggleEnabled(category.id)}
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
              handleOpenModal(category);
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
              handleDeleteClick(category);
            }}
            className="h-8 w-8 text-text-secondary hover:bg-destructive/10 hover:text-destructive cursor-pointer"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ], [handleOpenModal, handleDeleteClick, handleToggleEnabled]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Categories</h1>
          <p className="text-text-secondary mt-1">Manage menu categories</p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="h-4 w-4" />
          Add Category
        </Button>
      </div>

      <div className="space-y-0">
        <DataTable
          data={paginatedCategories}
          columns={columns}
          emptyMessage="No categories found"
          emptyDescription="Create your first category to get started."
          loading={isLoading}
          loadingRows={5}
        />
        {categories.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={categories.length}
            onPageChange={setCurrentPage}
            className="rounded-b-lg border-t-0 -mt-px"
          />
        )}
      </div>

      {/* Add/Edit Category Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
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
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-text-secondary">
                  Category Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., Food, Drinks, Smoke"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-text-secondary">
                  Description (optional)
                </Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Short description for public menu"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUrl" className="text-text-secondary">
                  Image URL (optional)
                </Label>
                <Input
                  id="imageUrl"
                  value={formData.imageUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, imageUrl: e.target.value })
                  }
                  placeholder="/images/categories/food.jpg or full URL"
                />
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  id="enabled"
                  checked={formData.enabled}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, enabled: checked })
                  }
                />
                <Label
                  htmlFor="enabled"
                  className="cursor-pointer text-text-secondary text-sm"
                >
                  Enable category
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
                  : editingCategory
                    ? "Update Category"
                    : "Create Category"}
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
        title="Delete Category"
        itemName={categoryToDelete?.name}
        isLoading={isDeleting}
      />
    </div>
  );
}
