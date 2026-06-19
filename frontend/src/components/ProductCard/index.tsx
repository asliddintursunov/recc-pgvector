import { Link } from "react-router-dom"
import { Button } from "../ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card"
import type { Product } from "@/types/product.type"
import type { UserRole } from "@/types/auth.type"
import ProductImage from "../ProductImage"
import { ROUTES } from "@/constants/routes.constant"
import { formatCurrency, formatDate, formatTag } from "@/lib/format"
import CartActions from "../CartActions"

type Props = {
  product: Product
  role?: UserRole
  onEdit: (product: Product) => void
}

export default function ProductCard({
  product,
  role,
  onEdit,
}: Props) {
  const isCustomer = role === "customer"
  const isMerchant = role === "merchant"

  return (
    <Card className="h-full">
      <CardHeader>
        <ProductImage product={product} />
        <div className="space-y-1">
          <CardTitle>{product.title}</CardTitle>
          <CardDescription>
            Added {formatDate(product.createdAt)}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="min-h-12 text-sm leading-6 text-muted-foreground">
          {product.description || "No description provided."}
        </p>
        <div className="flex flex-wrap gap-2">
          {product.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-muted px-3 py-1 text-xs font-medium capitalize"
            >
              {formatTag(tag)}
            </span>
          ))}
          {product.tags.length === 0 ? (
            <span className="text-xs text-muted-foreground">No tags</span>
          ) : null}
        </div>
        <div className="text-lg font-semibold">
          {formatCurrency(product.price)}
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2">
        <Button asChild size="sm" variant="outline">
          <Link to={ROUTES.PRODUCTS.DETAIL.replace(":id", product.id)}>
            Details
          </Link>
        </Button>
        {isCustomer ? (
          <CartActions product={product} size="sm" />
        ) : null}
        {isMerchant ? (
          <Button size="sm" onClick={() => onEdit(product)}>
            Edit
          </Button>
        ) : null}
      </CardFooter>
    </Card>
  )
}
