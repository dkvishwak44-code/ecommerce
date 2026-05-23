"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SalesOverview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Overview</CardTitle>
      </CardHeader>

      <CardContent>
        <p className="text-muted-foreground text-sm">
          Monthly performance summary coming soon...
        </p>
      </CardContent>
    </Card>
  );
}