"use server";

import { headers } from "next/headers";
import { prisma } from "./prisma";
import { auth } from "./auth";

export async function isEmailRegistered(email: string): Promise<boolean> {
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  return user !== null;
}

export async function updateUserName(
  name: string
): Promise<{ success: boolean } | { error: string }> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: "UNAUTHENTICATED" };

  await auth.api.updateUser({
    headers: await headers(),
    body: { name },
  });

  return { success: true };
}