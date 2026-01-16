"use client"; // necessário para componentes que usam hooks no Next.js 15

import { useState, useRef, useEffect } from "react";

interface LoopAudioProps {
  src: string;
}

export default function LoopAudio({ src }: LoopAudioProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.loop = true;
      audioRef.current.play().catch(() => {
        // autoplay pode falhar em alguns navegadores
      });
    }
  }, []);

  const toggleAudio = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="fixed bottom-4 right-4 flex items-center space-x-2 bg-gray-800 bg-opacity-70 p-3 rounded-full shadow-lg">
      <audio ref={audioRef} src={src} />
      <button
        onClick={toggleAudio}
        className="text-white font-bold px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 transition"
      >
        {isPlaying ? "⏸️ Pausar" : "▶️ Tocar"}
      </button>
    </div>
  );
}
