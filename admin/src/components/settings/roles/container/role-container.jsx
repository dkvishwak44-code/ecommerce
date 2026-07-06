"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import RoleTable from "../components/role-table";
import { useRouter } from "next/navigation";
import { useRoles } from "../hook/useRole";

// import RoleTable from "./components/role-table";
// import RoleDialog from "./components/role-dialog";

export default function RoleContainer() {
  const router = useRouter();
  const { data: { roles: roles } = {}, isLoading } = useRoles();
  console.log("roles :", roles);

  //  Create or Update Role
  // const handleSubmit = (data) => {
  //   if (selectedRole) {
  //     // Edit
  //     const updated = roles.map((role) =>
  //       role.id === selectedRole.id ? { ...role, ...data } : role
  //     );
  //     setRoles(updated);
  //   } else {
  //     // Create
  //     const newRole = {
  //       id: Date.now(),
  //       ...data,
  //     };
  //     setRoles((prev) => [...prev, newRole]);
  //   }

  //   setOpen(false);
  //   setSelectedRole(null);
  // };

  // //  Edit Click
  // const handleEdit = (role) => {
  //   setSelectedRole(role);
  //   setOpen(true);
  // };

  // //  Delete Role
  // const handleDelete = (id) => {
  //   const filtered = roles.filter((role) => role.id !== id);
  //   setRoles(filtered);
  // };

  //  Open Create Dialog
  const handleCreate = () => {
    router.push("/settings/roles/create");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Roles & Permissions</h1>

        <Button variant="blue" onClick={handleCreate}>
          Create Role
        </Button>
      </div>

      {/* Table */}
      <RoleTable
        roles={roles}
        isLoading={isLoading}
        // onEdit={handleEdit}
        // onDelete={handleDelete}
      />
    </div>
  );
}
