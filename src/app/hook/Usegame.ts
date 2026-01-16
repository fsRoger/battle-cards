import { useState, useCallback } from "react";
import { GameState, Player, Card, CardLocation } from "@/app/types/Game";
import { createDeck, shuffleDeck, drawCards } from "@/app/data/cards";

const INITIAL_HP = 30;
const INITIAL_HAND_SIZE = 5;
const FIELD_SIZE = 3;

export function useGame() {
  const [gameState, setGameState] = useState<GameState>({
    players: [],
    currentPlayerIndex: 0,
    gameStarted: false,
    selectedCard: null,
    log: [],
    winner: null,
    phase: "draw",
  });

  const [deck, setDeck] = useState<Card[]>([]);
  const [showTargetModal, setShowTargetModal] = useState(false);

  // 📝 Adiciona mensagem ao log
  const addLog = useCallback((message: string) => {
    setGameState((prev) => ({
      ...prev,
      log: [...prev.log, `${new Date().toLocaleTimeString()}: ${message}`],
    }));
  }, []);

  // 🎮 Inicia o jogo
  const startGame = useCallback((playerNames: string[]) => {
    const newDeck = shuffleDeck(createDeck());

    const players: Player[] = playerNames.map((name, index) => {
      const { drawn, remaining } = drawCards(newDeck, INITIAL_HAND_SIZE);
      newDeck.splice(0, newDeck.length, ...remaining);

      return {
        id: `player-${index}`,
        name,
        hp: INITIAL_HP,
        hand: drawn,
        deck: remaining,
        field: {
          monsters: Array(FIELD_SIZE).fill(null),
          spells: Array(FIELD_SIZE).fill(null),
          terrain: null,
          graveyard: [],
        },
        defeated: false,
      };
    });

    setDeck(newDeck);
    setGameState({
      players,
      currentPlayerIndex: 0,
      gameStarted: true,
      selectedCard: null,
      log: [`Jogo iniciado! ${players[0].name} começa!`],
      winner: null,
      phase: "draw",
    });
  }, []);

  // 🔍 Obtém o jogador atual
  const getCurrentPlayer = useCallback(() => {
    return gameState.players[gameState.currentPlayerIndex];
  }, [gameState]);

  // 🃏 Seleciona uma carta
  const selectCard = useCallback(
    (playerId: string, location: CardLocation, index: number) => {
      const currentPlayer = getCurrentPlayer();

      if (!currentPlayer || currentPlayer.id !== playerId) {
        addLog("Não é seu turno!");
        return;
      }

      setGameState((prev) => ({
        ...prev,
        selectedCard: {
          playerId,
          location,
          index,
        },
      }));
    },
    [getCurrentPlayer, addLog]
  );

  const nextPhase = useCallback(() => {
    setGameState((prev) => {
      const order: ("draw" | "main" | "battle" | "end")[] = [
        "draw",
        "main",
        "battle",
        "end",
      ];
      const currentIndex = order.indexOf(prev.phase);
      let next = order[(currentIndex + 1) % order.length];

      let nextPlayerIndex = prev.currentPlayerIndex;
      if (prev.phase === "end") {
        nextPlayerIndex = (prev.currentPlayerIndex + 1) % prev.players.length;
      }

      addLog(`Mudando para fase: ${next}`);
      return {
        ...prev,
        currentPlayerIndex: nextPlayerIndex,
        phase: next,
        selectedCard: null,
      };
    });
  }, [addLog]);
  // 🪄 Joga uma carta da mão para o campo
  const playCardToField = useCallback(
    (
      zone: "monsters" | "spells" | "terrain",
      index?: number,
      position: "attack" | "defense" = "attack"
    ) => {
      setGameState((prev) => {
        const selected = prev.selectedCard;
        if (!selected || selected.location !== "hand") {
          addLog("Selecione uma carta da mão");
          return prev;
        }

        const playerIndex = prev.currentPlayerIndex;
        const player = structuredClone(prev.players[playerIndex]);
        const card = player.hand[selected.index!];

        if (!card) return prev;

        // Limite de campo
        const total =
          player.field.monsters.filter(Boolean).length +
          player.field.spells.filter(Boolean).length +
          (player.field.terrain ? 1 : 0);

        if (total >= 7) {
          addLog("Limite de cartas no campo atingido");
          return prev;
        }

        // Valida slot
        if (zone === "terrain") {
          if (player.field.terrain) {
            addLog("Já existe um terreno");
            return prev;
          }
          player.field.terrain = {
            card,
            faceDown: false,
          };
        } else {
          if (index === undefined) return prev;
          if (player.field[zone][index]) {
            addLog("Este espaço está ocupado");
            return prev;
          }

          player.field[zone][index] = {
            card,
            faceDown: zone !== "monsters",
            position: zone === "monsters" ? position : undefined,
          };
        }

        player.hand.splice(selected.index!, 1);

        const players = [...prev.players];
        players[playerIndex] = player;

        addLog(`${player.name} colocou ${card.name} no campo`);

        return {
          ...prev,
          players,
          selectedCard: null,
        };
      });
    },
    [addLog]
  );

  // 🗡️ Ataque entre cartas ou direto ao jogador
  const attackCard = useCallback(
    (targetPlayerId: string, targetIndex: number) => {
      const selected = gameState.selectedCard;
      if (!selected || selected.location !== "monsters") {
        addLog("Selecione um monstro");
        return;
      }

      const attacker = getCurrentPlayer()?.field.monsters[selected.index!];

      if (!attacker || attacker.faceDown || !attacker.card.attack) {
        addLog("Este monstro não pode atacar");
        return;
      }

      setGameState((prev) => {
        const players = structuredClone(prev.players);
        const attackerPlayer = players[prev.currentPlayerIndex];
        const targetPlayer = players.find((p) => p.id === targetPlayerId)!;
        const defender = targetPlayer.field.monsters[targetIndex];

        if (!defender) {
          targetPlayer.hp -= attacker.card.attack!;
        } else {
          const damage =
            attacker.card.attack! -
            (defender.position === "defense"
              ? defender.card.defense ?? 0
              : defender.card.attack ?? 0);

          if (damage > 0) {
            targetPlayer.field.monsters[targetIndex] = null;
            targetPlayer.hp -= damage;
          } else if (damage < 0) {
            attackerPlayer.field.monsters[selected.index!] = null;
            attackerPlayer.hp -= Math.abs(damage);
          } else {
            attackerPlayer.field.monsters[selected.index!] = null;
            targetPlayer.field.monsters[targetIndex] = null;
          }
        }

        return {
          ...prev,
          players,
          selectedCard: null,
        };
      });
    },
    [gameState, getCurrentPlayer, addLog]
  );

  const destroyCard = useCallback(
    (playerId: string, zone: "monsters" | "spells", index: number) => {
      setGameState((prev) => {
        const newPlayers = [...prev.players];
        const pIndex = newPlayers.findIndex((p) => p.id === playerId);
        const player = { ...newPlayers[pIndex] };
        const slot = player.field[zone][index];

        if (slot) {
          player.field[zone][index] = null;
          player.field.graveyard.push(slot.card);
        }

        newPlayers[pIndex] = player;
        return { ...prev, players: newPlayers };
      });
    },
    []
  );

  // 🪄 Compra uma carta do deck
  const drawCard = useCallback(() => {
    const currentPlayer = getCurrentPlayer();
    if (!currentPlayer) return;

    if (deck.length === 0) {
      addLog("O deck está vazio!");
      return;
    }

    const { drawn, remaining } = drawCards(deck, 1);
    setDeck(remaining);

    setGameState((prev) => {
      const newPlayers = [...prev.players];
      const playerIndex = prev.currentPlayerIndex;
      const player = { ...newPlayers[playerIndex] };

      player.hand = [...player.hand, ...drawn];
      newPlayers[playerIndex] = player;

      return {
        ...prev,
        players: newPlayers,
      };
    });

    addLog(`${currentPlayer.name} comprou ${drawn[0].name}`);
  }, [deck, getCurrentPlayer, addLog]);

  // 🔁 Finaliza turno
  const endTurn = useCallback(() => {
    const currentPlayer = getCurrentPlayer();
    if (!currentPlayer) return;

    let nextIndex =
      (gameState.currentPlayerIndex + 1) % gameState.players.length;

    // Pula derrotados
    let attempts = 0;
    while (
      gameState.players[nextIndex].defeated &&
      attempts < gameState.players.length
    ) {
      nextIndex = (nextIndex + 1) % gameState.players.length;
      attempts++;
    }

    setGameState((prev) => ({
      ...prev,
      currentPlayerIndex: nextIndex,
      selectedCard: null,
    }));

    addLog(`Turno de ${gameState.players[nextIndex].name}`);
  }, [gameState, getCurrentPlayer, addLog]);

  // 🧍‍♂️ Ataque direto (quando clica no jogador no modal)
  const attackPlayer = useCallback(
    (targetId: string) => {
      const currentPlayer = getCurrentPlayer();
      const selected = gameState.selectedCard;

      if (
        !currentPlayer ||
        !selected ||
        selected.location !== "monsters" ||
        selected.index === undefined
      ) {
        addLog("Selecione um monstro para atacar!");
        return;
      }

      // Pega o array correto do field

      const attackSlot = currentPlayer.field.monsters[selected.index!];
      const attackCard = attackSlot?.card;

      if (!attackCard || attackCard.attack === undefined) {
        addLog("Esta carta não pode atacar!");
        return;
      }

      setGameState((prev) => {
        const newPlayers = [...prev.players];
        const targetIndex = newPlayers.findIndex((p) => p.id === targetId);
        const target = { ...newPlayers[targetIndex] };

        target.hp = Math.max(0, target.hp - attackCard.attack!);
        if (target.hp === 0) target.defeated = true;

        newPlayers[targetIndex] = target;

        const playersAlive = newPlayers.filter((p) => !p.defeated);
        const winner = playersAlive.length === 1 ? playersAlive[0].name : null;

        return {
          ...prev,
          players: newPlayers,
          selectedCard: null,
          winner,
        };
      });

      addLog(
        `${currentPlayer.name} atacou ${
          gameState.players.find((p) => p.id === targetId)?.name
        } com ${attackCard.name} causando ${attackCard.attack} de dano!`
      );
    },
    [gameState, getCurrentPlayer, addLog]
  );

  // ⚔️ Inicia fase de ataque (abre modal)
  const initiateAttack = useCallback(() => {
    if (
      !gameState.selectedCard ||
      gameState.selectedCard.location !== "monsters"
    ) {
      addLog("Selecione um monstro para atacar!");
      return;
    }

    setShowTargetModal(true);
  }, [gameState, addLog]);

  // 🔄 Reinicia o jogo
  const resetGame = useCallback(() => {
    setGameState({
      players: [],
      currentPlayerIndex: 0,
      gameStarted: false,
      selectedCard: null,
      log: [],
      winner: null,
      phase: "draw",
    });
    setDeck([]);
    setShowTargetModal(false);
  }, []);

  // ✅ Retorna todas as funções e estado
  return {
    gameState,
    selectedCard: gameState.selectedCard,
    showTargetModal,
    setShowTargetModal,
    startGame,
    selectCard,
    playCardToField,
    attackCard, // ✅ novo
    drawCard,
    endTurn,
    attackPlayer,
    initiateAttack,
    resetGame,
    getCurrentPlayer,
    nextPhase,
  };
}
