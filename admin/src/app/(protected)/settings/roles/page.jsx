"use client";
import RoleContainer from '@/components/settings/roles/container/role-container'
import React from 'react'
import withPermission from '@/components/rbac/withPermission';

const page = () => {
  return (
   <RoleContainer/>
  )
}

export default withPermission(page, { permission: 'role.view' });