"use client";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowBigUp, Menu, Search } from "lucide-react";
import { Button, buttonVariants } from "../ui/button";
import { Separator } from "../ui/separator";

export default function Header() {
  const [showUpBtn, setShowUpBtn] = useState(false);

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
          <Link key={i} href={link.href} className="font-medium not-hover:text-foreground/80">
            {link.title}
          </Link>
        ))}
      </nav>
      <nav className="hidden lg:flex gap-2 items-center">
        <button
          aria-label="search button"
          type="button"
          className={`${buttonVariants({ size: "icon", variant: "ghost" })}`}>
          <Search />
        </button>
        <Separator orientation="vertical" className="h-[25px!important]" />
        <Link href="/" className={buttonVariants({ variant: "outline" })}>
          Sign Up
        </Link>
        <Link href="/" className={buttonVariants()}>
          Sign In
        </Link>
      </nav>
      <nav className="min-lg:hidden flex items-center justify-center">
        <button
          aria-label="search button"
          type="button"
          className={`${buttonVariants({ size: "icon", variant: "ghost" })}`}>
          <Search />
        </button>
        <button
          aria-label="menu button"
          type="button"
          className="cursor-pointer px-2">
          <Menu />
        </button>
      </nav>
      <Button
        type="button"
        onClick={handleScrollToUp}
        size="icon"
        className={`fixed right-5 bottom-14 transition-all duration-300 ${
          showUpBtn ? "" : "opacity-10 scale-90 translate-y-36"
        }`}>
        <ArrowBigUp className="fill-current" />
      </Button>
    </header>
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
