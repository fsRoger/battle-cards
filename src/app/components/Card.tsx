import { Card as CardType } from "@/app/types/Game";
import { cn } from "@/app/lib/utils";
import Image from "next/image";

interface CardProps {
  card: CardType;
  onClick?: () => void;
  selected?: boolean;
  size?: "small" | "normal";
  faceDown?: boolean;
  hp?: number;
  attack?: number;
  defense?: number;
  element?: string;
  effect?: string;
  image?: string;
}

const elementColors: Record<string, string> = {
  Fogo: "border-red-500",
  Água: "border-blue-500",
  Terra: "border-green-500",
  Vento: "border-orange-500",
  Luz: "border-gray-100",
  Trevas: "border-gray-800",
};

export default function Card({
  card,
  onClick,
  selected,
  size = "normal",
  faceDown = false,
}: CardProps) {
  const elementClass = card.element
    ? elementColors[card.element]
    : "border-yellow-400";

  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-gradient-to-br from-purple-600 to-purple-900 rounded-lg border-2 p-2",
        "flex flex-col relative cursor-pointer transition-transform hover:scale-105",
        size === "small" ? "min-w-20 h-32" : "w-full h-full",
        selected
          ? "border-green-500 shadow-[0_0_15px_rgba(0,255,0,0.7)]"
          : elementClass,
        onClick && "hover:brightness-110"
      )}
    >
      <span className="absolute top-1 right-1 text-[10px] bg-black/70 px-1.5 py-0.5 rounded">
        {card.type}
      </span>
      <div className="m-[-4px]">
        {faceDown ? (
          <div className="w-full h-full bg-gray-700 rounded-lg" />
        ) : (
          <Image
            src={`/images/${card.image}`}
            alt={card.name}
            className="object-cover rounded-lg"
            width={100}
            height={100}
          />
        )}
      </div>
      <div className="font-bold text-[11px] bg-white text-black text-center mb-1 mt-3">
        {card.name}
      </div>

      {(card.attack !== undefined || card.defense !== undefined) && (
        <div className="flex justify-around my-1 text-[10px]">
          {card.attack !== undefined && (
            <span className="bg-black/50 px-1.5 py-0.5 rounded">
              ATK: {card.attack}
            </span>
          )}
          {card.defense !== undefined && (
            <span className="bg-black/50 px-1.5 py-0.5 rounded">
              DEF: {card.defense}
            </span>
          )}
        </div>
      )}

      {card.element && (
        <div className="text-[9px] text-center bg-black/30 px-1 py-0.5 rounded my-1">
          {card.element}
        </div>
      )}

      {card.effect && (
        <div className="text-[8px] text-center mt-auto bg-black/40 p-1 rounded">
          {card.effect}
        </div>
      )}
    </div>
  );
}
