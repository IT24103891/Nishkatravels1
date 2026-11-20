"use client";

import {useEffect, useRef, useState} from "react";
import {animate, useMotionValue, useMotionValueEvent, useReducedMotion} from "motion/react";
import {atmosphereStorageKey, defaultSolarDay, minutesPerDay, sigiriya} from "@/data/hero-atmosphere";
import {colomboMinutes, sigiriyaSolarDay, type SolarCalculator} from "@/lib/sigiriya-time";

const initialMinute = 6 * 60;
const previousPresets: Record<string, number> = {sunrise: 360, day: 720, sunset: 1080, night: 1320};

function readMinute() {
  try {
    const saved = localStorage.getItem(atmosphereStorageKey);
    if (!saved || saved === "auto") return null;
    const minute = Object.hasOwn(previousPresets, saved) ? previousPresets[saved] : Number(saved);
    if (Number.isFinite(minute) && minute >= 0 && minute < minutesPerDay) return minute;
  } catch {
    // The timeline still works when storage is unavailable.
  }
  return null;
}

export function useHeroAtmosphere() {
  const time = useMotionValue(initialMinute);
  const [displayMinute, setDisplayMinute] = useState(initialMinute);
  const [mode, setMode] = useState<"auto" | "manual" | "preview">("auto");
  const followsClock = useRef(true);
  const [playing, setPlaying] = useState(false);
  const [solar, setSolar] = useState(defaultSolarDay);
  const reducedMotion = useReducedMotion();
  const [lowPower, setLowPower] = useState(false);
  const staticMode = reducedMotion === true || lowPower;

  useMotionValueEvent(time, "change", minute => setDisplayMinute(
    Math.min(minutesPerDay - 1, Math.floor(minute / (playing ? 10 : 1)) * (playing ? 10 : 1)),
  ));

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const saved = readMinute();
      if (saved !== null) {
        followsClock.current = false;
        time.set(saved);
        setMode("manual");
      }
      const memory = (navigator as Navigator & {deviceMemory?: number}).deviceMemory;
      setLowPower((memory !== undefined && memory <= 2) ||
        (navigator.hardwareConcurrency > 0 && navigator.hardwareConcurrency <= 2));
    }, 0);
    return () => window.clearTimeout(timer);
  }, [time]);

  useEffect(() => {
    let disposed = false;
    let calculate: SolarCalculator | undefined;
    function refresh() {
      if (document.hidden) return;
      const now = new Date();
      const day = sigiriyaSolarDay(now, calculate);
      setSolar(current => current.sunrise === day.sunrise && current.sunset === day.sunset ? current : day);
      if (followsClock.current) time.set(colomboMinutes(now));
    }
    const timer = window.setTimeout(refresh, 0);
    const interval = window.setInterval(refresh, 30_000);
    document.addEventListener("visibilitychange", refresh);
    window.addEventListener("focus", refresh);
    void import("suncalc").then(({getTimes}) => {
      if (disposed) return;
      calculate = date => getTimes(date, sigiriya.latitude, sigiriya.longitude, 0, sigiriya.utcOffsetMinutes);
      refresh();
    }).catch(() => { /* Continue with the default solar day. */ });
    return () => {
      disposed = true;
      window.clearTimeout(timer);
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", refresh);
      window.removeEventListener("focus", refresh);
    };
  }, [time]);

  useEffect(() => {
    if (!playing || staticMode) return;
    const preview = animate(time, minutesPerDay - 1, {
      duration: 20 * (minutesPerDay - time.get()) / minutesPerDay,
      ease: "linear",
      onComplete: () => {
        setDisplayMinute(minutesPerDay - 1);
        setPlaying(false);
      },
    });
    return () => preview.stop();
  }, [playing, staticMode, time]);

  function save(value: string) {
    try { localStorage.setItem(atmosphereStorageKey, value); } catch { /* Optional persistence. */ }
  }

  function scrub(minute: number) {
    followsClock.current = false;
    time.stop();
    time.set(minute);
    setDisplayMinute(minute);
    setPlaying(false);
    setMode("manual");
    save(String(minute));
  }

  function automatic() {
    followsClock.current = true;
    time.stop();
    const now = colomboMinutes(new Date());
    time.set(now);
    setDisplayMinute(Math.floor(now));
    setPlaying(false);
    setMode("auto");
    save("auto");
  }

  function togglePreview() {
    followsClock.current = false;
    if (playing && !staticMode) {
      time.stop();
      setDisplayMinute(Math.floor(time.get()));
      setPlaying(false);
      return;
    }
    if (mode !== "preview" || time.get() >= minutesPerDay - 1) {
      time.set(0);
      setDisplayMinute(0);
    }
    setMode("preview");
    setPlaying(true);
  }

  return {time, displayMinute, mode, playing: playing && !staticMode, staticMode, solar, scrub, automatic, togglePreview};
}
