import { getData, getEpisodes } from "@/data/tmdb";
import { Episode, TmdbTvDetails } from "@/types/tmdb";
import { NextResponse, NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: serieId } = await params;
  const serieDetails = (await getData("tv",  Number(serieId))) as TmdbTvDetails;
  if (!serieDetails) {
    return NextResponse.json(
      {
        status: 404,
        error: "Serie not found",
        message: "Serie not found",
        data: {},
      },
      { status: 404 }
    );
  }
  const searchParams = req.nextUrl.searchParams
  const seasonTarget = searchParams.get("s") || serieDetails.seasons[0].season_number;
  const seasonData: Episode[] = await getEpisodes(serieDetails.id, Number(seasonTarget));
  const filtredEpisodes = seasonData.filter(
    (e) => new Date(e.air_date).getTime() <= new Date().getTime()
  );
  return NextResponse.json(
    {
      status: 200,
      error: null,
      message: "fetched serie details",
      data: filtredEpisodes,
    },
    { status: 200 }
  );
}
