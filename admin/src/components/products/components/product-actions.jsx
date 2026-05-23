import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@base-ui/react";

import { MoreHorizontal, Edit, Trash, MoreVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import Can from "@/components/rbac/Can";
import { PERMISSIONS } from "@/lib/permissions";

export default function ProductActions({ product }) {
   const router = useRouter();

  const handleEdit = () => {
    // Navigate to edit page or open modal
   router.push(`/products/${product.id}/edit`);
  }

  const handleView = () => {
    // Navigate to view page
    router.push(`/products/${product.id}`);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-2 rounded hover:bg-muted">
          {/* <MoreHorizontal className="w-4 h-4" /> */}
          <MoreVertical className="w-4 h-4" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <Can permission={PERMISSIONS.PRODUCT_VIEW}>
          <DropdownMenuItem className="hover:bg-gray-100 cursor-pointer dark:hover:bg-gray-600">
            <Edit className="w-4 h-4 mr-2 " />
          < Button onClick={handleView} className="cursor-pointer ">View</Button>
          </DropdownMenuItem>
        </Can>

        <Can permission={PERMISSIONS.PRODUCT_EDIT}>
          <DropdownMenuItem className="hover:bg-gray-100 cursor-pointer dark:hover:bg-gray-600">
            <Edit className="w-4 h-4 mr-2 " />
          < Button onClick={handleEdit} className="cursor-pointer ">Edit</Button>
          </DropdownMenuItem>
        </Can>

        <Can permission={PERMISSIONS.PRODUCT_DELETE}>
          <DropdownMenuItem className="text-red-600 hover:bg-gray-100 cursor-pointer dark:hover:bg-gray-600">
            <Trash className="w-4 h-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </Can>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}