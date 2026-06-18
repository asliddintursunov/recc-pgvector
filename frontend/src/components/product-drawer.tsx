import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"
import { PRODUCT_TAG_OPTIONS, type ProductTag } from "@/types/tags.type"
import type { CreateProductBody, Product, UpdateProductBody } from "@/types"
import { formatTag } from "@/lib"
import { type FormEvent, useState } from "react"

type ProductDrawerValues = CreateProductBody | UpdateProductBody

type ProductDrawerProps = {
  open: boolean
  product?: Product | null
  isSubmitting?: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (values: ProductDrawerValues) => Promise<void> | void
}

export function ProductDrawer({
  open,
  product,
  isSubmitting = false,
  onOpenChange,
  onSubmit,
}: ProductDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {open ? (
        <ProductDrawerForm
          key={product?.id ?? "new-product"}
          product={product}
          isSubmitting={isSubmitting}
          onSubmit={onSubmit}
        />
      ) : null}
    </Sheet>
  )
}

function ProductDrawerForm({
  product,
  isSubmitting,
  onSubmit,
}: Pick<ProductDrawerProps, "product" | "isSubmitting" | "onSubmit">) {
  const [title, setTitle] = useState(product?.title ?? "")
  const [description, setDescription] = useState(product?.description ?? "")
  const [price, setPrice] = useState(product ? String(product.price) : "")
  const [imageUrl, setImageUrl] = useState(product?.imageUrl ?? "")
  const [tags, setTags] = useState<ProductTag[]>(product?.tags ?? [])
  const isEditing = Boolean(product)

  const toggleTag = (tag: ProductTag) => {
    setTags((currentTags) =>
      currentTags.includes(tag)
        ? currentTags.filter((currentTag) => currentTag !== tag)
        : [...currentTags, tag]
    )
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    await onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      price: price ? Number(price) : undefined,
      imageUrl: imageUrl.trim() || undefined,
      tags,
    })
  }

  return (
    <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-md">
        <form className="flex min-h-full flex-col" onSubmit={handleSubmit}>
          <SheetHeader>
            <SheetTitle>{isEditing ? "Update product" : "Create product"}</SheetTitle>
            <SheetDescription>
              {isEditing
                ? "Edit the product information and save changes."
                : "Add a new product to your merchant catalog."}
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 px-6">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="product-title">Title</FieldLabel>
                <Input
                  id="product-title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="product-description">Description</FieldLabel>
                <Textarea
                  id="product-description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  disabled={isSubmitting}
                  rows={4}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="product-price">Price</FieldLabel>
                <Input
                  id="product-price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                  disabled={isSubmitting}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="product-image-url">Image URL</FieldLabel>
                <Input
                  id="product-image-url"
                  type="url"
                  value={imageUrl}
                  onChange={(event) => setImageUrl(event.target.value)}
                  disabled={isSubmitting}
                />
              </Field>
              <Field>
                <FieldLabel>Tags</FieldLabel>
                <div className="flex flex-wrap gap-2">
                  {PRODUCT_TAG_OPTIONS.map((tag) => (
                    <Button
                      key={tag}
                      type="button"
                      size="sm"
                      variant={tags.includes(tag) ? "default" : "outline"}
                      onClick={() => toggleTag(tag)}
                      disabled={isSubmitting}
                      className="capitalize"
                    >
                      {formatTag(tag)}
                    </Button>
                  ))}
                </div>
              </Field>
            </FieldGroup>
          </div>

          <SheetFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : isEditing ? "Save changes" : "Create product"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
  )
}
