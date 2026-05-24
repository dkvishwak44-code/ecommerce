"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import RoleForm from "./role-form";
// import RoleForm from "@/components/RoleForm"; // ← points to the NEW RHF version 
export default function CreateRolePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data) => {
    console.log(" Role submitted:", data);
    setLoading(true);
    try {
      // await yourApiCall(data)
    } finally {
      setLoading(false);
    }
  };

  return (
    <RoleForm
      onSubmit={handleSubmit}
      onCancel={() => router.back()}
      loading={loading}
    />
  );
}