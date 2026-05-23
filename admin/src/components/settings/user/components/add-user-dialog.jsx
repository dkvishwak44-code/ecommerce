"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserPlus } from "lucide-react";
import Can from "@/components/rbac/Can";
import { PERMISSIONS } from "@/lib/permissions";

export default function AddUserDialog() {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      role: "",
    },
  });

  const onSubmit = (data) => {
    console.log("New User:", data);
    alert(`User ${data.name} created as ${data.role}!`);
    setOpen(false);
    reset();
  };

  return (
    <Can permission={PERMISSIONS.USER_CREATE}>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="blue" className="gap-2">
            <UserPlus className="w-4 h-4" /> Add User
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
            
            {/* NAME */}
            <div>
              <label className="text-sm font-medium mb-1 block">Full Name</label>
              <Input
                placeholder="John Doe"
                {...register("name", { required: true })}
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="text-sm font-medium mb-1 block">Email</label>
              <Input
                type="email"
                placeholder="user@example.com"
                {...register("email", { required: true })}
              />
            </div>

            {/* ROLE */}
            <div>
              <label className="text-sm font-medium mb-1 block">Role</label>
              <Select onValueChange={(value) => setValue("role", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="seller">Seller</SelectItem>
                  <SelectItem value="moderator">Moderator</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="blue" className="flex-1">
                Create User
              </Button>
            </div>

          </form>
        </DialogContent>
      </Dialog>
    </Can>
  );
}
