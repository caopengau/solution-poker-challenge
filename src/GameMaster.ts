import { Player } from "./Player";
import { orderNumberBasedOnFrequencyAndDesc } from "./util";

/* 
The keys of the object are the card symbols (2, 3, 4, ..., T, J, Q, K, A)
The values are the corresponding numerical values (2, 3, 4, ..., 10, 11, 12, 13, 14)
for comparison.
*/
const cardSymbolToValueMap = {
  "2": 2,
  "3": 3,
  "4": 4,
  "5": 5,
  "6": 6,
  "7": 7,
  "8": 8,
  "9": 9,
  T: 10,
  J: 11,
  Q: 12,
  K: 13,
  A: 14,
};

/* 
The possible ranks of a poker hand, with each rank having a corresponding numeric value
for comparison. 
*/
enum RankValueMap {
  HighCard = 1, // Highest value card
  Pair = 2, // Two cards of same value
  TwoPairs = 3, // Two different pairs
  ThreeOfAKind = 4, // Three cards of the same value
  Straight = 5, // All five cards in consecutive value order
  Flush = 6, // All five cards having the same suit
  FullHouse = 7, // Three of a kind and a Pair
  FourOfAKind = 8, // Four cards of the same value
  StraightFlush = 9, // All five cards in consecutive value order, with the same suit
  RoyalFlush = 10, // Ten, Jack, Queen, King and Ace in the same suit
}

export const getValuesAndSuits = (cards: string[]) => {
  const cardValues = cards.map(
    (card) => cardSymbolToValueMap[card[0] as keyof typeof cardSymbolToValueMap]
  );
  const cardSuits = cards.map((card) => card[1]);
  return { cardValues, cardSuits };
};

export const determineRankAndOrderCards = (cards: string[]) => {
  const { cardValues, cardSuits } = getValuesAndSuits(cards);
  const isFlush = cardSuits.every((suit) => suit === cardSuits[0]);
  // sort cardValues and check for consecutive values
  const isStraight = cardValues
    .sort((a, b) => a - b)
    .every((value, index, array) => {
      if (index === 0) return true;
      return value - array[index - 1] === 1;
    });
  const order = cardValues.sort((a, b) => b - a);

  const isRoyalFlush =
    isFlush && isStraight && Math.min(...cardValues) === cardSymbolToValueMap.T;

  if (isRoyalFlush)
    return {
      rank: RankValueMap.RoyalFlush,
      order,
    };

  if (isFlush && isStraight)
    return {
      rank: RankValueMap.StraightFlush,
      order,
    };

  const isFourOfAKind = cardValues.some(
    (value) => cardValues.filter((v) => v === value).length === 4
  );
  if (isFourOfAKind)
    return {
      rank: RankValueMap.FourOfAKind,
      order: orderNumberBasedOnFrequencyAndDesc(order),
    };

  const isThreeOfAKind = cardValues.some(
    (value) => cardValues.filter((v) => v === value).length === 3
  );
  const isPair = cardValues.some(
    (value) => cardValues.filter((v) => v === value).length === 2
  );
  if (isThreeOfAKind && isPair)
    return {
      rank: RankValueMap.FullHouse,
      order: orderNumberBasedOnFrequencyAndDesc(order),
    };

  if (isFlush)
    return {
      rank: RankValueMap.Flush,
      order,
    };

  if (isStraight)
    return {
      rank: RankValueMap.Straight,
      order,
    };

  if (isThreeOfAKind)
    return {
      rank: RankValueMap.ThreeOfAKind,
      order: orderNumberBasedOnFrequencyAndDesc(order),
    };

  const pairs = cardValues.filter(
    (value) => cardValues.filter((v) => v === value).length === 2
  );
  const uniquePairs = [...new Set(pairs)];
  if (uniquePairs.length === 2)
    return {
      rank: RankValueMap.TwoPairs,
      order: orderNumberBasedOnFrequencyAndDesc(order),
    };

  if (isPair)
    return {
      rank: RankValueMap.Pair,
      order: orderNumberBasedOnFrequencyAndDesc(order),
    };

  return {
    rank: RankValueMap.HighCard,
    order,
  };
};

export class GameMaster {
  private player1: Player;

  private player2: Player;

  round: string[] = [];

  constructor(player1: Player, player2: Player) {
    this.player1 = player1;
    this.player2 = player2;
  }

  getRound(eachRound: string) {
    const cards = eachRound.split(" ");
    this.player1.currentHands = cards.slice(0, 5);
    this.player2.currentHands = cards.slice(5, 10);
  }

  determinePlayersRanksAndCardOrders() {
    const player1 = determineRankAndOrderCards(this.player1.currentHands);
    const player2 = determineRankAndOrderCards(this.player2.currentHands);
    this.player1.currentRank = player1.rank;
    this.player1.currentCardOrder = player1.order;
    this.player2.currentRank = player2.rank;
    this.player2.currentCardOrder = player2.order;
  }

  determineWinner() {
    if (this.player1.currentRank > this.player2.currentRank) {
      this.player1.wins += 1;
    } else if (this.player1.currentRank < this.player2.currentRank) {
      this.player2.wins += 1;
    } else {
      let player1WinsByOrder = false;

      for (let i = 0; i < this.player1.currentCardOrder.length; i += 1) {
        if (
          this.player1.currentCardOrder[i] > this.player2.currentCardOrder[i]
        ) {
          player1WinsByOrder = true;
          break;
        } else if (
          this.player1.currentCardOrder[i] < this.player2.currentCardOrder[i]
        ) {
          break;
        }
      }
      // assume if the ranks are the same, the order is the same, player2 wins by default
      if (player1WinsByOrder) {
        this.player1.wins += 1;
      } else {
        this.player2.wins += 1;
      }
    }
  }

  report() {
    console.log(`Player 1 wins ${this.player1.wins} hands`);
    console.log(`Player 2 wins ${this.player2.wins} hands`);
  }
}
