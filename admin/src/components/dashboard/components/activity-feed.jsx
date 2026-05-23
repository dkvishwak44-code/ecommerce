"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const activity = [
  "New order placed",
  "User registered",
  "Product updated",
];

export default function ActivityFeed() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity</CardTitle>
      </CardHeader>

      <CardContent className="space-y-2 text-sm">
        {activity.map((item, i) => (
          <p key={i}>• {item}</p>
        ))}
      </CardContent>
    </Card>
  );
}