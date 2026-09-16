"use client";
import Image from "next/image";
import { useCallback, useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { ArrowBigUp, LogIn, LogOut, Menu, Search, User, UserPlus } from "lucide-react";
import { Button, buttonVariants } from "../ui/button";
import { Separator } from "../ui/separator";
import SearchOverlay from "@/components/features/search-overlay";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "@/lib/auth-client";

export default function Header() {
  const router = useRouter();
  const [showUpBtn, setShowUpBtn] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { data: session } = useSession();

  const isLoggedIn = !!session?.user;

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
    router.refresh();
  };

  // Solution 1: Use useCallback to stabilize the function reference
  const watchScrollEvent = useCallback(() => {
    const shouldShow = window.scrollY >= 100;
    setShowUpBtn(shouldShow);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", watchScrollEvent);
    }
    return () => window.removeEventListener("scroll", watchScrollEvent);
  }, [watchScrollEvent]);

  const handleScrollToUp = () => {
    if (typeof window !== "undefined") {
      window.scroll({
        behavior: "smooth",
        top: 0,
      });
    }
  };

  return (
    <>
      <header className="flex items-center max-lg:justify-between gap-14 px-4 lg:px-14 py-3 absolute w-full z-50">
        <Link href="/">
          <Image
            src="/assets/images/logo.png"
            width={120}
            height={55}
            alt="logo"
            className="w-auto h-14"
            draggable={false}
          />
        </Link>
        <nav className="hidden lg:flex flex-grow items-center justify-center gap-5">
          {headerLinks.map((link, i) => (
            <Link
              key={i}
              href={link.href}
              className="font-medium not-hover:text-foreground/80"
            >
              {link.title}
            </Link>
          ))}
        </nav>
        <nav className="hidden lg:flex gap-2 items-center">
          <button
            aria-label="search button"
            type="button"
            onClick={() => setSearchOpen(true)}
            className={`${buttonVariants({ size: "icon", variant: "ghost" })}`}
          >
            <Search />
          </button>
          <Separator orientation="vertical" className="h-[25px!important]" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size={"icon"}
                variant="secondary"
                className="rounded-full"
              >
                {isLoggedIn ? (
                  session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name}
                      width={36}
                      height={36}
                      className="size-9 rounded-full object-cover"
                      draggable={false}
                    />
                  ) : (
                    <span className="text-xs font-semibold uppercase">
                      {session.user.name?.charAt(0)}
                    </span>
                  )
                ) : (
                  <User />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {isLoggedIn ? (
                <>
                  <DropdownMenuLabel className="flex flex-col gap-0.5">
                    <span>{session.user.name}</span>
                    <span className="text-xs font-normal text-muted-foreground">
                      {session.user.email}
                    </span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <User />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={handleSignOut}
                  >
                    <LogOut />
                    Sign out
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/sign-in">
                      <LogIn />
                      Sign in
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/sign-up">
                      <UserPlus />
                      Sign up
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
        <nav className="min-lg:hidden flex items-center justify-center">
          <button
            aria-label="search button"
            type="button"
            onClick={() => setSearchOpen(true)}
            className={`${buttonVariants({ size: "icon", variant: "ghost" })}`}
          >
            <Search />
          </button>
          <button
            aria-label="menu button"
            type="button"
            className="cursor-pointer px-2"
          >
            <Menu />
          </button>
        </nav>
        <Button
          type="button"
          onClick={handleScrollToUp}
          size="icon"
          className={`fixed right-5 bottom-14 transition-all duration-300 ${
            showUpBtn ? "" : "opacity-10 scale-90 translate-y-36"
          }`}
        >
          <ArrowBigUp className="fill-current" />
        </Button>
      </header>
      <Suspense fallback={null}>
        <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      </Suspense>
    </>
  );
}
const headerLinks = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "Movie",
    href: "/movies",
  },
  {
    title: "Series",
    href: "/series",
  },
];
