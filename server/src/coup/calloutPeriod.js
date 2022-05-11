import { getGame } from "../utils/dbUtils.js";
import { getSocket } from "../utils/socketUtils.js";
import { inProgressGameStatuses, nextTurn } from "./nextTurn.js";

// Store the inProgress games' statuses (mapped by gameID)
export const calloutStatuses = {};

const endCallout = (game) => {
    const gameID = game.gameID
    // Clear the interval
    clearInterval(calloutStatuses[gameID].interval);
    // Reset the game status object
    calloutStatuses[gameID].interval = null;
    calloutStatuses[gameID].calloutTime = 0;
    calloutStatuses[gameID].needToDecide = [];

    // Continue the activePlayer's turn (reset turnTime to 10000 to give some time to complete turn)
    inProgressGameStatuses[gameID].turnTime = 10000
    nextTurn(game, gameID);
}

const startCallout = (game) => {
    const gameID = game.gameID
    // Update callout status
    calloutStatuses[gameID] = {
        calloutTime: 10000, // 10s for a callout
        interval: null,
        needToDecide: [...game.players] // Clone the players array (will be edited)
    };

    let calloutTime = calloutStatuses[gameID].calloutTime
    const updatePeriod = 100; // Update every 100ms

    const updateCalloutTime = setInterval(async () => {
        // Update them with time remaining in the turn
        for (const player of game.players) {
            const socket = getSocket(player); // Get all the sockets of players in the game
            if (socket) {
                socket.emit(
                    "coup",
                    "timeInCallout",
                    gameID,
                    calloutStatuses[gameID].needToDecide,
                    calloutTime / 1000 // Send the time remaining in seconds
                );
            }
        }

        calloutTime -= updatePeriod;
        calloutStatuses[gameID].calloutTime = updateCalloutTime;

        if (calloutTime === 0) {
            endCallout(game);
        }
    }, updatePeriod);

    calloutStatuses[gameID].interval = updateCalloutTime; // Sets interval after interval declared
}

export const startCalloutPeriod = async (user, game) => {
    if (user) {
        game = await getGame(user.gameTitle, user.gameID);
    }

    const gameID = game.gameID;

    if (!user || inProgressGameStatuses[gameID].activePlayer === user.username) {
        // Clear the interval
        clearInterval(inProgressGameStatuses[gameID].interval);
        // Reset the game status object's interval (but not the calloutTime)
        inProgressGameStatuses[gameID].interval = null;

        startCallout(game);
    }
};
