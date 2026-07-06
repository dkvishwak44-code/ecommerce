"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import RoleForm from "./role-form";
import { usePermissions } from "../hook/usePermission";
// import RoleForm from "@/components/RoleForm"; // ← points to the NEW RHF version 
export default function CreateRolePage() {

 const { data:permissions } = usePermissions({limit: 1000,});

//  console.log("permissions in create role page", permissions);
  const router = useRouter();
  const [loading, setLoading] = useState(false);




  // RoleForm.jsx — form ke andar, handleSubmit se pehle

const transformPayload = (data) => {
  // data.permissions = { product: ["product.create", "product.read"], order: [...] }
  // Backend ko chahiye: ["63f1a2...", "63f1a2..."] — ObjectId array

  // Step 1 — keys flatten karo
  const selectedKeys = Object.values(data.permissions)
    .flat()
    .filter(Boolean);
  // ["product.create", "product.read", "order.read"]

  // Step 2 — key se _id map karo (permissions prop se)
  const permissionIds = selectedKeys
    .map((key) => permissions.find((p) => p.key === key)?._id)
    .filter(Boolean);
  // ["63f1a2b3...", "63f1a2b4...", ...]

  return {
    name:        data.name,
    displayName: data.displayName ?? data.name,
    description: data.description ?? "",
    permissions: permissionIds,
  };
};

  const handleSubmit = async (data) => {
   const payload = transformPayload(data);
    setLoading(true);
    try {
      // await yourApiCall(payload)
    } finally {
      setLoading(false);
    }
  };

  return (
    <RoleForm
      onSubmit={handleSubmit}
      permissions={permissions || []}
      onCancel={() => router.back()}
      loading={loading}
    />
  );
}