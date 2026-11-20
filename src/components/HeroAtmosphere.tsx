"use client";

import Image from "next/image";
import {Clock3, Pause, Play} from "lucide-react";
import {motion, useTransform, type MotionValue} from "motion/react";
import {useLocale} from "next-intl";
import {minutesPerDay} from "@/data/hero-atmosphere";
import type {Photo} from "@/data/photos";
import {useCopy} from "@/i18n/copy";
import {skyAt, type SolarDay} from "@/lib/sigiriya-time";
import {ParallaxPhoto} from "./TravelMotion";
import {useHeroAtmosphere} from "./useHeroAtmosphere";

const fractional = (value: number) => value - Math.floor(value);
const stars = Array.from({length: 46}, (_, index) => ({
  x: 5 + fractional((index + 1) * .618034) * 90,
  y: 10 + fractional((index + 1) * .754878) * 60,
  radius: index % 8 === 0 ? .19 : .08 + (index % 5) * .015,
  opacity: .35 + (index % 5) * .12,
}));

function CelestialBody({kind, x, y, opacity}: {
  kind: "sun" | "moon"; x: MotionValue<string>; y: MotionValue<string>; opacity: MotionValue<number>;
}) {
  return <motion.div className={`hero-orbit hero-orbit-${kind}`} style={{x, y, opacity}}>
    <span className="hero-celestial" />
  </motion.div>;
}

function LivingSky({time, solar, staticMode}: {time: MotionValue<number>; solar: SolarDay; staticMode: boolean}) {
  const sky = useTransform(() => skyAt(time.get(), solar));
  const day = useTransform(() => sky.get().day);
  const dawn = useTransform(() => sky.get().dawn);
  const dusk = useTransform(() => sky.get().dusk);
  const night = useTransform(() => sky.get().night);
  const starlight = useTransform(() => sky.get().stars);
  const sunX = useTransform(() => `${sky.get().sunX}%`);
  const sunY = useTransform(() => `${sky.get().sunY}%`);
  const sunlight = useTransform(() => sky.get().sunOpacity);
  const moonX = useTransform(() => `${sky.get().moonX}%`);
  const moonY = useTransform(() => `${sky.get().moonY}%`);
  const moonlight = useTransform(() => sky.get().moonOpacity);

  return <div className="hero-living-sky" data-static={staticMode} aria-hidden="true">
    <motion.div className="hero-grade hero-grade-day" style={{opacity: day}} />
    <motion.div className="hero-grade hero-grade-night" style={{opacity: night}} />
    <motion.div className="hero-grade hero-grade-dawn" style={{opacity: dawn}} />
    <motion.div className="hero-grade hero-grade-dusk" style={{opacity: dusk}} />
    <div className="hero-sky-window">
      <motion.div className="hero-star-field" style={{opacity: starlight}}>
        <svg viewBox="0 0 100 28" preserveAspectRatio="xMidYMin slice" focusable="false">
          {stars.map((star, index) => <circle key={index} cx={star.x} cy={star.y * .28} r={star.radius}
            opacity={star.opacity} className={index % 8 === 0 ? "hero-star-twinkle" : undefined}
            style={{animationDelay: `-${index % 13}s`}} />)}
        </svg>
      </motion.div>
      <CelestialBody kind="sun" x={sunX} y={sunY} opacity={sunlight} />
      <CelestialBody kind="moon" x={moonX} y={moonY} opacity={moonlight} />
    </div>
  </div>;
}

export function HeroAtmosphere({photo}: {photo: Photo}) {
  const copy = useCopy();
  const locale = useLocale();
  const {time, displayMinute, mode, playing, staticMode, solar, scrub, automatic, togglePreview} = useHeroAtmosphere();
  const label = new Intl.DateTimeFormat(locale, {
    hour: "2-digit", minute: "2-digit", hourCycle: "h23", timeZone: "UTC",
  }).format(displayMinute * 60_000);
  const previewLabel = copy(playing ? "Pause day preview" : "Play day preview");

  return <>
    <ParallaxPhoto hero>
      <div className="hero-atmosphere-media">
        <Image src={photo.src} alt={copy(photo.alt)} fill sizes="100vw" preload className="hero-photo" />
        <LivingSky time={time} solar={solar} staticMode={staticMode} />
      </div>
    </ParallaxPhoto>
    <div className="hero-timeline" role="group" aria-label={copy("Sigiriya atmosphere timeline")}>
      <div className="hero-timeline-heading">
        <span><Clock3 size={14} aria-hidden="true" /> {copy("Sigiriya time")}</span>
        <time>{label}</time>
        <button type="button" className="hero-timeline-auto" aria-pressed={mode === "auto"} onClick={automatic}>
          {copy("Auto")}
        </button>
      </div>
      <div className="hero-timeline-controls">
        <button type="button" className="hero-timeline-play" aria-label={previewLabel} title={previewLabel}
          disabled={staticMode} aria-describedby={staticMode ? "hero-static-preview" : undefined} onClick={togglePreview}>
          {playing ? <Pause size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}
        </button>
        <input type="range" min={0} max={minutesPerDay - 1} step={1} value={displayMinute}
          aria-label={copy("Time of day")} aria-valuetext={label} onChange={event => scrub(event.currentTarget.valueAsNumber)} />
      </div>
      {staticMode && <p className="sr-only" id="hero-static-preview">{copy("Use the timeline to preview each time of day.")}</p>}
    </div>
  </>;
}
