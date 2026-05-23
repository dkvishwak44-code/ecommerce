
import { ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import RoleActions from "./role-actions";
import TableActions from "@/components/shared/table-actions";


export const RolesColumns = [
  {
    id: "actions",
    header: "Actions",
  
    cell: ({ row }) => {
      return <TableActions role={row.original} onDelete={()=>{}}  />;
    },
  },
  {
    accessorKey: "name",
    header: "Role",

    cell: ({ row }) => {
      const role = row.original;

      return (
       
            <p className="font-medium">{role.name}</p>
    
      );
    },
  },

  {
    accessorKey: "description",
    header: "Description",

    cell: ({ row }) => (
      <p className=" flex flex-wrap text-sm text-muted-foreground">
        {row.original.description}
      </p>
    ),
  },

  {
    accessorKey: "users",
    header: "Users",

    cell: ({ row }) => (
      <div className="font-medium">
        {row.original.users}
      </div>
    ),
  },

  {
    accessorKey: "permissions",
    header: "Permissions",

    cell: ({ row }) => (
      <Badge variant="secondary">
        {row.original.permissions.length} Permissions
      </Badge>
    ),
  },

  {
    accessorKey: "status",
    header: "Status",

    cell: ({ row }) => {
      const status = row.original.status;

      return (
        <Badge
          variant={
            status === "active"
              ? "success"
              : "fail"
          }
        >
          {status}
        </Badge>
      );
    },
  },

  {
    accessorKey: "createdAt",
    header: "Created At",

    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original.createdAt}
      </span>
    ),
  },
];