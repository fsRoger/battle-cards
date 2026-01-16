interface GameLogProps {
  entries: string[];
}

export default function GameLog({ entries }: GameLogProps) {
  return (
    <div className="bg-black/50 rounded-lg p-4 max-h-48 overflow-y-auto">
      <h3 className="font-bold mb-2 text-3xl">Log do Jogo</h3>
      <div className="space-y-1">
        {entries.length === 0 ? (
          <div className="text-sm opacity-50">Nenhuma ação ainda...</div>
        ) : (
          entries.map((entry, index) => (
            <div
              key={index}
              className="text-sm py-1 border-b border-white/10 last:border-0"
            >
              {entry}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
