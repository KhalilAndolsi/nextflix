"use server";
import { revalidatePath } from "next/cache";

export async function revalidateMyPath(path: string) {
  revalidatePath(path);
}
