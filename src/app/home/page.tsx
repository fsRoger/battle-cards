"use client";

import GameSetup from "@/app/components/Gamesetup";
import PlayerArea from "@/app/components/PlayerArea";
import GameLog from "@/app/components/Gamelog";
import TargetModal from "@/app/components/Targetmodal";
import WinnerAnnouncement from "@/app/components/WinnerAnnouncement";
import { useGame } from "@/app/hook/Usegame";
import LoopAudio from "../components/Loopaudio";
import { CardLocation } from "../types/Game";

export default function Home() {
  const {
    gameState,
    showTargetModal,
    setShowTargetModal,
    startGame,
    selectCard,

    drawCard,
    endTurn,
    attackPlayer,
    initiateAttack,
    resetGame,
    getCurrentPlayer,
    playCardToField,
    attackCard,
  } = useGame();

  if (!gameState.gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-purple-900 p-4">
        <div className="container mx-auto max-w-7xl">
          <h1 className="text-2xl md:text-4xl font-bold text-center my-8 text-white drop-shadow-lg">
            ⚔️ Battle Cards Arena ⚔️
          </h1>
          <GameSetup onStartGame={startGame} />
        </div>
      </div>
    );
  }

  const currentPlayer = getCurrentPlayer();

  const handleCardClick = (
    playerId: string,
    location: CardLocation,
    index: number
  ) => {
    const selected = gameState.selectedCard;

    if (!selected) {
      selectCard(playerId, location, index);
      return;
    }

    // 🪄 Mão → Campo
    if (
      selected.location === "hand" &&
      location !== "hand" &&
      playerId === selected.playerId
    ) {
      playCardToField(location, index);
      return;
    }

    // ⚔️ Ataque entre monstros
    if (
      selected.location === "monsters" &&
      location === "monsters" &&
      playerId !== selected.playerId
    ) {
      attackCard(playerId, index);
      return;
    }

    // 🔄 Troca seleção
    selectCard(playerId, location, index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-600 via-blue-700 to-green-900 p-4 text-white">
      <div className="container mx-auto max-w-7xl">
        <h1 className="text-2xl md:text-4xl font-bold text-center my-6 drop-shadow-lg">
          ⚔️ Battle Cards Arena ⚔️
        </h1>
        <LoopAudio src="/audio/mak.mp4a" />
        {/* Controles */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={drawCard}
            disabled={!currentPlayer}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed font-bold rounded-lg transition-all hover:-translate-y-0.5 disabled:hover:translate-y-0"
          >
            Comprar Carta
          </button>

          <button
            onClick={endTurn}
            disabled={!currentPlayer}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed font-bold rounded-lg transition-all hover:-translate-y-0.5 disabled:hover:translate-y-0"
          >
            Finalizar Turno
          </button>

          <button
            onClick={initiateAttack}
            disabled={
              !currentPlayer ||
              !gameState.selectedCard ||
              gameState.selectedCard.location !== "monsters"
            }
            className="px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed font-bold rounded-lg transition-all hover:-translate-y-0.5 disabled:hover:translate-y-0"
          >
            Fase de Ataque
          </button>

          <button
            onClick={resetGame}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 font-bold rounded-lg transition-all hover:-translate-y-0.5"
          >
            Novo Jogo
          </button>
        </div>

        {/* Log do Jogo */}
        <GameLog entries={gameState.log} />

        {/* Área dos Jogadores */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {gameState.players.map((player, index) => (
            <PlayerArea
              key={player.id}
              player={player}
              isActive={index === gameState.currentPlayerIndex}
              onCardClick={(location, cardIndex) =>
                handleCardClick(player.id, location, cardIndex)
              }
              selectedCard={
                gameState.selectedCard?.playerId === player.id
                  ? {
                      location: gameState.selectedCard.location,
                      index: gameState.selectedCard.index!,
                    }
                  : null
              }
            />
          ))}
        </div>

        {/* Modal de Seleção de Alvo */}
        <TargetModal
          isOpen={showTargetModal}
          players={gameState.players}
          currentPlayerId={currentPlayer?.id || ""}
          onSelectTarget={attackPlayer}
          onClose={() => setShowTargetModal(false)}
        />

        {/* Anúncio de Vencedor */}
        {gameState.winner && (
          <WinnerAnnouncement
            winnerName={gameState.winner}
            onNewGame={resetGame}
          />
        )}
      </div>
    </div>
  );
}
