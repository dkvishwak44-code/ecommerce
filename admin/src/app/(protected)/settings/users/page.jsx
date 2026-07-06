"use client";
import { withPermission } from "@/components/rbac";
import UserContainer from "@/components/settings/user/container.jsx/user-container";
import { PERMISSIONS } from "@/lib/permissions";
import React from "react";

const page = () => {
  return <UserContainer />;
};

export default withPermission(page, { permission: PERMISSIONS.USER_READ });
