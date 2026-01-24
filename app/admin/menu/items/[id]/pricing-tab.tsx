"use client";

import { useState, useEffect, useMemo } from "react";
import { Plus, Edit2, Trash2, Copy, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DeleteConfirmationDialog } from "@/components/admin/delete-confirmation-dialog";
import {
  getTemporaryPricesByMenuItemId,
  getActiveTemporaryPrice,
  getUpcomingTemporaryPrices,
  getExpiredTemporaryPrices,
  createTemporaryPrice,
  updateTemporaryPrice,
  deleteTemporaryPrice,
  duplicateTemporaryPrice,
  toggleTemporaryPriceEnabled,
  type TemporaryPrice,
} from "@/lib/data/temporary-prices";
import { format } from "date-fns";

interface PricingTabProps {
  menuItemId: string;
  basePrice: number;
}

export function PricingTab({ menuItemId, basePrice }: PricingTabProps) {
  const [temporaryPrices, setTemporaryPrices] = useState<TemporaryPrice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPrice, setEditingPrice] = useState<TemporaryPrice | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [priceToDelete, setPriceToDelete] = useState<TemporaryPrice | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showExpired, setShowExpired] = useState(false);

  const [formData, setFormData] = useState({
    ruleName: "",
    price: "",
    startDate: undefined as Date | undefined,
    startTime: "",
    endDate: undefined as Date | undefined,
    endTime: "",
    enabled: true,
  });

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      loadTemporaryPrices();
      setIsLoading(false);
    };
    loadData();
  }, [menuItemId]);

  const loadTemporaryPrices = () => {
    const prices = getTemporaryPricesByMenuItemId(menuItemId);
    setTemporaryPrices(prices);
  };

  const now = new Date();
  const activePrice = useMemo(
    () => getActiveTemporaryPrice(menuItemId, now),
    [menuItemId, temporaryPrices]
  );
  const upcomingPrices = useMemo(
    () => getUpcomingTemporaryPrices(menuItemId, now).filter((p) => p.enabled),
    [menuItemId, temporaryPrices]
  );
  const expiredPrices = useMemo(
    () => getExpiredTemporaryPrices(menuItemId, now).filter((p) => p.enabled),
    [menuItemId, temporaryPrices]
  );
  const disabledPrices = useMemo(
    () => temporaryPrices.filter((p) => !p.enabled),
    [temporaryPrices]
  );

  const formatPrice = (price: number) => {
    return `₦${price.toLocaleString()}`;
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MMM d, yyyy 'at' h:mm a");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MMM d, yyyy");
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "h:mm a");
  };

  const handleOpenModal = (price?: TemporaryPrice) => {
    if (price) {
      setEditingPrice(price);
      const startDate = new Date(price.startAt);
      const endDate = new Date(price.endAt);
      setFormData({
        ruleName: price.ruleName,
        price: price.price.toString(),
        startDate,
        startTime: format(startDate, "HH:mm"),
        endDate,
        endTime: format(endDate, "HH:mm"),
        enabled: price.enabled,
      });
    } else {
      setEditingPrice(null);
      setFormData({
        ruleName: "",
        price: "",
        startDate: undefined,
        startTime: "",
        endDate: undefined,
        endTime: "",
        enabled: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPrice(null);
    setFormData({
      ruleName: "",
      price: "",
      startDate: undefined,
      startTime: "",
      endDate: undefined,
      endTime: "",
      enabled: true,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.startDate || !formData.endDate) return;

    const startDateTime = new Date(formData.startDate);
    if (formData.startTime) {
      const [hours, minutes] = formData.startTime.split(":").map(Number);
      startDateTime.setHours(hours, minutes, 0, 0);
    }

    const endDateTime = new Date(formData.endDate);
    if (formData.endTime) {
      const [hours, minutes] = formData.endTime.split(":").map(Number);
      endDateTime.setHours(hours, minutes, 0, 0);
    }

    if (editingPrice) {
      updateTemporaryPrice(editingPrice.id, {
        ruleName: formData.ruleName,
        price: parseFloat(formData.price),
        startAt: startDateTime.toISOString(),
        endAt: endDateTime.toISOString(),
        enabled: formData.enabled,
      });
    } else {
      createTemporaryPrice(
        menuItemId,
        formData.ruleName,
        parseFloat(formData.price),
        startDateTime.toISOString(),
        endDateTime.toISOString(),
        formData.enabled
      );
    }

    loadTemporaryPrices();
    handleCloseModal();
  };

  const handleDeleteClick = (price: TemporaryPrice) => {
    setPriceToDelete(price);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!priceToDelete) return;

    setIsDeleting(true);
    try {
      deleteTemporaryPrice(priceToDelete.id);
      loadTemporaryPrices();
      setDeleteDialogOpen(false);
      setPriceToDelete(null);
    } catch (error) {
      console.error("Error deleting temporary price:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDuplicate = (price: TemporaryPrice) => {
    duplicateTemporaryPrice(price.id);
    loadTemporaryPrices();
  };

  const handleToggleEnabled = (price: TemporaryPrice) => {
    toggleTemporaryPriceEnabled(price.id);
    loadTemporaryPrices();
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-32 bg-background-alt rounded animate-pulse" />
        <div className="h-64 bg-background-alt rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Section A: Base Price */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-text-primary">Base Price</CardTitle>
              <CardDescription className="text-text-secondary">
                The default price for this menu item
              </CardDescription>
            </div>
            <Button onClick={() => handleOpenModal()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Temporary Price
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-text-primary">{formatPrice(basePrice)}</div>
          <p className="text-sm text-text-secondary mt-2">
            This price is used when no temporary pricing rule is active
          </p>
        </CardContent>
      </Card>

      {/* Section B: Active Temporary Price */}
      {activePrice && (
        <Card className="border-primary/50 bg-primary/5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                <CardTitle className="text-primary">ACTIVE PRICE</CardTitle>
                <Badge variant="default" className="bg-primary/10 text-primary border-primary/20">
                  Active
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-border bg-background">
                  <Label htmlFor={`toggle-active-${activePrice.id}`} className="text-sm text-text-secondary cursor-pointer">
                    Enabled
                  </Label>
                  <Switch
                    id={`toggle-active-${activePrice.id}`}
                    checked={activePrice.enabled}
                    onCheckedChange={() => handleToggleEnabled(activePrice)}
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenModal(activePrice)}
                >
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDuplicate(activePrice)}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-2xl font-bold text-text-primary">
              {formatPrice(activePrice.price)}
            </div>
            <div className="text-lg font-semibold text-text-primary">
              {activePrice.ruleName}
            </div>
            <div className="text-sm text-text-secondary">
              {formatDateTime(activePrice.startAt)} – {formatDateTime(activePrice.endAt)}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Section C: Scheduled Prices */}
      <div className="space-y-4">
        {/* Upcoming Prices */}
        {upcomingPrices.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-text-primary">Upcoming Prices</h3>
            </div>
            <div className="space-y-3">
              {upcomingPrices.map((price) => (
                <Card key={price.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <div className="font-semibold text-text-primary">{price.ruleName}</div>
                          <Badge variant="outline" className="text-xs">
                            Upcoming
                          </Badge>
                        </div>
                        <div className="text-lg font-bold text-text-primary">
                          {formatPrice(price.price)}
                        </div>
                        <div className="text-sm text-text-secondary">
                          {formatDate(price.startAt)} | {formatTime(price.startAt)} –{" "}
                          {formatTime(price.endAt)}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2 px-2 py-1 rounded-md border border-border bg-background">
                          <Label htmlFor={`toggle-upcoming-${price.id}`} className="text-xs text-text-secondary cursor-pointer">
                            {price.enabled ? "On" : "Off"}
                          </Label>
                          <Switch
                            id={`toggle-upcoming-${price.id}`}
                            checked={price.enabled}
                            onCheckedChange={() => handleToggleEnabled(price)}
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenModal(price)}
                          className="h-8 w-8"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDuplicate(price)}
                          className="h-8 w-8"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(price)}
                          className="h-8 w-8 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Expired Prices */}
        {expiredPrices.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-text-secondary">Expired Prices</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowExpired(!showExpired)}
              >
                {showExpired ? "Hide" : "Show"} ({expiredPrices.length})
              </Button>
            </div>
            {showExpired && (
              <div className="space-y-3">
                {expiredPrices.map((price) => (
                  <Card key={price.id} className="opacity-60">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="font-semibold text-text-secondary">{price.ruleName}</div>
                          <div className="text-lg font-bold text-text-secondary">
                            {formatPrice(price.price)}
                          </div>
                          <div className="text-sm text-text-light">
                            {formatDate(price.endAt)} | {formatTime(price.startAt)} –{" "}
                            {formatTime(price.endAt)}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDuplicate(price)}
                            className="h-8 w-8"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClick(price)}
                            className="h-8 w-8 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Disabled Prices */}
        {disabledPrices.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-text-secondary">Disabled Prices</h3>
            </div>
            <div className="space-y-3">
              {disabledPrices.map((price) => (
                <Card key={price.id} className="opacity-60 border-dashed">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <div className="font-semibold text-text-secondary">{price.ruleName}</div>
                          <Badge variant="outline" className="text-xs bg-destructive/10 text-destructive border-destructive/20">
                            Disabled
                          </Badge>
                        </div>
                        <div className="text-lg font-bold text-text-secondary">
                          {formatPrice(price.price)}
                        </div>
                        <div className="text-sm text-text-secondary">
                          {formatDate(price.startAt)} | {formatTime(price.startAt)} –{" "}
                          {formatTime(price.endAt)}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2 px-2 py-1 rounded-md border border-border bg-background">
                          <Label htmlFor={`toggle-disabled-${price.id}`} className="text-xs text-text-secondary cursor-pointer">
                            {price.enabled ? "On" : "Off"}
                          </Label>
                          <Switch
                            id={`toggle-disabled-${price.id}`}
                            checked={price.enabled}
                            onCheckedChange={() => handleToggleEnabled(price)}
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenModal(price)}
                          className="h-8 w-8"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDuplicate(price)}
                          className="h-8 w-8"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(price)}
                          className="h-8 w-8 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Temporary Price Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-text-primary">
              {editingPrice ? "Edit Temporary Price" : "Add Temporary Price"}
            </DialogTitle>
            <DialogDescription className="text-text-secondary">
              {editingPrice
                ? "Update the temporary price rule below."
                : "Create a new temporary price that will activate automatically based on the date and time you set."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="ruleName" className="text-text-secondary">
                  Rule Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="ruleName"
                  value={formData.ruleName}
                  onChange={(e) =>
                    setFormData({ ...formData, ruleName: e.target.value })
                  }
                  placeholder="e.g., Live Band Night"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price" className="text-text-secondary">
                  Temporary Price (₦) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="6500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-text-secondary">
                    Start Date <span className="text-destructive">*</span>
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal text-text-secondary"
                      >
                        {formData.startDate ? (
                          format(formData.startDate, "PPP")
                        ) : (
                          <span className="text-text-secondary">Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.startDate}
                        onSelect={(date) => setFormData({ ...formData, startDate: date })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="startTime" className="text-text-secondary">
                    Start Time (Optional)
                  </Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-text-secondary">
                    End Date <span className="text-destructive">*</span>
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal text-text-secondary"
                      >
                        {formData.endDate ? (
                          format(formData.endDate, "PPP")
                        ) : (
                          <span className="text-text-secondary">Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.endDate}
                        onSelect={(date) => setFormData({ ...formData, endDate: date })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endTime" className="text-text-secondary">
                    End Time (Optional)
                  </Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-background">
                <div className="space-y-0.5">
                  <Label htmlFor="enabled" className="text-text-primary cursor-pointer">
                    Enable this price rule
                  </Label>
                  <p className="text-sm text-text-secondary">
                    Disabled prices won't be applied even if within the date range
                  </p>
                </div>
                <Switch
                  id="enabled"
                  checked={formData.enabled}
                  onCheckedChange={(checked) => setFormData({ ...formData, enabled: checked })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseModal}
                className="text-text-secondary"
              >
                Cancel
              </Button>
              <Button type="submit">
                {editingPrice ? "Update Price" : "Create Price"}
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
        title="Delete Temporary Price"
        itemName={priceToDelete?.ruleName}
        isLoading={isDeleting}
      />
    </div>
  );
}
