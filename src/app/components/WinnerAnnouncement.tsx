interface WinnerAnnouncementProps {
  winnerName: string;
  onNewGame: () => void;
}

export default function WinnerAnnouncement({
  winnerName,
  onNewGame,
}: WinnerAnnouncementProps) {
  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
      <div className="bg-black/95 p-10 rounded-3xl border-4 border-yellow-400 text-center animate-pulse">
        <h2 className="text-5xl font-bold mb-4">🎉 Vitória! 🎉</h2>
        <p className="text-3xl mb-8">{winnerName} venceu!</p>
        <button
          onClick={onNewGame}
          className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg text-xl transition-colors"
        >
          Novo Jogo
        </button>
      </div>
    </div>
  );
}
