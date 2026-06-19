import type { ReactNode } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

type Props = {
  title?: string
  description?: string
  action?: ReactNode
  className?: string
}

export default function AccessRestricted({
  title = "Access restricted",
  description = "You do not have permission to view this page.",
  action,
  className,
}: Props) {
  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      {action ? <CardContent>{action}</CardContent> : null}
    </Card>
  )
}
