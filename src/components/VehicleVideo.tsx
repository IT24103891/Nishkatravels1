"use client";

import {useEffect, useRef, useState} from "react";
import Image from "next/image";
import {Film} from "lucide-react";
import {useLocale} from "next-intl";
import type {Photo} from "@/data/photos";
import type {VehicleClip} from "@/data/vehicles";
import {useCopy} from "@/i18n/copy";
import {languageTags, localeNames, type Locale} from "@/i18n/routing";

export function VehicleVideo({clip, title, fallback}: {clip?: VehicleClip; title: string; fallback?: Photo}) {
  const copy = useCopy();
  const locale = useLocale() as Locale;
  const frame = useRef<HTMLDivElement>(null);
  const player = useRef<HTMLVideoElement>(null);
  const [nearby, setNearby] = useState(false);
  const [visible, setVisible] = useState(false);
  const [failed, setFailed] = useState(false);
  const manuallyUsed = useRef(false);
  const still = clip?.poster ?? fallback;

  useEffect(() => {
    if (!clip || !frame.current) return;
    const target = frame.current;
    const lazy = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setNearby(true);
        lazy.disconnect();
      }
    }, {rootMargin: "180px"});
    lazy.observe(target);

    const playback = clip.decorative ? new IntersectionObserver(([entry]) => {
      setVisible(entry.isIntersecting && entry.intersectionRatio >= 0.5);
    }, {threshold: [0, 0.5]}) : null;
    playback?.observe(target);

    return () => {
      lazy.disconnect();
      playback?.disconnect();
    };
  }, [clip]);

  useEffect(() => {
    if (!clip?.decorative || !nearby || !player.current) return;
    const video = player.current;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    function syncPlayback() {
      if (manuallyUsed.current) return;
      if (!visible || preference.matches || document.hidden) {
        video.pause();
        return;
      }
      video.muted = true;
      void video.play().catch(() => {});
    }
    syncPlayback();
    preference.addEventListener("change", syncPlayback);
    document.addEventListener("visibilitychange", syncPlayback);
    return () => {
      preference.removeEventListener("change", syncPlayback);
      document.removeEventListener("visibilitychange", syncPlayback);
    };
  }, [clip, nearby, visible]);

  return <figure className="ride-clip">
    <div ref={frame} className="ride-clip-frame">
      {still ? <Image src={still.src} alt={copy(still.alt)} fill sizes="(max-width: 760px) 92vw, 390px" />
        : <Film size={34} strokeWidth={1.25} aria-hidden="true" />}
      {clip && nearby && !failed && <video ref={player} controls playsInline preload="none" poster={clip.poster.src}
        aria-label={title} muted={clip.decorative} loop={clip.decorative}
        onPointerDown={() => {manuallyUsed.current = true;}} onKeyDown={() => {manuallyUsed.current = true;}}
        onError={() => setFailed(true)}>
        {clip.webm && <source src={clip.webm} type="video/webm" onError={clip.mp4 ? undefined : () => setFailed(true)} />}
        {clip.mp4 && <source src={clip.mp4} type="video/mp4" onError={() => setFailed(true)} />}
        {(Object.keys(clip.captions) as Locale[]).map(language => <track key={language} kind="captions"
          srcLang={languageTags[language]} label={localeNames[language]} src={clip.captions[language]} default={language === (clip.captions[locale] ? locale : "en")} />)}
      </video>}
      {clip?.footage === "concept" && <span className="ride-concept">{copy("Concept visualization")}</span>}
    </div>
    <figcaption><strong>{title}</strong>
      {!clip && <span>{copy("Footage not yet available")}</span>}
      {failed && <span role="status">{copy("Video could not load. The poster is shown instead.")}</span>}
    </figcaption>
  </figure>;
}
