"use client";

import {useRef, type ReactNode} from "react";
import {motion, useReducedMotion, useScroll, useTransform} from "motion/react";

const ease = [0.22, 1, 0.36, 1] as const;

type AnimationProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export function Entrance({children, className, delay = 0}: AnimationProps) {
  const reducedMotion = useReducedMotion();
  return <motion.div
    className={`motion-content ${className ?? ""}`}
    initial={reducedMotion ? false : {opacity: 0.6, y: 16}}
    animate={{opacity: 1, y: 0}}
    transition={{duration: reducedMotion ? 0 : 0.72, delay: reducedMotion ? 0 : delay, ease}}
  >{children}</motion.div>;
}

export function Reveal({children, className, delay = 0}: AnimationProps) {
  const reducedMotion = useReducedMotion();
  return <motion.div
    className={`motion-content ${className ?? ""}`}
    initial={reducedMotion ? false : {opacity: 0, y: 22}}
    whileInView={{opacity: 1, y: 0}}
    viewport={{once: true, amount: "some", margin: "0px 0px -24px 0px"}}
    transition={{duration: reducedMotion ? 0 : 0.68, delay: reducedMotion ? 0 : delay, ease}}
  >{children}</motion.div>;
}

export function ParallaxPhoto({children, hero = false}: {children: ReactNode; hero?: boolean}) {
  const target = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const {scrollYProgress} = useScroll({
    target,
    offset: hero ? ["start start", "end start"] : ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "5%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.03, 1.13]);

  return <div className="parallax-frame" ref={target}>
    <motion.div className="parallax-layer" style={reducedMotion ? undefined : hero ? {y, scale: 1.12} : {scale}}>
      {children}
    </motion.div>
  </div>;
}
