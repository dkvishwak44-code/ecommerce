
import {
  Pencil,
  Trash2,
  Eye,
  MoreVertical,
} from "lucide-react";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function TableActions({
  row,

  // HANDLERS
  onView,
  onEdit,
  onDelete,

  // REDIRECT PATHS
  viewHref,
  editHref,

  // SHOW / HIDE
  showView = true,
  showEdit = true,
  showDelete = true,

  // CUSTOM ACTIONS
  customActions = [],
}) {
  const router = useRouter();

  // VIEW
  const handleView = () => {
    if (viewHref) {
      router.push(`${viewHref}/${row.id}`);
    }

    if (onView) {
      onView(row);
    }
  };

  // EDIT
  const handleEdit = () => {
    if (editHref) {
      router.push(`${editHref}/${row.id}/edit`);
    }

    if (onEdit) {
      onEdit(row);
    }
  };

  return (
    <DropdownMenu>

      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreVertical className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">

        {/* VIEW */}
        {showView && (
          <DropdownMenuItem onClick={handleView}  className="hover:bg-gray-100 dark:hover:bg-gray-700">
            <Eye className="w-4 h-4 mr-2" />
            View
          </DropdownMenuItem>
        )}

        {/* EDIT */}
        {showEdit && (
          <DropdownMenuItem onClick={handleEdit} className="hover:bg-gray-100 dark:hover:bg-gray-700">
            <Pencil className="w-4 h-4 mr-2" />
            Edit
          </DropdownMenuItem>
        )}

        {/* DELETE */}
        {showDelete && onDelete && (
          <DropdownMenuItem
            onClick={() => onDelete(row)}
            className="hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600 focus:text-red-600"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </DropdownMenuItem>
        )}

        {/* CUSTOM ACTIONS */}
        {customActions.map((action, index) => {
          const Icon = action.icon;

          const handleCustomAction = () => {
            // REDIRECT
            if (action.href) {
              router.push(`${action.href}/${row.id}`);
            }

            // CALLBACK
            if (action.onClick) {
              action.onClick(row);
            }
          };

          return (
            <DropdownMenuItem
              key={index}
              onClick={handleCustomAction}
              className={action.className}
            >
              {Icon && (
                <Icon className="w-4 h-4 mr-2" />
              )}

              {action.label}
            </DropdownMenuItem>
          );
        })}

      </DropdownMenuContent>
    </DropdownMenu>
  );
}