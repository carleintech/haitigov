"use client";

import { useState } from "react";

export function HistoryVideoPlayer({ locale }: Readonly<{ locale: "ht" | "fr" }>) {
  const [failed, setFailed] = useState(false);
  const french = locale === "fr";
  return (
    <>
      <video
        ref={(element) => {
          // A visitor can start native playback before hydration attaches the error handler.
          if (element?.error) setFailed(true);
        }}
        aria-label={
          french ? "Haïti en images — montage prototype" : "Ayiti nan imaj — montaj pwototip"
        }
        aria-describedby="history-video-notice"
        controls
        playsInline
        preload="none"
        src="/history-media/ayiti-nan-imaj.mp4"
        poster="/history-media/poster.webp"
        width={1280}
        height={720}
        onError={() => {
          setFailed(true);
        }}
      >
        <track
          kind="captions"
          src="/history-media/ht.vtt"
          srcLang="ht"
          label="Kreyòl"
          default={!french}
        />
        <track
          kind="captions"
          src="/history-media/fr.vtt"
          srcLang="fr"
          label="Français"
          default={french}
        />
        {french
          ? "Votre navigateur ne prend pas en charge la vidéo. Utilisez le lien MP4 ci-dessous."
          : "Navigatè ou a pa sipòte videyo. Sèvi ak lyen MP4 anba a."}
      </video>
      {failed ? (
        <p role="alert">
          {french
            ? "La vidéo n’a pas pu être chargée. Réessayez en rechargeant la page ou utilisez le lien MP4."
            : "Videyo a pa ka chaje. Rechaje paj la pou eseye ankò oswa sèvi ak lyen MP4 la."}
        </p>
      ) : null}
    </>
  );
}
