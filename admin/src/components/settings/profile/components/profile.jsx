"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import AutoBreadcrumb from "@/components/layout/auto-breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import ChangePasswordCard from "./change-password-card";
import AccountOverview from "./account-overview";
import ProfileInfo from "./profile-info";

export default function ProfilePage() {
  return (
    <div className="space-y-2 ">
        <h1 className="font-semibold">My Profiles</h1>
     <AutoBreadcrumb/>
      {/* GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">

        {/* LEFT SIDE (2/3) */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Profile information</CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">

              {/* Profile Top */}
             <ProfileInfo/>

            </CardContent>
          </Card>
        </div>

        {/* RIGHT SIDE (1/3) */}
        <div className="space-y-2">

          {/* ACCOUNT OVERVIEW */}
          <AccountOverview/>
          {/* CHANGE PASSWORD */}
          <ChangePasswordCard/>

        </div>
      </div>
    </div>
  );
}