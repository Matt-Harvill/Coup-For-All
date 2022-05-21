import { endStage, setTurn, startNewStage } from "./inProgressTurns.js";
import { getGame } from "../utils/dbUtils.js";
import { shuffleArray } from "../utils/shuffleArray.js";

export const postCalloutExchange = async (game) => {
  // Start postCallout stage
  setTurn(game, { stage: "postCallout" });
  startNewStage(game);

  // Shuffle the availableRoles
  shuffleArray(game.availRoles);
  // First two roles will be exchangeRoles -> Should always be at least two roles
  const exchangeRoles = game.availRoles.slice(0, 2);
  // Set the turn's exchangeRoles
  setTurn(game, { exchangeRoles: exchangeRoles });
};

export const preCalloutExchange = async (user) => {
  const game = await getGame(user.gameTitle, user.gameID);

  if (game) {
    const otherPlayers = game.players.filter(
      (player) => player !== user.username
    );

    // Update the action to exchange, add player as a target, update deciding to be other players
    setTurn(game, {
      action: "exchange",
      targets: [
        { target: user.username, action: "exchange", attacking: "none" },
      ],
      deciding: otherPlayers,
    });

    // End the preCallout stage for exchange
    endStage(game);
  }
};
