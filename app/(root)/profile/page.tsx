import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { Mail, PlayCircle, Star, User, ShieldCheck } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getData } from "@/data/tmdb";
import { BLUR_POSTER } from "@/lib/blur";
import { MediaKind } from "@/generated/prisma/enums";
import type { TmdbMovieDetails, TmdbTvDetails } from "@/types/tmdb";
import DeleteAccountButton from "@/components/features/delete-account-button";
import LibraryRemoveButton from "@/components/features/library-remove-button";
import EditNameForm from "@/components/features/edit-name-form";
import ChangePasswordForm from "@/components/features/change-password-form";
import ClearLibraryButton from "@/components/features/clear-library-button";

export const metadata: Metadata = {
  title: "Profile",
  description: "Manage your Nextflix account and preferences.",
  robots: {
    index: false,
    follow: false,
  },
};

type ProfileMedia = {
  id: string;
  mediaId: number;
  mediaType: "movie" | "tv";
  kind: MediaKind;
  season: number | null;
  episode: number | null;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  posterPath: string | null;
  voteAverage: number;
  releaseYear: number | null;
};

function LibraryCard({ item }: { item: ProfileMedia }) {
  const href =
    item.mediaType === "movie"
      ? `/movies/${item.mediaId}`
      : item.kind === MediaKind.HISTORY && item.season != null && item.episode != null
        ? `/series/${item.mediaId}?s=${item.season}&ep=${item.episode}`
        : `/series/${item.mediaId}`;
  return (
    <div className="relative group">
      <Link
        href={href}
        className="block aspect-[2/3] relative overflow-hidden rounded-xl bg-muted"
      >
        {item.posterPath ? (
          <Image
            src={`https://image.tmdb.org/t/p/w500${item.posterPath}`}
            alt={item.title}
            fill
            placeholder="blur"
            blurDataURL={BLUR_POSTER}
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
            className="object-cover"
            quality={85}
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center">
            <PlayCircle className="size-12 stroke-primary" />
          </div>
        )}
        {item.mediaType === "tv" && item.season != null && (
          <Badge className="absolute top-2 right-2">
            S{item.season}
            {item.episode != null ? ` · E${item.episode}` : ""}
          </Badge>
        )}
        <PlayCircle
          size={45}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 stroke-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        />
      </Link>
      <div className="absolute top-2 left-2">
        <LibraryRemoveButton
          mediaId={item.mediaId}
          mediaType={item.mediaType}
          kind={item.kind}
        />
      </div>
      <div className="p-2">
        <p className="truncate font-bold">{item.title}</p>
        <p className="text-sm">
          <Star
            size={16}
            className="fill-amber-300 stroke-amber-300 inline-block -translate-y-0.5 mr-1.5"
          />
          {item.voteAverage ? item.voteAverage.toFixed(1) : "—"}
          <span className="capitalize text-muted-foreground text-xs">
            {" "}
            | {item.mediaType === "movie" ? "Movie" : "Serie"}
            {item.releaseYear ? ` · ${item.releaseYear}` : ""}
          </span>
        </p>
      </div>
    </div>
  );
}

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="grid place-items-center bg-muted rounded-xl h-44 text-center px-6">
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

