
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Eye, EyeOff } from "lucide-react";

export default function ChangePasswordCard() {
  const [show, setShow] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">

        {/* Current Password */}
        <div className="space-y-1">
          <Label htmlFor="current-password" className="text-xs">
            Current Password
          </Label>

          <div className="relative">
            <Input
              id="current-password"
              type={show.current ? "text" : "password"}
              placeholder="Current Password"
            />

            <button
              type="button"
              onClick={() =>
                setShow((prev) => ({ ...prev, current: !prev.current }))
              }
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              {show.current ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div className="space-y-1">
          <Label htmlFor="new-password" className="text-xs">
            New Password
          </Label>

          <div className="relative">
            <Input
              id="new-password"
              type={show.new ? "text" : "password"}
              placeholder="New Password"
            />

            <button
              type="button"
              onClick={() =>
                setShow((prev) => ({ ...prev, new: !prev.new }))
              }
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              {show.new ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="space-y-1">
          <Label htmlFor="confirm-new-password" className="text-xs">
            Confirm New Password
          </Label>

          <div className="relative">
            <Input
              id="confirm-new-password"
              type={show.confirm ? "text" : "password"}
              placeholder="Confirm New Password"
            />

            <button
              type="button"
              onClick={() =>
                setShow((prev) => ({ ...prev, confirm: !prev.confirm }))
              }
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              {show.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Button */}
        <Button className="w-full" variant="outline">
          Update Password
        </Button>

      </CardContent>
    </Card>
  );
}