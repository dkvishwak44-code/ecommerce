"use client";
import React from "react";
import withPermission from "@/components/rbac/withPermission";
import AddUserDialog from "@/components/settings/user/components/add-user-dialog";

const CustomersPage = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-xl font-semibold">Users & Customers</h1>
          <p className="text-sm text-muted-foreground">
            Manage users and assign roles
          </p>
        </div>
        <div className="flex justify-end">
          <AddUserDialog />
        </div>
      </div>

      {/* Placeholder for the table */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-64 flex items-center justify-center text-gray-400">
        User table will be displayed here...
      </div>
    </div>
  );
};

export default withPermission(CustomersPage, { permission: "user.view" });
