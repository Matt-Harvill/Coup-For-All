import { socket } from "./socket.js";

const calloutButtonInfos = [
  {
    action: "Pass~",
    function: null,
  },
  {
    action: "Call Out~",
    function: null,
  },
];

const regularButtonInfos = [
  {
    action: "Income~",
    function: null,
  },
  {
    action: "Foreign Aid~",
    function: null,
  },
  {
    action: "Tax~",
    function: null,
  },
  {
    action: "Assassinate~",
    function: null,
  },
  {
    action: "Exchange~",
    function: null,
  },
  {
    action: "Steal~",
    function: null,
  },
  {
    action: "Coup~",
    function: null,
  },
  {
    action: "Action",
    function: action,
  },
  {
    action: "End Turn",
    function: endTurn,
  },
];

const endTurn = () => {
  socket.emit("coup", "endTurn");
};

const action = () => {
  socket.emit("coup", "action", "defaultAction", "defaultTarget");
};

export { calloutButtonInfos, regularButtonInfos, endTurn, action };
