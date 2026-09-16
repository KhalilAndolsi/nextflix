"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Star, X } from "lucide-react";
import { SearchResultsSkeleton } from "@/components/blocks/skeletons";
import { BLUR_POSTER } from "@/lib/blur";
import { parseAsString, useQueryState } from "nuqs";
import { useScrollLock } from "usehooks-ts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TmdbResult } from "@/types/tmdb";

type SearchOverlayProps = {
  open: boolean;
  onClose: () => void;
};

export default function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useQueryState("q", parseAsString.withDefault(""));
  const [filter, setFilter] = useQueryState(
    "type",
    parseAsString.withDefault("all")
  );
  const [results, setResults] = useState<TmdbResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const shownResults =
    filter === "all" ? results : results.filter((r) => r.media_type === filter);
  const movies = shownResults.filter((r) => r.media_type === "movie");
  const series = shownResults.filter((r) => r.media_type === "tv");

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  useScrollLock({ autoLock: open });

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      if (panelRef.current?.contains(target)) return;
      if (target.closest('[data-slot="select-content"]')) return;
      handleClose();
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open, handleClose]);

  useEffect(() => {
    if (!open) return;
    const term = query.trim();
    if (!term) {
      setResults([]);
      setSearched(false);
      setLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(term)}`);
        const payload = await res.json();
        setResults(payload.data ?? []);
        setSearched(true);
      } catch {
        setResults([]);
        setSearched(true);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query, open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, handleClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      <div
        onClick={handleClose}
        aria-hidden
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-label="Search"
        className="absolute left-1/2 top-6 w-[min(720px,92vw)] -translate-x-1/2">
        <div className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
          <div className="flex items-center gap-3 px-4 border-b border-border">
            <Search className="size-5 text-muted-foreground shrink-0" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search movies and series..."
              type="text"
              className="w-full bg-transparent py-4 outline-none placeholder:text-muted-foreground"
            />
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger aria-label="Filter results" className="w-fit shrink-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="z-[110]">
                <SelectItem value="all">All Results</SelectItem>
                <SelectItem value="movie">Movies</SelectItem>
                <SelectItem value="tv">Series</SelectItem>
              </SelectContent>
            </Select>
            <button
              type="button"
              onClick={handleClose}
              aria-label="Close search"
              className="text-muted-foreground hover:text-foreground transition-colors">
              <X className="size-5" />
            </button>
          </div>
          <div className="max-h-[70vh] overflow-y-auto">
            {loading ? (
              <SearchResultsSkeleton />
            ) : !query.trim() ? (
              <p className="text-center text-muted-foreground py-10">
                Type to search movies and series
              </p>
            ) : searched && shownResults.length === 0 ? (
              <p className="text-center text-muted-foreground py-10">
                No results for “{query}”
              </p>
            ) : (
              <>
                {movies.length > 0 && (
                  <div className="border-b border-border/50">
                    <p className="px-4 pt-3 pb-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Movies
                    </p>
                    {movies.map((result) => (
                      <SearchResultRow
                        key={result.id}
                        result={result}
                        onNavigate={handleClose}
                      />
                    ))}
                  </div>
                )}
                {series.length > 0 && (
                  <div className="border-b border-border/50">
                    <p className="px-4 pt-3 pb-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Series
                    </p>
                    {series.map((result) => (
                      <SearchResultRow
                        key={result.id}
                        result={result}
                        onNavigate={handleClose}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SearchResultRow({
  result,
  onNavigate,
}: {
  result: TmdbResult;
  onNavigate: () => void;
}) {
  const extended = result as TmdbResult & { first_air_date?: string };
  const date = extended.release_date || extended.first_air_date;
  const year =
    date && !isNaN(new Date(date).getTime())
      ? new Date(date).getFullYear()
      : null;

  return (
    <Link
      href={`/${result.media_type === "movie" ? "movies" : "series"}/${
        result.id
      }`}
      onClick={onNavigate}
      className="flex items-start gap-3 p-3 transition-colors hover:bg-accent/50 border-b border-border/50 last:border-0">
      {result.poster_path ? (
        <Image
          src={`https://image.tmdb.org/t/p/w185${result.poster_path}`}
          width={48}
          height={72}
          alt=""
          placeholder="blur"
          blurDataURL={BLUR_POSTER}
          className="w-12 h-[72px] object-cover rounded-md shrink-0"
        />
      ) : (
        <span className="w-12 h-[72px] grid place-items-center rounded-md bg-muted text-muted-foreground shrink-0">
          <Search className="size-4" />
        </span>
      )}
      <div className="min-w-0">
        <p className="truncate font-medium">{result.title || result.name}</p>
        <p className="text-sm text-muted-foreground">
          {result.vote_average > 0 && (
            <span className="inline-flex items-center gap-1 align-middle">
              <Star className="size-3.5 fill-amber-300 stroke-amber-300" />
              {result.vote_average.toFixed(1)}
            </span>
          )}
          {result.vote_average > 0 && year && <span> • </span>}
          {year && <span>{year}</span>}
        </p>
      </div>
    </Link>
  );
}