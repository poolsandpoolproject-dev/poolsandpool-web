"use client";

import { useState, useEffect, useMemo, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getMenuItemById, updateMenuItem, type MenuItem } from "@/lib/data/menu-items";
import { getAllCategories } from "@/lib/data/categories";
import { getAllSections, getSectionsByCategoryId } from "@/lib/data/sections";
import { PricingTab } from "./pricing-tab";

export default function MenuItemDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);
  const [menuItem, setMenuItem] = useState<MenuItem | null>(null);
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);
  const [sections, setSections] = useState<Array<{ id: string; name: string }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [initialFormData, setInitialFormData] = useState({
    name: "",
    description: "",
    categoryId: "",
    sectionId: "",
    basePrice: "",
    imageUrl: "",
    available: true,
  });
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    categoryId: "",
    sectionId: "",
    basePrice: "",
    imageUrl: "",
    available: true,
  });

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      const item = getMenuItemById(id);
      const cats = getAllCategories();
      const secs = getAllSections();

      if (!item) {
        router.push("/admin/menu/items");
        return;
      }

      setMenuItem(item);
      setCategories(cats);
      setSections(getSectionsByCategoryId(item.categoryId));
      const initialData = {
        name: item.name,
        description: item.description || "",
        categoryId: item.categoryId,
        sectionId: item.sectionId,
        basePrice: item.basePrice.toString(),
        imageUrl: item.imageUrl || item.image || "",
        available: item.available,
      };
      setInitialFormData(initialData);
      setFormData(initialData);
      setIsLoading(false);
    };
    loadData();
  }, [id, router]);

  const availableSections = useMemo(() => {
    if (formData.categoryId) {
      return sections.filter((s) => {
        const section = getAllSections().find((sec) => sec.id === s.id);
        return section?.categoryId === formData.categoryId;
      });
    }
    return [];
  }, [sections, formData.categoryId]);

  const hasChanges = useMemo(() => {
    return (
      formData.name !== initialFormData.name ||
      formData.description !== initialFormData.description ||
      formData.categoryId !== initialFormData.categoryId ||
      formData.sectionId !== initialFormData.sectionId ||
      formData.basePrice !== initialFormData.basePrice ||
      formData.imageUrl !== initialFormData.imageUrl ||
      formData.available !== initialFormData.available
    );
  }, [formData, initialFormData]);

  const handleSave = async () => {
    if (!menuItem) return;

    setIsSaving(true);
    try {
      updateMenuItem(menuItem.id, {
        name: formData.name,
        description: formData.description || undefined,
        categoryId: formData.categoryId,
        sectionId: formData.sectionId,
        basePrice: parseFloat(formData.basePrice),
        imageUrl: formData.imageUrl || undefined,
        available: formData.available,
      });
      
      // Update initial form data to reflect saved state
      setInitialFormData({ ...formData });
      
      router.push("/admin/menu/items");
      router.refresh();
    } catch (error) {
      console.error("Error saving menu item:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-background-alt rounded animate-pulse" />
        <div className="h-96 bg-background-alt rounded animate-pulse" />
      </div>
    );
  }

  if (!menuItem) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/admin/menu/items")}
            className="cursor-pointer text-text-secondary"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-text-primary">{menuItem.name}</h1>
            <p className="text-text-secondary mt-1">Edit menu item details and pricing</p>
          </div>
        </div>
        {activeTab === "details" && (
          <Button onClick={handleSave} disabled={isSaving || !hasChanges}>
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        )}
      </div>

      <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-6">
          <div className="bg-white border border-border rounded-lg p-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-text-secondary">
                Item Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Grilled Chicken"
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
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="https://..."
              />
              {formData.imageUrl ? (
                <div className="rounded-lg border border-border bg-background-alt p-3">
                  <div className="text-xs text-text-secondary mb-2">Preview</div>
                  <div className="h-40 w-full overflow-hidden rounded-md border border-border bg-white">
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>
              ) : null}
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
                      sectionId: "",
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
        </TabsContent>

        <TabsContent value="pricing">
          <PricingTab menuItemId={menuItem.id} basePrice={menuItem.basePrice} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
