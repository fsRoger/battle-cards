import { Card, CardType } from "@/app/types/Game";

export const CARD_DATABASE: Omit<Card, "id">[] = [
  // Monstros
  {
    name: "Dragão de Fogo",
    type: CardType.MONSTER,
    attack: 8,
    defense: 6,
    element: "Fogo",
    effect: "Dano +2 contra Água",
    image: "dragao-de-fogo.jpg",
  },
  {
    name: "Sereia Aquática",
    type: CardType.MONSTER,
    attack: 6,
    defense: 8,
    element: "Água",
    effect: "Cura 2 HP ao entrar",
    image: "sereia-aquatica.jpg",
  },
  {
    name: "Golem de Pedra",
    type: CardType.MONSTER,
    attack: 7,
    defense: 9,
    element: "Terra",
    effect: "Defesa +2",
    image: "golem-de-pedra.jpg",
  },
  {
    name: "Fênix Celeste",
    type: CardType.MONSTER,
    attack: 7,
    defense: 5,
    element: "Vento",
    effect: "Revive uma vez",
    image: "fenix-celeste.jpg",
  },
  {
    name: "Cavaleiro da Luz",
    type: CardType.MONSTER,
    attack: 6,
    defense: 7,
    element: "Luz",
    effect: "Cura aliados em 1 HP",
    image: "cavaleiro-da-luz.jpg",
  },
  {
    name: "Demônio das Trevas",
    type: CardType.MONSTER,
    attack: 9,
    defense: 4,
    element: "Trevas",
    effect: "Ataque dobrado à noite",
    image: "demonio-das-trevas.jpg",
  },
  {
    name: "Tigre Flamejante",
    type: CardType.MONSTER,
    attack: 7,
    defense: 5,
    element: "Fogo",
    effect: "Velocidade +1",
    image: "tigre-flamejante.jpg",
  },
  {
    name: "Leviatã Marinho",
    type: CardType.MONSTER,
    attack: 8,
    defense: 7,
    element: "Água",
    effect: "Controla marés",
    image: "leviata-marinho.jpg",
  },
  {
    name: "Elfa da Floresta",
    type: CardType.MONSTER,
    attack: 5,
    defense: 6,
    element: "Terra",
    effect: "Cura com natureza",
    image: "elfa-da-floresta.jpg",
  },
  {
    name: "Águia Relâmpago",
    type: CardType.MONSTER,
    attack: 6,
    defense: 4,
    element: "Vento",
    effect: "Ataque primeiro",
    image: "aguia-relampago.jpg",
  },

  // Magias
  {
    name: "Bola de Fogo",
    type: CardType.SPELL,
    element: "Fogo",
    effect: "Causa 5 de dano",
    image: "bola-de-fogo.jpg",
  },
  {
    name: "Cura Divina",
    type: CardType.SPELL,
    element: "Luz",
    effect: "Restaura 8 HP",
    image: "cura-divina.jpg",
  },
  {
    name: "Tsunami",
    type: CardType.SPELL,
    element: "Água",
    effect: "Dano em área 4",
    image: "tsunami.jpg",
  },
  {
    name: "Terremoto",
    type: CardType.SPELL,
    element: "Terra",
    effect: "Destrói campo inimigo",
    image: "terremoto.jpg",
  },
  {
    name: "Tempestade",
    type: CardType.SPELL,
    element: "Vento",
    effect: "Devolve cartas à mão",
    image: "tempestade.jpg",
  },
  {
    name: "Maldição Sombria",
    type: CardType.SPELL,
    element: "Trevas",
    effect: "Reduz ATK em 3",
    image: "maldicao-sombria.jpg",
  },

  // Armadilhas
  {
    name: "Espelhos Mágicos",
    type: CardType.TRAP,
    effect: "Reflete próximo ataque",
    image: "espelhos-magicos.jpg",
  },
  {
    name: "Buraco Negro",
    type: CardType.TRAP,
    effect: "Destrói todas as cartas",
    image: "buraco-negro.jpg",
  },
  {
    name: "Escudo de Luz",
    type: CardType.TRAP,
    effect: "Anula dano mágico",
    image: "escudo-de-luz.jpg",
  },
  {
    name: "Contra-Ataque",
    type: CardType.TRAP,
    effect: "Dobra dano de retorno",
    image: "contra-ataque.jpg",
  },

  // Terrenos
  {
    name: "Vulcão Ativo",
    type: CardType.TERRAIN,
    element: "Fogo",
    effect: "Fogo +2 ATK",
    image: "vulcao-ativo.png",
  },
  {
    name: "Oceano Profundo",
    type: CardType.TERRAIN,
    element: "Água",
    effect: "Água +2 DEF",
    image: "oceano-profundo.jpg",
  },
  {
    name: "Floresta Antiga",
    type: CardType.TERRAIN,
    element: "Terra",
    effect: "Terra +1 ATK/DEF",
    image: "floresta-antiga.jpg",
  },
  {
    name: "Céu Tempestuoso",
    type: CardType.TERRAIN,
    element: "Vento",
    effect: "Vento +2 velocidade",
    image: "ceu-tempestuoso.jpg",
  },

  // Equipamentos
  {
    name: "Espada Flamejante",
    type: CardType.EQUIPMENT,
    element: "Fogo",
    effect: "+3 ATK",
    image: "espada-flamejante.jpg",
  },
  {
    name: "Armadura Aquática",
    type: CardType.EQUIPMENT,
    element: "Água",
    effect: "+3 DEF",
    image: "armadura-aquatica.jpg",
  },
  {
    name: "Botas Aladas",
    type: CardType.EQUIPMENT,
    element: "Vento",
    effect: "Ataque 2x",
    image: "botas-aladas.jpg",
  },
  {
    name: "Anel Sagrado",
    type: CardType.EQUIPMENT,
    element: "Luz",
    effect: "Proteção divina",
    image: "anel-sagrado.jpg",
  },
];

export function createDeck(): Card[] {
  return CARD_DATABASE.map((card, index) => ({
    ...card,
    id: `card-${index}-${Math.random().toString(36).substr(2, 9)}`,
  }));
}

export function shuffleDeck(deck: Card[]): Card[] {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function drawCards(
  deck: Card[],
  count: number
): { drawn: Card[]; remaining: Card[] } {
  const drawn = deck.slice(0, count);
  const remaining = deck.slice(count);
  return { drawn, remaining };
}
