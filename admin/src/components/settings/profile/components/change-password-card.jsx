import { useState } from "react";
import { useDispatch } from "react-redux";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Eye, EyeOff } from "lucide-react";
import { changePasswordUser, logoutUser } from "@/store/slices/authSlice";

const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, "Current password is required"),

    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[a-z]/, "Must contain at least one lowercase letter")
      .regex(/[0-9]/, "Must contain at least one number"),

    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export default function ChangePasswordCard() {
  const dispatch = useDispatch();

  const [show, setShow] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      await dispatch(changePasswordUser(data)).unwrap();
      await dispatch(logoutUser());

      reset();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          {/* Current Password */}
          <div className="space-y-1">
            <Label htmlFor="currentPassword" className="text-xs">
              Current Password
            </Label>

            <div className="relative">
              <Input
                id="currentPassword"
                type={show.current ? "text" : "password"}
                placeholder="Current Password"
                {...register("currentPassword")}
              />

              <button
                type="button"
                onClick={() =>
                  setShow((prev) => ({
                    ...prev,
                    current: !prev.current,
                  }))
                }
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {show.current ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {errors.currentPassword && (
              <p className="text-xs text-red-500">
                {errors.currentPassword.message}
              </p>
            )}
          </div>

          {/* New Password */}
          <div className="space-y-1">
            <Label htmlFor="newPassword" className="text-xs">
              New Password
            </Label>

            <div className="relative">
              <Input
                id="newPassword"
                type={show.new ? "text" : "password"}
                placeholder="New Password"
                {...register("newPassword")}
              />

              <button
                type="button"
                onClick={() =>
                  setShow((prev) => ({
                    ...prev,
                    new: !prev.new,
                  }))
                }
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {show.new ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {errors.newPassword && (
              <p className="text-xs text-red-500">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1">
            <Label htmlFor="confirmPassword" className="text-xs">
              Confirm New Password
            </Label>

            <div className="relative">
              <Input
                id="confirmPassword"
                type={show.confirm ? "text" : "password"}
                placeholder="Confirm New Password"
                {...register("confirmPassword")}
              />

              <button
                type="button"
                onClick={() =>
                  setShow((prev) => ({
                    ...prev,
                    confirm: !prev.confirm,
                  }))
                }
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {show.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {errors.confirmPassword && (
              <p className="text-xs text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            variant="outline"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Updating..." : "Update Password"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}