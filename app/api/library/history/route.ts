import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getData } from "@/data/tmdb";
import { MediaKind } from "@/generated/prisma/enums";
import type { TmdbMovieDetails, TmdbTvDetails } from "@/types/tmdb";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ status: 200, error: null, data: [] });
  }

  const historyRows = await prisma.userMedia.findMany({
    where: { userId: session.user.id, kind: MediaKind.HISTORY },
    orderBy: { updatedAt: "desc" },
    take: 20,
  });

  const resolved = await Promise.all(
    historyRows.map(async (row) => {
      try {
        const data = (await getData(
          row.mediaType as "movie" | "tv",
          row.mediaId
        )) as TmdbMovieDetails | TmdbTvDetails;
        return {
          mediaId: row.mediaId,
          mediaType: row.mediaType as "movie" | "tv",
          posterPath: data.poster_path || null,
          title: data.title || data.name || `#${row.mediaId}`,
          voteAverage: data.vote_average || 0,
          season: row.season,
          episode: row.episode,
        };
      } catch {
        return null;
      }
    })
  );

  return NextResponse.json({
    status: 200,
    error: null,
    data: resolved.filter((item) => item !== null),
  });
}
