"use client";

import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const dataSets = {
  "7d": [
    { name: "Mon", revenue: 2000 },
    { name: "Tue", revenue: 3000 },
    { name: "Wed", revenue: 2500 },
    { name: "Thu", revenue: 4000 },
    { name: "Fri", revenue: 3500 },
    { name: "Sat", revenue: 5000 },
    { name: "Sun", revenue: 4500 },
  ],
  "30d": [
    { name: "W1", revenue: 10000 },
    { name: "W2", revenue: 15000 },
    { name: "W3", revenue: 12000 },
    { name: "W4", revenue: 18000 },
  ],
  "1y": [
    { name: "Jan", revenue: 4000 },
    { name: "Feb", revenue: 3000 },
    { name: "Mar", revenue: 5000 },
    { name: "Apr", revenue: 7000 },
    { name: "May", revenue: 6000 },
    { name: "Jun", revenue: 8000 },
  ],
};

export default function RevenueChart() {
  const [range, setRange] = useState("7d");

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Sales Overview</CardTitle>

        {/* Filter Buttons */}
        <div className="flex gap-2">
          {["7d", "30d", "1y"].map((r) => (
            <Button
              key={r}
              variant={range === r ? "blue" : "outline"}
              size="sm"
              onClick={() => setRange(r)}
            >
              {r}
            </Button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={dataSets[range]}>
            {/* Grid (Horizontal lines) */}
            <CartesianGrid strokeDasharray="3 3" vertical={false} />

            <XAxis
              dataKey="name"
              interval={0}
              tickMargin={8}
              tick={{ fontSize: 12 }}
            />

            <Tooltip />

            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#3b82f6" // blue line
              fill="#3b82f6"
              fillOpacity={0.15} // light fill
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
