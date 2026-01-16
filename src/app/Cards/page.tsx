"use client";

import Image from "next/image";
import { useState } from "react";
import { CARD_DATABASE } from "@/app/data/cards";
import { CardType } from "@/app/types/Game";
import LoopAudio from "../components/Loopaudio";

// 🔹 Componente auxiliar para imagem com fallback
function CardImage({ image, name }: { image: string; name: string }) {
  const [src, setSrc] = useState(`/images/${image}`);

  return (
    <Image
      src={src}
      alt={name}
      fill
      className="object-cover"
      onError={() => setSrc("/images/placeholder.jpg")} // 👈 evita loop
    />
  );
}

export default function AllCardsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-8">
      <h1 className="text-2xl font-bold text-center mb-8">
        📜 Todas as Cartas
      </h1>
      <LoopAudio src="/audio/mak.m4a" />
      <div className="grid gap-2 grid-cols-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6 lg:grid-cols-6 lg:mx-20">
        {CARD_DATABASE.map((card, index) => (
          <div
            key={index}
            className="bg-gradient-to-b from-blue-900 to-green-900 rounded-xl shadow-lg overflow-hidden border border-gray-600 hover:scale-105 transition-transform duration-200 flex flex-col"
          >
            {/* Nome */}
            <div className="text-center bg-gray-800 py-1 font-bold text-[10px] md:text-base lg:text-lg border-b border-gray-600">
              {card.name}
            </div>

            {/* Imagem */}
            <div className="relative w-full h-32 sm:h-48 md:h-56 lg:h-64">
              <CardImage
                image={card.image ?? "placeholder.jpg"}
                name={card.name}
              />
            </div>

            {/* Stats */}
            <div className="p-2 flex flex-col gap-1 text-[8px] sm:text-sm md:text-base">
              {card.element && (
                <p>
                  <strong>Elemento:</strong> {card.element}
                </p>
              )}
              {card.attack !== undefined && card.defense !== undefined && (
                <p>
                  <strong>ATK:</strong> {card.attack} | <strong>DEF:</strong>{" "}
                  {card.defense}
                </p>
              )}
              <p className="italic text-gray-400">✦ {card.effect}</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
