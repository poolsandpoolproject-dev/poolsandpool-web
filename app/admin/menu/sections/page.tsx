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
import {
  getAllSections,
  createSection,
  updateSection,
  deleteSection,
  toggleSectionEnabled,
  type Section,
} from "@/lib/data/sections";
import {
  getAllCategories,
  type Category,
} from "@/lib/data/categories";

export default function SectionsPage() {
  const [sections, setSections] = useState<Section[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    imageUrl: "",
    categoryId: "",
    enabled: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; // Fixed page size
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [sectionToDelete, setSectionToDelete] = useState<Section | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load sections and categories
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      // Simulate API call delay (2 seconds)
      await new Promise((resolve) => setTimeout(resolve, 2000));
      loadCategories();
      loadSections();
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

  // Filter sections by selected category
  const filteredSections = useMemo(() => {
    if (selectedCategoryId === "all") {
      return sections;
    }
    return sections.filter((section) => section.categoryId === selectedCategoryId);
  }, [sections, selectedCategoryId]);

  const handleOpenModal = (section?: Section) => {
    if (section) {
      setEditingSection(section);
      setFormData({
        name: section.name,
        description: section.description || "",
        imageUrl: section.imageUrl || "",
        categoryId: section.categoryId,
        enabled: section.enabled,
      });
    } else {
      setEditingSection(null);
      setFormData({
        name: "",
        description: "",
        imageUrl: "",
        categoryId: selectedCategoryId !== "all" ? selectedCategoryId : categories[0]?.id || "",
        enabled: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSection(null);
    setFormData({
      name: "",
      description: "",
      imageUrl: "",
      categoryId: "",
      enabled: true,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingSection) {
        // Update existing section
        updateSection(editingSection.id, {
          name: formData.name,
          description: formData.description || undefined,
          imageUrl: formData.imageUrl || undefined,
          categoryId: formData.categoryId,
          enabled: formData.enabled,
        });
      } else {
        // Create new section
        createSection(
          formData.name,
          formData.categoryId,
          formData.enabled,
          formData.description || undefined,
          formData.imageUrl || undefined
        );
      }
      loadSections();
      handleCloseModal();
    } catch (error) {
      console.error("Error saving section:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (section: Section) => {
    setSectionToDelete(section);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!sectionToDelete) return;

    setIsDeleting(true);
    try {
      deleteSection(sectionToDelete.id);
      loadSections();
      setDeleteDialogOpen(false);
      setSectionToDelete(null);
    } catch (error) {
      console.error("Error deleting section:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleEnabled = (id: string) => {
    toggleSectionEnabled(id);
    loadSections();
  };

  // Pagination logic
  const paginatedSections = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredSections.slice(start, end);
  }, [filteredSections, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredSections.length / pageSize);

  // Get category name by ID
  const getCategoryName = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category?.name || "Unknown";
  };

  // Table columns
  const columns: Column<Section>[] = useMemo(() => [
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
          <div className="space-y-0.5">
            <div className="font-semibold text-text-primary">{section.name}</div>
            {section.description && (
              <p className="text-xs text-text-secondary line-clamp-1">
                {section.description}
              </p>
            )}
          </div>
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
            onCheckedChange={() => handleToggleEnabled(section.id)}
            onClick={(e) => e.stopPropagation()}
          />
          <Badge
            variant={section.enabled ? "default" : "outline"}
            className={
              section.enabled
                ? "bg-primary/10 text-primary border-primary/20"
                : ""
            }
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
            className="h-8 w-8 text-text-secondary hover:bg-destructive/10 hover:text-destructive cursor-pointer"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ], [categories, handleOpenModal, handleDeleteClick, handleToggleEnabled]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Sections</h1>
          <p className="text-text-secondary mt-1">Manage menu sections</p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="h-4 w-4" />
          Add Section
        </Button>
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-4">
        <Label htmlFor="category-filter" className="text-text-secondary">
          Filter by Category:
        </Label>
        <Select value={selectedCategoryId} onValueChange={setSelectedCategoryId}>
          <SelectTrigger id="category-filter" className="w-48">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-0">
        <DataTable
          data={paginatedSections}
          columns={columns}
          emptyMessage="No sections found"
          emptyDescription={
            selectedCategoryId === "all"
              ? "Create your first section to get started."
              : "No sections found for this category."
          }
          loading={isLoading}
          loadingRows={5}
        />
        {filteredSections.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={filteredSections.length}
            onPageChange={setCurrentPage}
            className="rounded-b-lg border-t-0 -mt-px"
          />
        )}
      </div>

      {/* Add/Edit Section Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-text-primary">
              {editingSection ? "Edit Section" : "Add New Section"}
            </DialogTitle>
            <DialogDescription className="text-text-secondary">
              {editingSection
                ? "Update the section details below."
                : "Create a new menu section. The slug will be generated automatically."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-text-secondary">
                  Section Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., Small Chops, Signature Cocktails"
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
                  placeholder="Short description for this section"
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
                  placeholder="/images/sections/small-chops.jpg or full URL"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category" className="text-text-secondary">
                  Category
                </Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, categoryId: value })
                  }
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select a category" />
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
              <div className="flex items-center gap-2">
                <Switch
                  id="enabled"
                  checked={formData.enabled}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, enabled: checked })
                  }
                />
                <Label htmlFor="enabled" className="cursor-pointer text-text-secondary text-sm">
                  Enable section
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
                  : editingSection
                    ? "Update Section"
                    : "Create Section"}
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
        title="Delete Section"
        itemName={sectionToDelete?.name}
        isLoading={isDeleting}
      />
    </div>
  );
}
