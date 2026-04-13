import React, { useEffect, useRef } from "react";

interface VideoPlayerProps {
  videoId: string;
  title: string;
}

export default function VideoPlayer({ videoId, title }: VideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("contextmenu", handleContextMenu);
    }

    return () => {
      if (container) {
        container.removeEventListener("contextmenu", handleContextMenu);
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-ngt-gold/20 select-none"
    >
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&showinfo=0&controls=1&disablekb=1`}
        title={title}
        className="absolute inset-0 w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
      
      {/* Invisible overlay to block some interactions on the top area */}
      <div className="absolute top-0 left-0 w-full h-16 bg-transparent cursor-default"></div>
    </div>
  );
}
