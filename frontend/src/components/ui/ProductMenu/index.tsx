import { X } from "lucide-react";
import { type FormEvent, useEffect, useMemo, useState } from "react";
import { Button } from "../Button";
import { Input } from "../Input";
import { cn } from "../../../lib";
import {
  PRODUCT_TAG_OPTIONS,
  type Product,
  type ProductTag,
} from "../../../types";

export interface ProductMenuValues {
  title: string;
  description?: string;
  tags?: ProductTag[];
}

interface ProductMenuProps {
  open: boolean;
  product?: Product | null;
  isSubmitting?: boolean;
  onClose: () => void;
  onSubmit: (values: ProductMenuValues) => void | Promise<void>;
}

const tagLabel = (tag: ProductTag): string => tag.replace("_", " ");

export function ProductMenu({
  open,
  product,
  isSubmitting = false,
  onClose,
  onSubmit,
}: ProductMenuProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<ProductTag[]>([]);
  const [titleError, setTitleError] = useState("");

  const isEditing = Boolean(product);
  const titleId = useMemo(
    () => (isEditing ? "edit-product-title" : "create-product-title"),
    [isEditing],
  );

  useEffect(() => {
    if (!open) {
      return;
    }

    setTitle(product?.title ?? "");
    setDescription(product?.description ?? "");
    setTags(product?.tags ?? []);
    setTitleError("");
  }, [open, product]);

  if (!open) {
    return null;
  }

  const toggleTag = (tag: ProductTag) => {
    setTags((currentTags) =>
      currentTags.includes(tag)
        ? currentTags.filter((currentTag) => currentTag !== tag)
        : [...currentTags, tag],
    );
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setTitleError("Product title is required.");
      return;
    }

    await onSubmit({
      title: trimmedTitle,
      description: description.trim() || undefined,
      tags,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-zinc-950/45 px-4 py-4 sm:items-center"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSubmitting) {
          onClose();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="w-full max-w-2xl overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4">
          <h2 id={titleId} className="text-lg font-semibold text-zinc-950">
            {isEditing ? "Update product" : "Create product"}
          </h2>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close product menu"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form className="grid gap-5 p-5" onSubmit={handleSubmit}>
          <Input
            label="Title"
            name="title"
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
              setTitleError("");
            }}
            error={titleError}
            placeholder="Wireless headphones"
            disabled={isSubmitting}
          />

          <label className="block">
            <span className="text-sm font-medium text-zinc-700">
              Description
            </span>
            <textarea
              name="description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Short product description"
              disabled={isSubmitting}
              rows={5}
              className="mt-1 block w-full resize-none rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm leading-6 text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </label>

          <fieldset>
            <legend className="text-sm font-medium text-zinc-700">Tags</legend>
            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
              {PRODUCT_TAG_OPTIONS.map((tag) => {
                const selected = tags.includes(tag);

                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    disabled={isSubmitting}
                    className={cn(
                      "h-10 rounded-md border px-3 text-sm font-medium capitalize transition disabled:cursor-not-allowed disabled:opacity-60",
                      selected
                        ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                        : "border-zinc-200 bg-white text-zinc-600 hover:border-indigo-200 hover:text-indigo-700",
                    )}
                    aria-pressed={selected}
                  >
                    {tagLabel(tag)}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div className="flex flex-col-reverse gap-2 border-t border-zinc-200 pt-5 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? isEditing
                  ? "Updating..."
                  : "Creating..."
                : isEditing
                  ? "Update product"
                  : "Create product"}
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}
