"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

const schema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[a-zA-Z]/, "Must contain a letter")
      .regex(/[0-9]/, "Must contain a number"),
  })
  .refine((d) => d.currentPassword !== d.newPassword, {
    message: "New password must be different",
    path: ["newPassword"],
  });
type Values = z.infer<typeof schema>;

export default function ChangePasswordForm() {
  const [loading, setLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { currentPassword: "", newPassword: "" },
  });

  const handleSubmit = async (values: Values) => {
    setLoading(true);
    const { error } = await authClient.changePassword({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
    });
    setLoading(false);
    if (error) {
      toast.error(error.message || "Could not change password");
      return;
    }
    toast.success("Password changed");
    form.reset();
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="cp-current">Current password</Label>
        <div className="relative mt-1.5">
          <Lock className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="cp-current"
            type={showCurrent ? "text" : "password"}
            placeholder="Enter current password"
            className="pr-9 pl-9"
            disabled={loading}
            {...form.register("currentPassword")}
          />
          <button
            type="button"
            tabIndex={-1}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
            onClick={() => setShowCurrent((v) => !v)}
          >
            {showCurrent ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
        {form.formState.errors.currentPassword && (
          <p className="mt-1 text-xs text-destructive">
            {form.formState.errors.currentPassword.message}
          </p>
        )}
      </div>
      <div>
        <Label htmlFor="cp-new">New password</Label>
        <div className="relative mt-1.5">
          <Lock className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="cp-new"
            type={showNew ? "text" : "password"}
            placeholder="Min. 8 chars, letters & numbers"
            className="pr-9 pl-9"
            disabled={loading}
            {...form.register("newPassword")}
          />
          <button
            type="button"
            tabIndex={-1}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
            onClick={() => setShowNew((v) => !v)}
          >
            {showNew ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
        {form.formState.errors.newPassword && (
          <p className="mt-1 text-xs text-destructive">
            {form.formState.errors.newPassword.message}
          </p>
        )}
      </div>
      <Button type="submit" size="sm" disabled={loading}>
        {loading ? "Changing..." : "Change password"}
      </Button>
    </form>
  );
}
