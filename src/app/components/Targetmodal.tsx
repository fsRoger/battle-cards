import { Player } from "@/app/types/Game";

interface TargetModalProps {
  isOpen: boolean;
  players: Player[];
  currentPlayerId: string;
  onSelectTarget: (playerId: string) => void;
  onClose: () => void;
}

export default function TargetModal({
  isOpen,
  players,
  currentPlayerId,
  onSelectTarget,
  onClose,
}: TargetModalProps) {
  if (!isOpen) return null;

  const availableTargets = players.filter(
    (p) => p.id !== currentPlayerId && !p.defeated
  );

  return (
    <div
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-gray-800 p-6 rounded-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-4">Escolha o Alvo</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {availableTargets.map((player) => (
            <div
              key={player.id}
              onClick={() => onSelectTarget(player.id)}
              className="bg-white/10 p-4 rounded-lg cursor-pointer border-2 border-transparent hover:border-yellow-400 hover:bg-white/20 transition-all"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-lg">{player.name}</span>
                <span className="bg-red-500 px-3 py-1 rounded font-bold">
                  HP: {player.hp}
                </span>
              </div>

              <div className="text-sm opacity-75">
                Cartas no campo: {player.field.filter((c) => c !== null).length}
              </div>
              <div className="text-sm opacity-75">
                Cartas na mão: {player.hand.length}
              </div>
            </div>
          ))}
        </div>

        {availableTargets.length === 0 && (
          <div className="text-center py-8 opacity-75">
            Nenhum alvo disponível
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-4 w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
