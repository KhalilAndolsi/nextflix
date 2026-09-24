import { Facebook, Instagram, LucideProps, Mail, Twitter } from "lucide-react";
import Link from "next/link";
import { Fragment } from "react";

export default function Footer() {
  return (
    <footer className="px-4 lg:px-14 mt-36">
      <div className="flex gap-y-10 flex-col lg:flex-row justify-between items-stretch pb-10 lg:pb-14 border-b border-muted">
        <p className="text-2xl lg:text-4xl font-bold max-w-lg">
          Our platform is trusted by millions & features best updated movies all
          around the world.
        </p>
        <div className="flex gap-y-5 flex-col-reverse lg:flex-col lg:justify-between">
        <nav aria-label="Footer navigation" className="space-x-3 text-muted-foreground">
          {navLinks.map(({title, href}, i) => (
            <Fragment key={i}>
              <Link href={href} className="hover:text-foreground">{title}</Link>
              {i < (navLinks.length - 1) && <span>/</span>}
            </Fragment>
          ))}
        </nav>
          <nav aria-label="Social media" className="flex items-center lg:justify-end gap-4 parent-blur-effect">
            {socialLinks.map(({icon, href, label}, i) => (
              <a href={href} target="_blank" key={i} rel="noopener noreferrer" aria-label={label}><span className="sr-only">{label}</span>{icon({className: "hover:scale-125 child-blur-effect"})}</a>
            ))}
          </nav>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row items-center justify-between py-4 text-sm">
        <nav aria-label="Legal" className="flex gap-2 lg:gap-5">
          {websiteSettings.map(({title, href}, i) => (
            <Link key={i} href={href} className="text-muted-foreground hover:text-foreground">{title}</Link>
          ))}
        </nav>
        <p>© {new Date().getFullYear()} - created by <a href="https://github.com/KhalilAndolsi" target="_blank" rel="noopener noreferrer">khalil andolssi</a></p>
      </div>
    </footer>
  );
}

const navLinks = [
  {
    title: "Home",
    href: "/"
  },
  {
    title: "Movies",
    href: "/movies"
  },
  {
    title: "Series",
    href: "/series"
  },
]

const socialLinks = [
  {
    href: "/",
    label: "Instagram",
    icon: (props?: LucideProps) => <Instagram {...props} />
  },
  {
    href: "/",
    label: "Facebook",
    icon: (props?: LucideProps) => <Facebook {...props} />
  },
  {
    href: "/",
    label: "Twitter",
    icon: (props?: LucideProps) => <Twitter {...props} />
  },
  {
    href: "/",
    label: "Email us",
    icon: (props?: LucideProps) => <Mail {...props} />
  },
]

const websiteSettings = [
  {
    title: "Privacy policy",
    href: "/"
  },
  {
    title: "Term of service",
    href: "/"
  },
  {
    title: "Language",
    href: "/"
  },
]