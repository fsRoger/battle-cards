import { useState } from "react";

interface GameSetupProps {
  onStartGame: (playerNames: string[]) => void;
}

export default function GameSetup({ onStartGame }: GameSetupProps) {
  const [numPlayers, setNumPlayers] = useState(2);
  const [playerNames, setPlayerNames] = useState<string[]>([
    "Jogador 1",
    "Jogador 2",
  ]);

  const handleNumPlayersChange = (num: number) => {
    setNumPlayers(num);
    const names = Array.from({ length: num }, (_, i) => `Jogador ${i + 1}`);
    setPlayerNames(names);
  };

  const handlePlayerNameChange = (index: number, name: string) => {
    const newNames = [...playerNames];
    newNames[index] = name;
    setPlayerNames(newNames);
  };

  const handleSubmit = () => {
    if (playerNames.every((name) => name.trim())) {
      onStartGame(playerNames);
    } else {
      alert("Por favor, preencha todos os nomes dos jogadores!");
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Configuração do Jogo
      </h2>

      <div className="mb-6">
        <label className="block text-sm mb-2">Número de Jogadores</label>
        <input
          type="number"
          min={2}
          max={4}
          value={numPlayers}
          onChange={(e) => handleNumPlayersChange(Number(e.target.value))}
          className="w-full px-4 py-3 rounded-lg bg-white/90 text-gray-900 font-semibold"
        />
      </div>

      <div className="space-y-3 mb-6">
        {playerNames.map((name, index) => (
          <div key={index}>
            <label className="block text-sm mb-1">Jogador {index + 1}</label>
            <input
              type="text"
              value={name}
              onChange={(e) => handlePlayerNameChange(index, e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/90 text-gray-900"
              placeholder={`Nome do Jogador ${index + 1}`}
            />
          </div>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        className="w-full px-6 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg text-lg transition-colors"
      >
        Iniciar Jogo
      </button>
    </div>
  );
}
