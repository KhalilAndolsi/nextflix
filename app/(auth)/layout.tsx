import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BLUR_BACKDROP } from "@/lib/blur";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <div className="flex min-h-dvh flex-col items-center justify-center px-4">
        <Link href="/" className="absolute top-6 left-6">
          <Button variant="ghost" size="sm" className="gap-1.5 cursor-pointer">
            <ArrowLeft className="size-4" />
            Back to home
          </Button>
        </Link>

        <div className="mb-10 flex flex-col items-center gap-6">
          <Link href="/">
            <Image
              src="/assets/images/logo.png"
              width={120}
              height={55}
              alt="Nextflix"
              placeholder="blur"
              blurDataURL={BLUR_BACKDROP}
              className="h-12 w-auto"
              draggable={false}
            />
          </Link>
        </div>

        <div className="w-full max-w-md">{children}</div>
      </div>
    </>
  );
}