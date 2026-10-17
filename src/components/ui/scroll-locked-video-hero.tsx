"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

export interface MetroHeroProps {
  videoSrc?: string;
  fallbackImageSrc?: string;
  fallbackImageAlt?: string;
  title?: string;
  scrollHint?: string;
  tagline?: string;
  signature?: { name: string; url: string } | false;
  /** Scroll distance in pixels used to scrub the full video. */
  scrubDistance?: number;
  className?: string;
  style?: CSSProperties;
  labelledBy?: string;
  children?: ReactNode;
}

const DEFAULT_VIDEO = "https://cdn.21st.dev/assets/mirror/21/21a77eac28eacbb7e142016eefeaa0b4a766619e51113629a3bc6df6af066c0f.mp4";
const DEFAULT_SIGNATURE = { name: "guglielmogiannattasio.exe", url: "https://www.guglielmogiannattasio.it" };

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

/** Scroll-scrub video hero with native page scrolling and a static image fallback. */
export default function MetroHero({
  videoSrc = DEFAULT_VIDEO,
  fallbackImageSrc = "/images/hero-car-premium.png",
  fallbackImageAlt = "Blue car for driving lessons",
  title = "THE CITY OPENS",
  scrollHint = "SCROLL",
  tagline = "Every door in the city is already open.",
  signature = DEFAULT_SIGNATURE,
  scrubDistance = 3200,
  className,
  style,
  labelledBy,
  children,
}: MetroHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const fallbackRef = useRef<HTMLImageElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [mediaFailed, setMediaFailed] = useState(false);
  const [preferencesReady, setPreferencesReady] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [smallScreen, setSmallScreen] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobile = window.matchMedia("(max-width: 760px)");
    const syncPreferences = () => {
      setReducedMotion(reduced.matches);
      setSmallScreen(mobile.matches);
      setPreferencesReady(true);
    };
    syncPreferences();
    reduced.addEventListener("change", syncPreferences);
    mobile.addEventListener("change", syncPreferences);
    return () => {
      reduced.removeEventListener("change", syncPreferences);
      mobile.removeEventListener("change", syncPreferences);
    };
  }, []);

  const staticMode = reducedMotion || smallScreen;
  const distance = staticMode ? 0 : Math.max(0, scrubDistance);

  useEffect(() => {
    const video = videoRef.current;
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!video || !section || !stage || staticMode || mediaFailed) return;
    const videoElement = video as HTMLVideoElement;
    const sectionElement = section as HTMLElement;
    const stageElement = stage as HTMLDivElement;

    let duration = 0;
    let rafId = 0;
    let targetProgress = 0;
    let currentProgress = 0;
    let isSeeking = false;
    let pendingTime: number | null = null;
    let isIntersecting = true;

    const onLoadedMetadata = () => {
      duration = videoElement.duration || 0;
      startFrame();
    };
    const onLoadedData = () => {
      setReady(true);
      startFrame();
    };
    const onSeeked = () => {
      isSeeking = false;
      if (pendingTime !== null) {
        const nextTime = pendingTime;
        pendingTime = null;
        isSeeking = true;
        videoElement.currentTime = nextTime;
      }
    };

    function seekTo(time: number) {
      if (!duration || videoElement.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) return;
      if (isSeeking) {
        pendingTime = time;
        return;
      }
      isSeeking = true;
      videoElement.currentTime = time;
    }

    function updateTarget() {
      const availableScroll = Math.max(1, sectionElement.offsetHeight - stageElement.offsetHeight);
      targetProgress = clamp(-sectionElement.getBoundingClientRect().top / availableScroll, 0, 1);
      if (hintRef.current) hintRef.current.style.opacity = targetProgress > 0.005 ? "0" : "1";
      startFrame();
    }

    function frame() {
      if (!isIntersecting) {
        rafId = 0;
        return;
      }
      currentProgress += (targetProgress - currentProgress) * 0.16;
      if (Math.abs(targetProgress - currentProgress) < 0.0005) currentProgress = targetProgress;
      seekTo(currentProgress * duration);

      if (videoRef.current) videoRef.current.style.transform = `scale(${1 + currentProgress * 0.045})`;
      if (titleRef.current) {
        const opacity = 1 - clamp(currentProgress / 0.42, 0, 1);
        titleRef.current.style.opacity = String(opacity);
        titleRef.current.style.transform = `translateY(${(1 - opacity) * -18}px)`;
        titleRef.current.style.filter = `blur(${(1 - opacity) * 7}px)`;
      }
      if (taglineRef.current) {
        const opacity = clamp((currentProgress - 0.78) / 0.22, 0, 1);
        taglineRef.current.style.opacity = String(opacity);
        taglineRef.current.style.transform = `translateY(${(1 - opacity) * 16}px)`;
        taglineRef.current.style.filter = `blur(${(1 - opacity) * 6}px)`;
      }
      if (progressBarRef.current) progressBarRef.current.style.transform = `scaleX(${currentProgress})`;
      rafId = currentProgress === targetProgress ? 0 : requestAnimationFrame(frame);
    }

    function startFrame() {
      if (!rafId && isIntersecting) rafId = requestAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(([entry]) => {
      isIntersecting = entry.isIntersecting;
      if (isIntersecting) {
        updateTarget();
        startFrame();
      } else if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
        videoElement.pause();
      }
    }, { rootMargin: "100px" });

    videoElement.addEventListener("loadedmetadata", onLoadedMetadata);
    videoElement.addEventListener("loadeddata", onLoadedData);
    videoElement.addEventListener("seeked", onSeeked);
    window.addEventListener("scroll", updateTarget, { passive: true });
    window.addEventListener("resize", updateTarget, { passive: true });
    observer.observe(sectionElement);
    updateTarget();
    startFrame();

    return () => {
      videoElement.removeEventListener("loadedmetadata", onLoadedMetadata);
      videoElement.removeEventListener("loadeddata", onLoadedData);
      videoElement.removeEventListener("seeked", onSeeked);
      window.removeEventListener("scroll", updateTarget);
      window.removeEventListener("resize", updateTarget);
      observer.disconnect();
      cancelAnimationFrame(rafId);
    };
  }, [mediaFailed, staticMode]);

  // Keep the locally stored car image subtly responsive to native scrolling
  // while a desktop video is loading or when its source is unavailable.
  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage || staticMode) return;
    const sectionElement = section as HTMLElement;
    const stageElement = stage as HTMLDivElement;

    function updateFallbackMotion() {
      const availableScroll = Math.max(1, sectionElement.offsetHeight - stageElement.offsetHeight);
      const progress = clamp(-sectionElement.getBoundingClientRect().top / availableScroll, 0, 1);
      if (fallbackRef.current) fallbackRef.current.style.transform = `scale(${1 + progress * 0.035})`;
      if (progressBarRef.current) progressBarRef.current.style.transform = `scaleX(${progress})`;
      if (hintRef.current) hintRef.current.style.opacity = progress > 0.005 ? "0" : "1";
    }

    window.addEventListener("scroll", updateFallbackMotion, { passive: true });
    window.addEventListener("resize", updateFallbackMotion, { passive: true });
    updateFallbackMotion();
    return () => {
      window.removeEventListener("scroll", updateFallbackMotion);
      window.removeEventListener("resize", updateFallbackMotion);
    };
  }, [staticMode]);

  return (
    <section
      ref={sectionRef}
      className={`metro-hero-section${staticMode ? " is-static" : ""}${ready && !staticMode && !mediaFailed ? " has-video" : ""}${className ? ` ${className}` : ""}`}
      aria-labelledby={labelledBy}
      aria-label={labelledBy ? undefined : "Scroll-controlled video introduction"}
      style={{ height: `calc(100svh + ${distance}px - var(--metro-header-offset, 78px))`, ...style }}
    >
      <div ref={stageRef} className="metro-hero-stage">
        <div className="metro-hero-media">
          <Image
            ref={fallbackRef}
            className="metro-hero-fallback"
            src={fallbackImageSrc}
            alt={fallbackImageAlt}
            fill
            priority
            sizes="100vw"
          />
          {preferencesReady && !staticMode && !mediaFailed && (
            <video
              ref={videoRef}
              className="metro-hero-video"
              src={videoSrc}
              muted
              playsInline
              preload="metadata"
              aria-hidden="true"
              onError={() => setMediaFailed(true)}
              style={{ opacity: ready ? 1 : 0 }}
            />
          )}
          <div className="metro-hero-shade" aria-hidden="true" />
        </div>

        {children ? (
          <div className="metro-hero-content">{children}</div>
        ) : (
          <>
            <div ref={titleRef} className="metro-hero-title">
              <h1>{title}</h1>
            </div>
            {tagline && <div ref={taglineRef} className="metro-hero-tagline"><p>{tagline}</p></div>}
            <div ref={hintRef} className="metro-hero-scroll-hint">
              <span>{staticMode ? "SCROLL TO CONTINUE" : scrollHint}</span>
              {!staticMode && <span aria-hidden="true">↓</span>}
            </div>
            {!staticMode && <div className="metro-hero-progress" aria-hidden="true"><div ref={progressBarRef} /></div>}
            {signature && <span className="metro-hero-signature">by <a href={signature.url} target="_blank" rel="noopener noreferrer">{signature.name}</a></span>}
          </>
        )}
        {children && (
          <>
            <div ref={hintRef} className="metro-hero-scroll-hint"><span>{staticMode ? "SCROLL TO CONTINUE" : scrollHint}</span>{!staticMode && <span aria-hidden="true">↓</span>}</div>
            {!staticMode && <div className="metro-hero-progress" aria-hidden="true"><div ref={progressBarRef} /></div>}
          </>
        )}
      </div>
    </section>
  );
}
