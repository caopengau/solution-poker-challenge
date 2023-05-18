import { orderNumberBasedOnFrequencyAndDesc } from "../util";
import { getValuesAndSuits, determineRankAndOrderCards } from "../GameMaster";

describe("Order number based on frequency", () => {
  it("Should return ordered numbers based on frequency", () => {
    const orderedNumbers = orderNumberBasedOnFrequencyAndDesc([1, 1, 1, 2, 2, 3, 3]);
    expect(orderedNumbers).toEqual([1, 3, 2]);
  });

  it("Should return ordered numbers based on frequency", () => {
    const orderedNumbers = orderNumberBasedOnFrequencyAndDesc([1, 1, 1, 2, 2, 3, 3, 3]);
    expect(orderedNumbers).toEqual([3, 1, 2]);
  });
});

describe("Get values and suits", () => {
  it("Should return values and suits", () => {
    const { cardValues, cardSuits } = getValuesAndSuits([
      "2H",
      "3D",
      "4S",
      "5C",
      "6H",
    ]);
    expect(cardValues).toEqual([2, 3, 4, 5, 6]);
    expect(cardSuits).toEqual(["H", "D", "S", "C", "H"]);
  });

  it("Should return values and suits", () => {
    // T, J, Q, K, A
    const { cardValues, cardSuits } = getValuesAndSuits([
      "TH",
      "JD",
      "QS",
      "KC",
      "AH",
    ]);
    expect(cardValues).toEqual([10, 11, 12, 13, 14]);
    expect(cardSuits).toEqual(["H", "D", "S", "C", "H"]);
  });
});

describe("Determine rank and order", () => {
  it("Should return RoyalFlush 10", () => {
    const { rank, order } = determineRankAndOrderCards([
      "TH",
      "JH",
      "QH",
      "KH",
      "AH",
    ]);
    expect(rank).toBe(10);
    expect(order).toEqual([14, 13, 12, 11, 10]);
  });

  it("Should return StraightFlush 9", () => {
    const { rank, order } = determineRankAndOrderCards([
      "2H",
      "3H",
      "4H",
      "5H",
      "6H",
    ]);
    expect(rank).toBe(9);
    expect(order).toEqual([6, 5, 4, 3, 2]);
  });

  it("Should return FourOfAKind 8", () => {
    const { rank, order } = determineRankAndOrderCards([
      "2H",
      "2D",
      "2S",
      "2C",
      "6H",
    ]);
    expect(rank).toBe(8);
    expect(order).toEqual([2, 6]);
  });

  it("Should return FullHouse 7", () => {
    const { rank, order } = determineRankAndOrderCards([
      "2H",
      "2D",
      "2S",
      "6C",
      "6H",
    ]);
    expect(rank).toBe(7);
    expect(order).toEqual([2, 6]);
  });

  it("Should return Flush 6", () => {
    const { rank, order } = determineRankAndOrderCards([
      "2H",
      "3H",
      "4H",
      "5H",
      "7H",
    ]);
    expect(rank).toBe(6);
    expect(order).toEqual([7, 5, 4, 3, 2]);
  });

  it("Should return Straight 5", () => {
    const { rank, order } = determineRankAndOrderCards([
      "2H",
      "3D",
      "4S",
      "5C",
      "6H",
    ]);
    expect(rank).toBe(5);
    expect(order).toEqual([6, 5, 4, 3, 2]);
  });

  it("Should return ThreeOfAKind 4", () => {
    const { rank, order } = determineRankAndOrderCards([
      "2H",
      "2D",
      "2S",
      "5C",
      "6H",
    ]);
    expect(rank).toBe(4);
    expect(order).toEqual([2, 6, 5]);
  });

  it("Should return TwoPairs 3", () => {
    const { rank, order } = determineRankAndOrderCards([
      "2H",
      "2D",
      "3S",
      "3C",
      "6H",
    ]);
    expect(rank).toBe(3);
    expect(order).toEqual([3, 2, 6]);
  });

  it("Should return Pair 2", () => {
    const { rank, order } = determineRankAndOrderCards([
      "2H",
      "2D",
      "3S",
      "5C",
      "6H",
    ]);
    expect(rank).toBe(2);
    expect(order).toEqual([2, 6, 5, 3]);
  });

  it("Should return High card 1", () => {
    const { rank, order } = determineRankAndOrderCards([
      "2H",
      "3D",
      "5S",
      "9C",
      "KH",
    ]);
    expect(rank).toBe(1);
    expect(order).toEqual([13, 9, 5, 3, 2]);
  });
});
