export enum CardType {
  MONSTER = "Monstro",
  SPELL = "Magia",
  TRAP = "Armadilha",
  TERRAIN = "Terreno",
  EQUIPMENT = "Equipamento",
}

export type CardPosition = "attack" | "defense";
export type Element = "Fogo" | "Água" | "Terra" | "Vento" | "Luz" | "Trevas";
export type Phase = "draw" | "main" | "battle" | "end";

export interface Card {
  id: string;
  name: string;
  type: CardType;
  attack?: number;
  defense?: number;
  element?: Element;
  effect?: string;
  image?: string;
}
export type CardLocation = "hand" | "monsters" | "spells" | "terrain";

export interface FieldSlot {
  card: Card;
  faceDown: boolean;
  position?: CardPosition;
}

export interface PlayerField {
  monsters: Array<FieldSlot | null>; // 3
  spells: Array<FieldSlot | null>; // 3
  terrain: FieldSlot | null; // 1
  graveyard: Card[];
}

export interface Player {
  id: string;
  name: string;
  hp: number;
  hand: Card[];
  deck: Card[];
  defeated: boolean;
  field: PlayerField;
}

export interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  gameStarted: boolean;
  selectedCard: {
    playerId: string;
    location: "hand" | "monsters" | "spells" | "terrain";
    index: number;
  } | null;
  log: string[];
  winner: string | null;
  phase: Phase;
}
