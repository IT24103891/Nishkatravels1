"use client";

import {useCopy} from "@/i18n/copy";
import {Link} from "@/i18n/navigation";
import {usePathname} from "@/i18n/navigation";
import {Compass, Menu, X} from "lucide-react";
import {useRef, useState} from "react";
import {motion, useMotionValueEvent, useScroll} from "motion/react";
import {LanguageSelector} from "./LanguageSelector";
import {navigation} from "@/lib/business";

export function Brand() {
  const copy = useCopy();
  return <Link href="/" className="brand" aria-label={copy("Nishaka Private Tours home")}>
    <span className="brand-icon"><Compass size={28} strokeWidth={1.35} aria-hidden="true" /></span>
    <span>{copy("Nishaka")}<small>PRIVATE TOURS</small></span>
  </Link>;
}

export function Navbar() {
  const copy = useCopy();
  const pathname = usePathname();
  const [menuPath, setMenuPath] = useState<string | null>(null);
  const open = menuPath === pathname;
  const home = pathname === "/";
  const toggle = useRef<HTMLButtonElement>(null);
  const {scrollY, scrollYProgress} = useScroll({trackContentSize: true});
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (position) => {
    const pastHeroTop = position > 48;
    if (pastHeroTop !== scrolled) setScrolled(pastHeroTop);
  });

  return <header className={home ? "nav nav-over-hero" : "nav"} data-solid={!home || scrolled || open}>
    <motion.div className="scroll-progress" aria-hidden="true" style={{scaleX: scrollYProgress}} />
    <div className="wrap nav-inner">
      <Brand />
      <button ref={toggle} className="menu-toggle" type="button" aria-label={open ? copy("Close menu") : copy("Open menu")} aria-expanded={open} aria-controls="main-navigation" onClick={() => setMenuPath(open ? null : pathname)}>
        {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
      </button>
      <nav id="main-navigation" aria-label={copy("Main navigation")} className={open ? "nav-links is-open" : "nav-links"} onKeyDown={(event) => {
        if (event.key === "Escape") {
          setMenuPath(null);
          toggle.current?.focus();
        }
      }}>
        {navigation.map(({href,label}) => <Link key={href} href={href} aria-current={href === pathname ? "page" : href !== "/" && pathname.startsWith(href + "/") ? "location" : undefined} onClick={() => setMenuPath(null)}>{copy(label)}</Link>)}
        <Link href="/trip-planner" className="button button-dark nav-cta" onClick={() => setMenuPath(null)}>{copy("Plan Your Trip")}</Link>
        <LanguageSelector />
      </nav>
    </div>
  </header>;
}