function StatCard({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-lg bg-muted/50 px-4 py-3 text-center">
      <p className="text-2xl font-bold tabular-nums">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

export default async function ProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const { user } = session;

  const hasPassword =
    (await prisma.account.findFirst({
      where: { userId: user.id, providerId: "credential" },
    })) !== null;

  const items = await prisma.userMedia.findMany({
    where: { userId: user.id },
  });

  const watchlist = items.filter((item) => item.kind === MediaKind.WATCHLIST);
  const favorites = items.filter((item) => item.kind === MediaKind.FAVORITE);
  const history = items
    .filter((item) => item.kind === MediaKind.HISTORY)
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

  const resolveMedia = async (
    item: (typeof items)[number]
  ): Promise<ProfileMedia> => {
    const base = {
      id: item.id,
      mediaId: item.mediaId,
      mediaType: item.mediaType as "movie" | "tv",
      kind: item.kind,
      season: item.season,
      episode: item.episode,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };
    try {
      const data = (await getData(
        item.mediaType as "movie" | "tv",
        item.mediaId
      )) as TmdbMovieDetails | TmdbTvDetails;
      const airDate =
        item.mediaType === "tv" ? (data as TmdbTvDetails).first_air_date : "";
      return {
        ...base,
        title: data.title || data.name || `#${item.mediaId}`,
        posterPath: data.poster_path || null,
        voteAverage: data.vote_average || 0,
        releaseYear:
          new Date(data.release_date || airDate || "").getFullYear() || null,
      };
    } catch {
      return {
        ...base,
        title: `#${item.mediaId}`,
        posterPath: null,
        voteAverage: 0,
        releaseYear: null,
      };
    }
  };

  const resolveAll = (list: (typeof items)[number][]) =>
    Promise.all(list.map((item) => resolveMedia(item)));

  const [watchlistInfo, favoritesInfo, historyInfo] = await Promise.all([
    resolveAll(watchlist),
    resolveAll(favorites),
    resolveAll(history),
  ]);

  const renderGrid = (list: ProfileMedia[]) =>
    list.length > 0 ? (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {list.map((item) => (
          <LibraryCard key={item.id} item={item} />
        ))}
      </div>
    ) : null;

  return (
    <div className="flex min-h-dvh flex-col items-center px-4 pt-28 pb-16">
      <div className="w-full max-w-5xl">
        <Card className="mb-8 overflow-hidden">
          <CardContent className="p-6 sm:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex min-w-0 items-center gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-secondary ring-2 ring-border">
                    {user.image ? (
                      <Image
                        src={user.image}
                        alt={user.name}
                        width={64}
                        height={64}
                        placeholder="blur"
                        blurDataURL={BLUR_POSTER}
                        className="size-full object-cover"
                        draggable={false}
                      />
                    ) : (
                      <User className="size-8 text-secondary-foreground" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h1 className="truncate text-xl font-semibold text-foreground">
                        {user.name}
                      </h1>
                      {user.emailVerified && (
                        <Badge variant="secondary">
                          <ShieldCheck />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <p className="flex items-center gap-1.5 truncate text-sm text-muted-foreground">
                      <Mail className="size-4 shrink-0" />
                      <span className="truncate">{user.email}</span>
                    </p>
                  </div>
                </div>
                <div className="shrink-0 sm:ml-auto sm:text-right">
                  <p className="text-xs text-muted-foreground">Member since</p>
                  <p className="text-sm font-medium">
                    {new Date(user.createdAt).toLocaleDateString(undefined, {
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                <StatCard value={watchlistInfo.length} label="Watchlist" />
                <StatCard value={favoritesInfo.length} label="Favorites" />
                <StatCard value={historyInfo.length} label="Watched" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="watchlist">
          <TabsList className="mb-8 w-full">
            <TabsTrigger value="watchlist">
              Watchlist ({watchlistInfo.length})
            </TabsTrigger>
            <TabsTrigger value="favorites">
              Favorites ({favoritesInfo.length})
            </TabsTrigger>
            <TabsTrigger value="history">
              History ({historyInfo.length})
            </TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="watchlist">
            {renderGrid(watchlistInfo) ?? (
              <EmptyState
                title="Your watchlist is empty"
                description="Browse movies and series and tap “Add to Watchlist” to save them here."
              />
            )}
          </TabsContent>

          <TabsContent value="favorites">
            {renderGrid(favoritesInfo) ?? (
              <EmptyState
                title="No favorites yet"
                description="Tap “Add to Favorites” on any movie or series you love."
              />
            )}
          </TabsContent>

          <TabsContent value="history">
            {renderGrid(historyInfo) ?? (
              <EmptyState
                title="Nothing watched yet"
                description="Everything you watch will show up here so you can pick up where you left off."
              />
            )}
          </TabsContent>

          <TabsContent value="settings">
            <div className="flex flex-col gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account</CardTitle>
                  <CardDescription>
                    Update your display name shown across the site.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <EditNameForm currentName={user.name} />
                </CardContent>
              </Card>

              {hasPassword && (
                <Card>
                  <CardHeader>
                    <CardTitle>Security</CardTitle>
                    <CardDescription>
                      Change the password used to sign in with your email.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChangePasswordForm />
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Library data</CardTitle>
                  <CardDescription>
                    Clear your watchlist, favorites, or watch history.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-3">
                  {watchlistInfo.length > 0 && (
                    <ClearLibraryButton
                      kind={MediaKind.WATCHLIST}
                      label="Watchlist"
                    />
                  )}
                  {favoritesInfo.length > 0 && (
                    <ClearLibraryButton
                      kind={MediaKind.FAVORITE}
                      label="Favorites"
                    />
                  )}
                  {historyInfo.length > 0 && (
                    <ClearLibraryButton
                      kind={MediaKind.HISTORY}
                      label="History"
                    />
                  )}
                  {watchlistInfo.length === 0 &&
                    favoritesInfo.length === 0 &&
                    historyInfo.length === 0 && (
                      <p className="text-sm text-muted-foreground">
                        You have no saved data to clear.
                      </p>
                    )}
                </CardContent>
              </Card>

              <Card className="border-destructive/30">
                <CardHeader>
                  <CardTitle className="text-destructive">Danger Zone</CardTitle>
                  <CardDescription>
                    Permanently delete your account, library and all associated
                    data. This cannot be undone.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DeleteAccountButton />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}