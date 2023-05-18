import { GameMaster } from "./GameMaster";
import { Player } from "./Player";
import { splitFileContentByNewline, readFile } from "./util";

/**
 * Entry file.
 */
export const main = async () => {
  const fileContent = await readFile("./bin/poker-hands.txt");

  const allRoundsOfGame = splitFileContentByNewline(fileContent);

  const player1 = new Player();
  const player2 = new Player();
  const gameMaster = new GameMaster(player1, player2);

  allRoundsOfGame.forEach((eachRound: string) => {
    gameMaster.getRound(eachRound);

    gameMaster.determinePlayersRanksAndCardOrders();

    gameMaster.determineWinner();
  });
  gameMaster.report();
};

main();
