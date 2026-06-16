import { CheckCircle2, Clock, PackageCheck, Truck } from "lucide-react";
import type { LocalOrderStatus } from "../types";

interface OrderStatusBadgeProps {
  status: LocalOrderStatus;
}

const statusConfig: Record<
  LocalOrderStatus,
  { label: string; className: string; icon: typeof CheckCircle2 }
> = {
  processing: {
    label: "Processing",
    className: "bg-amber-50 text-amber-700 ring-amber-200",
    icon: Clock,
  },
  confirmed: {
    label: "Confirmed",
    className: "bg-indigo-50 text-indigo-700 ring-indigo-200",
    icon: CheckCircle2,
  },
  packed: {
    label: "Packed",
    className: "bg-sky-50 text-sky-700 ring-sky-200",
    icon: PackageCheck,
  },
  delivered: {
    label: "Delivered",
    className: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    icon: Truck,
  },
};

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${config.className}`}
    >
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </span>
  );
}
