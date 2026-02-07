"use client";

import * as React from "react";
import { Image as ImageIcon, UploadCloud, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type ImageDropzoneProps = {
  id?: string;
  value: File | null;
  existingUrl?: string | null;
  onRemoveExisting?: () => void;
  onChange: (file: File | null) => void;
  accept?: string;
  maxSizeMb?: number;
  className?: string;
  disabled?: boolean;
};

export function ImageDropzone({
  id,
  value,
  existingUrl,
  onRemoveExisting,
  onChange,
  accept = "image/png,image/jpeg,image/jpg,image/webp",
  maxSizeMb = 10,
  className,
  disabled = false,
}: ImageDropzoneProps) {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [isDragActive, setIsDragActive] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!value) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(value);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [value]);

  const validate = (file: File) => {
    if (!file.type.startsWith("image/")) return "Please select an image file.";
    const maxBytes = maxSizeMb * 1024 * 1024;
    if (file.size > maxBytes) return `Image must be less than ${maxSizeMb}MB.`;
    return null;
  };

  const pick = (file: File | null | undefined) => {
    if (!file) return;
    const message = validate(file);
    if (message) {
      setError(message);
      onChange(null);
      return;
    }
    setError(null);
    onChange(file);
  };

  const openPicker = () => {
    if (disabled) return;
    inputRef.current?.click();
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (disabled) return;
    pick(e.dataTransfer.files?.[0]);
  };

  return (
    <div className={cn("space-y-2", className)}>
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={accept}
        className="hidden"
        disabled={disabled}
        onChange={(e) => pick(e.target.files?.[0])}
      />

      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        onClick={openPicker}
        onKeyDown={(e) => {
          if (disabled) return;
          if (e.key === "Enter" || e.key === " ") openPicker();
        }}
        onDragEnter={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (!disabled) setIsDragActive(true);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (!disabled) setIsDragActive(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragActive(false);
        }}
        onDrop={onDrop}
        className={cn(
          "relative w-full rounded-lg border bg-white transition-colors",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
          disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer",
          value || existingUrl ? "border-border" : "border-dashed border-border",
          isDragActive ? "border-primary bg-primary/5" : "hover:bg-background-alt/40"
        )}
      >
        {value && previewUrl ? (
          <div className="p-3">
            <div className="flex items-start gap-3">
              <div className="h-14 w-14 rounded-md overflow-hidden border border-border bg-background-alt shrink-0">
                <img src={previewUrl} alt="Selected image" className="h-full w-full object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-text-primary truncate">{value.name}</div>
                    <div className="text-xs text-text-secondary mt-0.5">
                      {(value.size / (1024 * 1024)).toFixed(2)}MB
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (!disabled) onChange(null);
                    }}
                    className="text-text-secondary hover:text-text-primary"
                    aria-label="Remove image"
                  >
                    <X />
                  </Button>
                </div>

                <div className="mt-2 text-xs text-text-secondary">
                  Drop a new image to replace, or <span className="text-primary font-medium">browse</span>
                </div>
              </div>
            </div>
          </div>
        ) : existingUrl ? (
          <div className="p-3">
            <div className="flex items-start gap-3">
              <div className="h-14 w-14 rounded-md overflow-hidden border border-border bg-background-alt shrink-0">
                <img src={existingUrl} alt="Current image" className="h-full w-full object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-text-primary truncate">Current image</div>
                    <div className="text-xs text-text-secondary mt-0.5">
                      Drop to replace, or <span className="text-primary font-medium">browse</span>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (disabled) return;
                      onRemoveExisting?.();
                    }}
                    className="text-text-secondary hover:text-text-primary"
                    aria-label="Remove image"
                  >
                    <X />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 sm:p-5">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-lg bg-background-alt border border-border flex items-center justify-center shrink-0">
                {isDragActive ? (
                  <UploadCloud className="h-5 w-5 text-primary" />
                ) : (
                  <ImageIcon className="h-5 w-5 text-text-secondary" />
                )}
              </div>
              <div className="min-w-0">
                <div className="text-sm font-medium text-text-primary">
                  Drop your image here, or <span className="text-primary">browse</span>
                </div>
                <div className="text-xs text-text-secondary mt-0.5">
                  JPG, PNG, WEBP up to {maxSizeMb}MB
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {error ? <div className="text-xs text-destructive">{error}</div> : null}
    </div>
  );
}

