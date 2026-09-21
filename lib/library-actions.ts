"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { MediaKind } from "@/generated/prisma/enums";

type ToggleResponse = { added: boolean } | { error: "UNAUTHENTICATED" };

export async function toggleLibrary(
  mediaId: number,
  mediaType: "movie" | "tv",
  kind: Exclude<MediaKind, "HISTORY">
): Promise<ToggleResponse> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: "UNAUTHENTICATED" };

  const existing = await prisma.userMedia.findUnique({
    where: {
      userId_mediaType_mediaId_kind: {
        userId: session.user.id,
        mediaType,
        mediaId,
        kind,
      },
    },
  });

  if (existing) {
    await prisma.userMedia.delete({ where: { id: existing.id } });
    return { added: false };
  }

  await prisma.userMedia.create({
    data: { userId: session.user.id, mediaType, mediaId, kind },
  });
  return { added: true };
}

export async function getLibraryStatus(
  mediaId: number,
  mediaType: "movie" | "tv"
): Promise<{ watchlist: boolean; favorite: boolean }> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { watchlist: false, favorite: false };

  const rows = await prisma.userMedia.findMany({
    where: {
      userId: session.user.id,
      mediaType,
      mediaId,
      kind: { in: [MediaKind.WATCHLIST, MediaKind.FAVORITE] },
    },
    select: { kind: true },
  });

  return {
    watchlist: rows.some((row) => row.kind === MediaKind.WATCHLIST),
    favorite: rows.some((row) => row.kind === MediaKind.FAVORITE),
  };
}

export async function recordHistory(
  mediaId: number,
  mediaType: "movie" | "tv",
  opts?: { season?: number; episode?: number }
): Promise<void> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return;

  const kind = MediaKind.HISTORY;
  const existing = await prisma.userMedia.findUnique({
    where: {
      userId_mediaType_mediaId_kind: {
        userId: session.user.id,
        mediaType,
        mediaId,
        kind,
      },
    },
  });

  if (existing) {
    await prisma.userMedia.update({
      where: { id: existing.id },
      data: { season: opts?.season, episode: opts?.episode },
    });
    return;
  }

  await prisma.userMedia.create({
    data: {
      userId: session.user.id,
      mediaType,
      mediaId,
      kind,
      season: opts?.season,
      episode: opts?.episode,
    },
  });
}

export async function removeFromLibrary(
  mediaId: number,
  mediaType: "movie" | "tv",
  kind: MediaKind
): Promise<void> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return;

  await prisma.userMedia.deleteMany({
    where: {
      userId: session.user.id,
      mediaType,
      mediaId,
      kind,
    },
  });
}

export async function clearLibrary(kind: MediaKind): Promise<void> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return;

  await prisma.userMedia.deleteMany({
    where: { userId: session.user.id, kind },
  });
}

export async function deleteAccount(): Promise<void> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return;

  await prisma.user.delete({ where: { id: session.user.id } });
}