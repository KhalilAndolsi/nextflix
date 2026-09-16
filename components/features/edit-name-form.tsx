"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Check, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateUserName } from "@/lib/auth-actions";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
});
type Values = z.infer<typeof schema>;

export default function EditNameForm({ currentName }: { currentName: string }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { name: currentName },
  });

  const handleSubmit = async (values: Values) => {
    setLoading(true);
    const result = await updateUserName(values.name);
    setLoading(false);
    if ("error" in result) {
      toast.error("Could not update name");
      return;
    }
    toast.success("Name updated");
    setEditing(false);
    router.refresh();
  };

  if (!editing) {
    return (
      <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
        <Pencil />
        Edit
      </Button>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="flex items-end gap-3">
      <div className="flex-1">
        <Label htmlFor="edit-name" className="sr-only">Name</Label>
        <Input
          id="edit-name"
          {...form.register("name")}
          className="h-9"
        />
        {form.formState.errors.name && (
          <p className="mt-1 text-xs text-destructive">
            {form.formState.errors.name.message}
          </p>
        )}
      </div>
      <Button type="submit" size="sm" disabled={loading}>
        <Check />
        {loading ? "Saving..." : "Save"}
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => {
          setEditing(false);
          form.reset({ name: currentName });
        }}
      >
        Cancel
      </Button>
    </form>
  );
}
