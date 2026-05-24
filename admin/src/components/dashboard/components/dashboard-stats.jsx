"use client";

import { Card, CardContent } from "@/components/ui/card";
import { IndianRupee, ShoppingCart, Users, Package } from "lucide-react";

export default function StatsCards() {


const stats = [
  { title: "Revenue", value: "₹12,500", change: "12%", trend: "up", icon: IndianRupee },
  { title: "Orders", value: "320", change: "5%", trend: "down", icon: ShoppingCart },
  { title: "Customers", value: "1,200", change: "8%", trend: "up", icon: Users },
  { title: "Products", value: "85", change: "2%", trend: "down", icon: Package },
];

  return (
    <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
      {stats.map((item, i) => {
        const Icon = item.icon;

        return (
          <Card key={i}>
            <CardContent className="flex flex-col gap-2 px-4">
              
              {/* Top Row */}
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  {item.title}
                </p>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </div>

              {/* Value */}
              <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold">{item.value}</h2>

              {/* Change */}
              <p
                className={`text-xs font-medium ${
                  item.trend === "up"
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              >
                {item.trend === "up" ? "↑" : "↓"}{" "}
                {item.change}{" "}
              </p>
              </div>

            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}