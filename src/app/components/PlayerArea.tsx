import { Player, Card as CardType, CardLocation } from "@/app/types/Game";
import Card from "./Card";
import { cn } from "@/app/lib/utils";

interface PlayerAreaProps {
  player: Player;
  isActive: boolean;
  onCardClick: (location: CardLocation, cardIndex: number) => void;
  index?: number;

  selectedCard?: {
    location: "hand" | "monsters" | "spells" | "terrain";
    index?: number;
  } | null;
}

export default function PlayerArea({
  player,
  isActive,
  onCardClick,
  selectedCard,
}: PlayerAreaProps) {
  return (
    <div
      className={cn(
        "bg-black/30 rounded-lg p-4 border-3 transition-all",
        isActive
          ? "border-yellow-400 shadow-[0_0_20px_rgba(255,215,0,0.5)]"
          : "border-transparent",
        player.defeated && "opacity-50 grayscale"
      )}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <span className="font-bold text-lg">{player.name}</span>
        <span className="bg-red-500 px-3 py-1 rounded font-bold">
          HP: {player.hp}
        </span>
      </div>

      {/* Campo de Batalha */}
      <div className="mb-4">
        <div className="text-sm mb-2 opacity-75">Campo</div>

        {/* Terreno */}
        <div className="mb-2">
          <div className="text-xs mb-1 opacity-60">Terreno</div>
          <div
            onClick={() => onCardClick("terrain", 0)}
            className="aspect-[2/3] w-24 border rounded flex items-center justify-center"
          >
            {player.field.terrain ? (
              <Card
                card={player.field.terrain.card}
                faceDown={player.field.terrain.faceDown}
                selected={
                  selectedCard?.location === "terrain" &&
                  selectedCard.index === 0
                }
              />
            ) : (
              <span>Vazio</span>
            )}
          </div>
        </div>

        {/* Magias / Armadilhas */}
        <div className="mb-2">
          <div className="text-xs mb-1 opacity-60">Magias / Armadilhas</div>
          <div className="grid grid-cols-3 gap-1">
            {player.field.spells.map((slot, index) => (
              <div
                key={index}
                onClick={() => onCardClick("spells", index)}
                className="aspect-[2/3] border rounded flex items-center justify-center"
              >
                {slot ? (
                  <Card
                    card={slot.card}
                    faceDown={slot.faceDown}
                    selected={
                      selectedCard?.location === "spells" &&
                      selectedCard.index === index
                    }
                  />
                ) : (
                  <span>Vazio</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Monstros */}
        <div>
          <div className="text-xs mb-1 opacity-60">Monstros</div>
          <div className="grid grid-cols-3 gap-1">
            {player.field.monsters.map((slot, index) => (
              <div
                key={index}
                onClick={() => onCardClick("monsters", index)}
                className="aspect-[2/3] border rounded flex items-center justify-center"
              >
                {slot ? (
                  <Card
                    card={slot.card}
                    faceDown={slot.faceDown}
                    selected={
                      selectedCard?.location === "monsters" &&
                      selectedCard.index === index
                    }
                  />
                ) : (
                  <span>Vazio</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Mão */}
      <div>
        <div className="text-sm mb-1 opacity-75">
          Mão ({player.hand.length} cartas)
        </div>
        <div className="flex gap-1 overflow-x-auto py-2">
          {player.hand.map((card, index) => (
            <div key={card.id} onClick={() => onCardClick("hand", index)}>
              <Card
                card={card}
                size="small"
                selected={
                  selectedCard?.location === "hand" &&
                  selectedCard?.index === index
                }
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
