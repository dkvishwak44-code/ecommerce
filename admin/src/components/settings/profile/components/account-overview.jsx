import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Calendar, Clock, CheckCircle } from "lucide-react";

export default function AccountOverview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Overview</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 text-sm">

        {/* Member Since */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar size={16} />
            <span className="text-xs">Member Since</span>
          </div>
          <span className="text-xs">Jan 2024</span>
        </div>

        {/* Last Login */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock size={16} />
            <span className="text-xs">Last Login</span>
          </div>
          <span className="text-xs">Today, 10:30 AM</span>
        </div>

        {/* Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-muted-foreground">
            <CheckCircle size={16} className="text-green-500" />
            <span className="text-xs">Status</span>
          </div>
          <Badge variant="outline" className="text-green-600 border-green-500">
            Active
          </Badge>
        </div>

      </CardContent>
    </Card>
  );
}