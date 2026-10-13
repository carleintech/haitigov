"use client";

import { getImageProps } from "next/image.js";
import { useEffect, useRef, useState } from "react";

const INTRO_SEEN_KEY = "haitigov.home-intro.seen.v1";
const { props: logoProps } = getImageProps({
  alt: "",
  height: 1254,
  loading: "eager",
  src: "/haitigov-intro-logo.png",
  unoptimized: true,
  width: 1254,
});

function wasIntroSeen(): boolean {
  try {
    return window.sessionStorage.getItem(INTRO_SEEN_KEY) === "true";
  } catch (error) {
    if (error instanceof DOMException) {
      console.warn("HaitiGov intro session storage is unavailable; skipping the intro.");
      return true;
    }
    throw error;
  }
}

function markIntroAsSeen(): void {
  try {
    window.sessionStorage.setItem(INTRO_SEEN_KEY, "true");
  } catch (error) {
    if (error instanceof DOMException) {
      console.warn("HaitiGov intro session preference could not be saved.");
      return;
    }
    throw error;
  }
}

export function HomeIntro() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [shouldShow, setShouldShow] = useState(false);
  const [logoReady, setLogoReady] = useState(false);

  useEffect(() => {
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionPreference.matches || wasIntroSeen()) {
      return;
    }

    setShouldShow(true);
    const handleMotionChange = () => {
      if (motionPreference.matches) {
        dialogRef.current?.close();
        setShouldShow(false);
      }
    };
    motionPreference.addEventListener("change", handleMotionChange);
    return () => {
      motionPreference.removeEventListener("change", handleMotionChange);
    };
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!shouldShow || !logoReady || !dialog) {
      return;
    }

    if (!dialog.open) {
      dialog.showModal();
      markIntroAsSeen();
    }
    // Keep the homepage reachable even if animation completion is not delivered.
    const timeout = window.setTimeout(() => {
      dialog.close();
    }, 6100);
    return () => {
      window.clearTimeout(timeout);
    };
  }, [shouldShow, logoReady]);

  function dismissIntro() {
    if (dialogRef.current?.open) {
      dialogRef.current.close();
      return;
    }

    setShouldShow(false);
  }

  function handleClose() {
    setShouldShow(false);
  }

  if (!shouldShow) {
    return null;
  }

  return (
    <dialog
      aria-describedby="home-intro-notice"
      aria-labelledby="home-intro-heading"
      className="hg-home-intro"
      onAnimationEnd={(event) => {
        if (event.target === event.currentTarget && event.animationName === "hg-intro-dissolve") {
          dismissIntro();
        }
      }}
      onClose={handleClose}
      ref={dialogRef}
    >
      <div className="hg-home-intro__stage">
        <h2 className="hg-home-intro__heading" id="home-intro-heading">
          HaitiGov — pòtal piblik pwopoze
        </h2>
        <div aria-hidden="true" className="hg-home-intro__atmosphere" />
        <div aria-hidden="true" className="hg-home-intro__horizon" />
        <svg
          aria-hidden="true"
          className="hg-home-intro__network"
          focusable="false"
          viewBox="0 0 1000 600"
        >
          <g className="hg-home-intro__network-inner">
            <path d="M500 300 370 220 280 300 380 390 500 300 640 210 720 300 630 400 500 300M370 220 640 210M380 390 630 400" />
            {(
              [
                [370, 220],
                [280, 300],
                [380, 390],
                [640, 210],
                [720, 300],
                [630, 400],
              ] as const
            ).map(([cx, cy]) => (
              <circle cx={cx} cy={cy} key={`${cx.toString()}-${cy.toString()}`} r="3" />
            ))}
          </g>
          <g className="hg-home-intro__network-outer">
            <path d="M370 220 200 140 90 250 280 300 180 460 380 390 320 530M640 210 790 120 920 250 720 300 830 460 630 400 700 530M200 140 440 70 640 210M790 120 590 65M180 460 320 530 700 530 830 460" />
            {(
              [
                [200, 140],
                [90, 250],
                [180, 460],
                [320, 530],
                [790, 120],
                [920, 250],
                [830, 460],
                [700, 530],
                [440, 70],
                [590, 65],
              ] as const
            ).map(([cx, cy]) => (
              <circle cx={cx} cy={cy} key={`${cx.toString()}-${cy.toString()}`} r="2.5" />
            ))}
          </g>
        </svg>
        <div aria-hidden="true" className="hg-home-intro__particles">
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
        <div aria-hidden="true" className="hg-home-intro__field" />
        <div aria-hidden="true" className="hg-home-intro__pulse" />
        <div className="hg-home-intro__signature">
          <div className="hg-home-intro__emblem">
            {/* biome-ignore lint/performance/noImgElement: Next getImageProps serves the requested original without re-encoding. */}
            <img
              {...logoProps}
              alt=""
              className="hg-home-intro__logo"
              onError={() => {
                console.error("HaitiGov intro logo could not be loaded.");
                dismissIntro();
              }}
              onLoad={() => {
                setLogoReady(true);
              }}
            />
            <span aria-hidden="true" className="hg-home-intro__sweep" />
          </div>
          <p className="hg-home-intro__wordmark">HAITIGOV</p>
          <span aria-hidden="true" className="hg-home-intro__accent" />
          <p className="hg-home-intro__tagline" lang="en">
            Haiti Connected. Services Accessible. A Nation Moving Forward.
          </p>
        </div>
        <div className="hg-home-intro__controls">
          <p className="hg-home-intro__notice" id="home-intro-notice">
            Yon inisyativ dijital pwopoze; li pa yon platfòm ofisyèl Gouvènman Ayisyen an.
          </p>
          <button className="hg-home-intro__skip" onClick={dismissIntro} type="button">
            Sote entwodiksyon an
          </button>
        </div>
      </div>
    </dialog>
  );
}
