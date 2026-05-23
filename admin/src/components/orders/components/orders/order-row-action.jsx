"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { MoreHorizontal, Eye, Edit, Trash, MoreVertical } from "lucide-react";

export function OrderRowActions({ row, router }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" >

        <DropdownMenuItem
          onClick={() => router.push(`/orders/${row.id}`)}
          className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <Eye className="mr-2 h-4 w-4" />
          View
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => router.push(`/orders/${row.id}/edit`)}
          className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>

        <DropdownMenuItem className="text-red-600 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
          <Trash className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>

      </DropdownMenuContent>
    </DropdownMenu>
  );
}