"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {
  Clock,
  Inbox,
  Truck,
  MapPin,
  CheckCircle2,
  XCircle,
} from "lucide-react";

const stats = [
  {
    label: "Pending",
    value: 12,
    icon: Clock,
    color: "text-yellow-500",
    bg: "bg-yellow-50",
  },
  {
    label: "Received",
    value: 8,
    icon: Inbox,
    color: "text-blue-500",
    bg: "bg-blue-50",
  },
  {
    label: "Shipped",
    value: 15,
    icon: Truck,
    color: "text-indigo-500",
    bg: "bg-indigo-50",
  },
  {
    label: "Out for Delivery",
    value: 6,
    icon: MapPin,
    color: "text-orange-500",
    bg: "bg-orange-50",
  },
  {
    label: "Delivered",
    value: 42,
    icon: CheckCircle2,
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    label: "Cancelled",
    value: 3,
    icon: XCircle,
    color: "text-red-500",
    bg: "bg-red-50",
  },
];

export default function OrderStats() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">

      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <Card
            key={item.label}
            className={`hover:shadow-md transition cursor-pointer ${item.bg}`}
          >
            <CardContent className={` flex items-center justify-between `}>

              {/* ICON */}
              <div className={` rounded-md ${item.bg}`}>
                <Icon className={`h-7 w-7 ${item.color}`} />
              </div>

              {/* TEXT */}
              <div className="flex flex-col justify-center items-center">
                <p className="text-xs text-black">
                  {item.label}
                </p>
                <p className="text-lg font-semibold text-black">
                  {item.value}
                </p>
              </div>

            </CardContent>
          </Card>
        );
      })}

    </div>
  );
}