import { shuffleArray } from "../utils/shuffleArray.js";

const startingPStat = {
  player: null,
  points: 0,
  permanentResources: {
    green: 0,
    blue: 0,
    red: 0,
    black: 0,
    white: 0,
  },
  coins: {
    green: 0,
    blue: 0,
    red: 0,
    black: 0,
    white: 0,
    yellow: 0,
  },
  cardsInHand: [],
  cardsOwned: [],
};

export const getNewPStat = (username) => {
  const pStatCopy = JSON.parse(JSON.stringify(startingPStat));
  pStatCopy.player = username;
  return pStatCopy;
};

const allLevel1Cards = [
  {
    points: 0,
    resource: {
      color: "red",
      count: 1,
    },
    requirements: {
      green: 1,
      blue: 1,
      red: 0,
      black: 1,
      white: 1,
    },
  },
  {
    points: 0,
    resource: {
      color: "red",
      count: 1,
    },
    requirements: {
      green: 0,
      blue: 0,
      red: 1,
      black: 3,
      white: 1,
    },
  },
  {
    points: 0,
    resource: {
      color: "red",
      count: 1,
    },
    requirements: {
      green: 1,
      blue: 1,
      red: 0,
      black: 1,
      white: 2,
    },
  },
  {
    points: 0,
    resource: {
      color: "blue",
      count: 1,
    },
    requirements: {
      green: 1,
      blue: 0,
      red: 2,
      black: 1,
      white: 1,
    },
  },
  {
    points: 0,
    resource: {
      color: "green",
      count: 1,
    },
    requirements: {
      green: 1,
      blue: 3,
      red: 0,
      black: 0,
      white: 1,
    },
  },
  {
    points: 0,
    resource: {
      color: "green",
      count: 1,
    },
    requirements: {
      green: 0,
      blue: 2,
      red: 2,
      black: 0,
      white: 0,
    },
  },
  {
    points: 0,
    resource: {
      color: "green",
      count: 1,
    },
    requirements: {
      green: 0,
      blue: 1,
      red: 0,
      black: 0,
      white: 2,
    },
  },
  {
    points: 0,
    resource: {
      color: "black",
      count: 1,
    },
    requirements: {
      green: 2,
      blue: 0,
      red: 1,
      black: 0,
      white: 0,
    },
  },
  {
    points: 0,
    resource: {
      color: "black",
      count: 1,
    },
    requirements: {
      green: 1,
      blue: 1,
      red: 1,
      black: 0,
      white: 1,
    },
  },
  {
    points: 0,
    resource: {
      color: "black",
      count: 1,
    },
    requirements: {
      green: 2,
      blue: 0,
      red: 0,
      black: 0,
      white: 2,
    },
  },
  {
    points: 0,
    resource: {
      color: "white",
      count: 1,
    },
    requirements: {
      green: 2,
      blue: 1,
      red: 1,
      black: 1,
      white: 0,
    },
  },
  {
    points: 0,
    resource: {
      color: "blue",
      count: 1,
    },
    requirements: {
      green: 3,
      blue: 1,
      red: 1,
      black: 0,
      white: 0,
    },
  },
  {
    points: 1,
    resource: {
      color: "white",
      count: 1,
    },
    requirements: {
      green: 4,
      blue: 0,
      red: 0,
      black: 0,
      white: 0,
    },
  },
  {
    points: 0,
    resource: {
      color: "blue",
      count: 1,
    },
    requirements: {
      green: 0,
      blue: 0,
      red: 0,
      black: 2,
      white: 1,
    },
  },
  {
    points: 0,
    resource: {
      color: "red",
      count: 1,
    },
    requirements: {
      green: 0,
      blue: 0,
      red: 2,
      black: 0,
      white: 2,
    },
  },
  {
    points: 0,
    resource: {
      color: "red",
      count: 1,
    },
    requirements: {
      green: 1,
      blue: 0,
      red: 0,
      black: 2,
      white: 2,
    },
  },
  {
    points: 0,
    resource: {
      color: "black",
      count: 1,
    },
    requirements: {
      green: 1,
      blue: 2,
      red: 1,
      black: 0,
      white: 1,
    },
  },
  {
    points: 0,
    resource: {
      color: "black",
      count: 1,
    },
    requirements: {
      green: 0,
      blue: 2,
      red: 1,
      black: 0,
      white: 2,
    },
  },
  {
    points: 0,
    resource: {
      color: "white",
      count: 1,
    },
    requirements: {
      green: 0,
      blue: 0,
      red: 2,
      black: 1,
      white: 0,
    },
  },
  {
    points: 0,
    resource: {
      color: "blue",
      count: 1,
    },
    requirements: {
      green: 2,
      blue: 0,
      red: 2,
      black: 0,
      white: 1,
    },
  },
  {
    points: 0,
    resource: {
      color: "blue",
      count: 1,
    },
    requirements: {
      green: 0,
      blue: 0,
      red: 0,
      black: 3,
      white: 0,
    },
  },
  {
    points: 0,
    resource: {
      color: "green",
      count: 1,
    },
    requirements: {
      green: 0,
      blue: 1,
      red: 2,
      black: 2,
      white: 0,
    },
  },
  {
    points: 0,
    resource: {
      color: "white",
      count: 1,
    },
    requirements: {
      green: 2,
      blue: 2,
      red: 0,
      black: 1,
      white: 0,
    },
  },
  {
    points: 1,
    resource: {
      color: "blue",
      count: 1,
    },
    requirements: {
      green: 0,
      blue: 0,
      red: 4,
      black: 0,
      white: 0,
    },
  },
  {
    points: 0,
    resource: {
      color: "green",
      count: 1,
    },
    requirements: {
      green: 0,
      blue: 1,
      red: 1,
      black: 1,
      white: 1,
    },
  },
  {
    points: 0,
    resource: {
      color: "green",
      count: 1,
    },
    requirements: {
      green: 0,
      blue: 1,
      red: 1,
      black: 2,
      white: 1,
    },
  },
  {
    points: 1,
    resource: {
      color: "green",
      count: 1,
    },
    requirements: {
      green: 0,
      blue: 0,
      red: 0,
      black: 4,
      white: 0,
    },
  },
  {
    points: 0,
    resource: {
      color: "black",
      count: 1,
    },
    requirements: {
      green: 1,
      blue: 0,
      red: 3,
      black: 1,
      white: 0,
    },
  },
  {
    points: 0,
    resource: {
      color: "red",
      count: 1,
    },
    requirements: {
      green: 1,
      blue: 2,
      red: 0,
      black: 0,
      white: 0,
    },
  },
  {
    points: 0,
    resource: {
      color: "white",
      count: 1,
    },
    requirements: {
      green: 1,
      blue: 1,
      red: 1,
      black: 1,
      white: 0,
    },
  },
  {
    points: 0,
    resource: {
      color: "white",
      count: 1,
    },
    requirements: {
      green: 0,
      blue: 3,
      red: 0,
      black: 0,
      white: 0,
    },
  },
  {
    points: 0,
    resource: {
      color: "red",
      count: 1,
    },
    requirements: {
      green: 0,
      blue: 0,
      red: 0,
      black: 0,
      white: 3,
    },
  },
  {
    points: 0,
    resource: {
      color: "white",
      count: 1,
    },
    requirements: {
      green: 0,
      blue: 1,
      red: 0,
      black: 1,
      white: 3,
    },
  },
  {
    points: 0,
    resource: {
      color: "black",
      count: 1,
    },
    requirements: {
      green: 3,
      blue: 0,
      red: 0,
      black: 0,
      white: 0,
    },
  },
  {
    points: 0,
    resource: {
      color: "green",
      count: 1,
    },
    requirements: {
      green: 0,
      blue: 0,
      red: 3,
      black: 0,
      white: 0,
    },
  },
  {
    points: 1,
    resource: {
      color: "red",
      count: 1,
    },
    requirements: {
      green: 0,
      blue: 0,
      red: 0,
      black: 0,
      white: 4,
    },
  },
  {
    points: 1,
    resource: {
      color: "black",
      count: 1,
    },
    requirements: {
      green: 0,
      blue: 4,
      red: 0,
      black: 0,
      white: 0,
    },
  },
  {
    points: 0,
    resource: {
      color: "white",
      count: 1,
    },
    requirements: {
      green: 0,
      blue: 2,
      red: 0,
      black: 2,
      white: 0,
    },
  },
  {
    points: 0,
    resource: {
      color: "blue",
      count: 1,
    },
    requirements: {
      green: 1,
      blue: 0,
      red: 1,
      black: 1,
      white: 1,
    },
  },
  {
    points: 0,
    resource: {
      color: "blue",
      count: 1,
    },
    requirements: {
      green: 2,
      blue: 0,
      red: 0,
      black: 2,
      white: 0,
    },
  },
];

export const getNewLevel1Cards = () => {
  const level1CardsCopy = JSON.parse(JSON.stringify(allLevel1Cards));
  shuffleArray(level1CardsCopy);
  return level1CardsCopy;
};

const allLevel2Cards = [
  {
    points: 2,
    resource: {
      color: "green",
      count: 1,
    },
    requirements: {
      green: 5,
      blue: 0,
      red: 0,
      black: 0,
      white: 0,
    },
  },
  {
    points: 2,
    resource: {
      color: "black",
      count: 1,
    },
    requirements: {
      green: 5,
      blue: 0,
      red: 3,
      black: 0,
      white: 0,
    },
  },
  {
    points: 1,
    resource: {
      color: "blue",
      count: 1,
    },
    requirements: {
      green: 3,
      blue: 2,
      red: 0,
      black: 3,
      white: 0,
    },
  },
  {
    points: 2,
    resource: {
      color: "red",
      count: 1,
    },
    requirements: {
      green: 0,
      blue: 0,
      red: 0,
      black: 5,
      white: 3,
    },
  },
  {
    points: 3,
    resource: {
      color: "green",
      count: 1,
    },
    requirements: {
      green: 6,
      blue: 0,
      red: 0,
      black: 0,
      white: 0,
    },
  },
  {
    points: 1,
    resource: {
      color: "white",
      count: 1,
    },
    requirements: {
      green: 0,
      blue: 3,
      red: 3,
      black: 0,
      white: 2,
    },
  },
  {
    points: 2,
    resource: {
      color: "white",
      count: 1,
    },
    requirements: {
      green: 0,
      blue: 0,
      red: 5,
      black: 3,
      white: 0,
    },
  },
  {
    points: 3,
    resource: {
      color: "blue",
      count: 1,
    },
    requirements: {
      green: 0,
      blue: 6,
      red: 0,
      black: 0,
      white: 0,
    },
  },
  {
    points: 1,
    resource: {
      color: "black",
      count: 1,
    },
    requirements: {
      green: 2,
      blue: 2,
      red: 0,
      black: 0,
      white: 3,
    },
  },
  {
    points: 3,
    resource: {
      color: "black",
      count: 1,
    },
    requirements: {
      green: 0,
      blue: 0,
      red: 0,
      black: 6,
      white: 0,
    },
  },
  {
    points: 1,
    resource: {
      color: "blue",
      count: 1,
    },
    requirements: {
      green: 2,
      blue: 2,
      red: 3,
      black: 0,
      white: 0,
    },
  },
  {
    points: 1,
    resource: {
      color: "green",
      count: 1,
    },
    requirements: {
      green: 0,
      blue: 3,
      red: 0,
      black: 2,
      white: 2,
    },
  },
  {
    points: 2,
    resource: {
      color: "white",
      count: 1,
    },
    requirements: {
      green: 0,
      blue: 0,
      red: 5,
      black: 0,
      white: 0,
    },
  },
  {
    points: 2,
    resource: {
      color: "green",
      count: 1,
    },
    requirements: {
      green: 0,
      blue: 2,
      red: 0,
      black: 1,
      white: 4,
    },
  },
  {
    points: 2,
    resource: {
      color: "green",
      count: 1,
    },
    requirements: {
      green: 3,
      blue: 5,
      red: 0,
      black: 0,
      white: 0,
    },
  },
  {
    points: 2,
    resource: {
      color: "blue",
      count: 1,
    },
    requirements: {
      green: 0,
      blue: 3,
      red: 0,
      black: 0,
      white: 5,
    },
  },
  {
    points: 2,
    resource: {
      color: "red",
      count: 1,
    },
    requirements: {
      green: 0,
      blue: 0,
      red: 0,
      black: 5,
      white: 0,
    },
  },
  {
    points: 2,
    resource: {
      color: "blue",
      count: 1,
    },
    requirements: {
      green: 0,
      blue: 0,
      red: 1,
      black: 4,
      white: 2,
    },
  },
  {
    points: 2,
    resource: {
      color: "red",
      count: 1,
    },
    requirements: {
      green: 2,
      blue: 4,
      red: 0,
      black: 0,
      white: 1,
    },
  },
  {
    points: 2,
    resource: {
      color: "black",
      count: 1,
    },
    requirements: {
      green: 4,
      blue: 1,
      red: 2,
      black: 0,
      white: 0,
    },
  },
  {
    points: 1,
    resource: {
      color: "white",
      count: 1,
    },
    requirements: {
      green: 3,
      blue: 0,
      red: 2,
      black: 2,
      white: 0,
    },
  },
  {
    points: 1,
    resource: {
      color: "red",
      count: 1,
    },
    requirements: {
      green: 0,
      blue: 0,
      red: 2,
      black: 3,
      white: 2,
    },
  },
  {
    points: 2,
    resource: {
      color: "blue",
      count: 1,
    },
    requirements: {
      green: 0,
      blue: 5,
      red: 0,
      black: 0,
      white: 0,
    },
  },
  {
    points: 2,
    resource: {
      color: "white",
      count: 1,
    },
    requirements: {
      green: 1,
      blue: 0,
      red: 4,
      black: 2,
      white: 0,
    },
  },
  {
    points: 1,
    resource: {
      color: "red",
      count: 1,
    },
    requirements: {
      green: 0,
      blue: 3,
      red: 2,
      black: 3,
      white: 0,
    },
  },
  {
    points: 2,
    resource: {
      color: "black",
      count: 1,
    },
    requirements: {
      green: 0,
      blue: 0,
      red: 0,
      black: 0,
      white: 5,
    },
  },
  {
    points: 3,
    resource: {
      color: "white",
      count: 1,
    },
    requirements: {
      green: 0,
      blue: 0,
      red: 0,
      black: 0,
      white: 6,
    },
  },
  {
    points: 1,
    resource: {
      color: "green",
      count: 1,
    },
    requirements: {
      green: 2,
      blue: 0,
      red: 3,
      black: 0,
      white: 3,
    },
  },
  {
    points: 1,
    resource: {
      color: "black",
      count: 1,
    },
    requirements: {
      green: 3,
      blue: 0,
      red: 0,
      black: 2,
      white: 3,
    },
  },
  {
    points: 3,
    resource: {
      color: "red",
      count: 1,
    },
    requirements: {
      green: 0,
      blue: 0,
      red: 6,
      black: 0,
      white: 0,
    },
  },
];

export const getNewLevel2Cards = () => {
  const level2CardsCopy = JSON.parse(JSON.stringify(allLevel2Cards));
  shuffleArray(level2CardsCopy);
  return level2CardsCopy;
};

const allLevel3Cards = [
  {
    points: 4,
    resource: {
      color: "green",
      count: 1,
    },
    requirements: {
      green: 0,
      blue: 7,
      red: 0,
      black: 0,
      white: 0,
    },
  },
  {
    points: 3,
    resource: {
      color: "blue",
      count: 1,
    },
    requirements: {
      green: 3,
      blue: 0,
      red: 3,
      black: 5,
      white: 3,
    },
  },
  {
    points: 4,
    resource: {
      color: "red",
      count: 1,
    },
    requirements: {
      green: 6,
      blue: 3,
      red: 3,
      black: 0,
      white: 0,
    },
  },
  {
    points: 4,
    resource: {
      color: "white",
      count: 1,
    },
    requirements: {
      green: 0,
      blue: 0,
      red: 0,
      black: 7,
      white: 0,
    },
  },
  {
    points: 4,
    resource: {
      color: "black",
      count: 1,
    },
    requirements: {
      green: 3,
      blue: 0,
      red: 6,
      black: 3,
      white: 0,
    },
  },
  {
    points: 3,
    resource: {
      color: "green",
      count: 1,
    },
    requirements: {
      green: 0,
      blue: 3,
      red: 3,
      black: 3,
      white: 5,
    },
  },
  {
    points: 3,
    resource: {
      color: "black",
      count: 1,
    },
    requirements: {
      green: 5,
      blue: 3,
      red: 3,
      black: 0,
      white: 3,
    },
  },
  {
    points: 4,
    resource: {
      color: "blue",
      count: 1,
    },
    requirements: {
      green: 0,
      blue: 3,
      red: 0,
      black: 3,
      white: 6,
    },
  },
  {
    points: 5,
    resource: {
      color: "blue",
      count: 1,
    },
    requirements: {
      green: 0,
      blue: 3,
      red: 0,
      black: 0,
      white: 7,
    },
  },
  {
    points: 4,
    resource: {
      color: "white",
      count: 1,
    },
    requirements: {
      green: 0,
      blue: 0,
      red: 3,
      black: 6,
      white: 3,
    },
  },
  {
    points: 5,
    resource: {
      color: "white",
      count: 1,
    },
    requirements: {
      green: 0,
      blue: 0,
      red: 0,
      black: 7,
      white: 3,
    },
  },
  {
    points: 3,
    resource: {
      color: "white",
      count: 1,
    },
    requirements: {
      green: 3,
      blue: 3,
      red: 5,
      black: 3,
      white: 0,
    },
  },
  {
    points: 5,
    resource: {
      color: "red",
      count: 1,
    },
    requirements: {
      green: 7,
      blue: 0,
      red: 3,
      black: 0,
      white: 0,
    },
  },
  {
    points: 3,
    resource: {
      color: "red",
      count: 1,
    },
    requirements: {
      green: 3,
      blue: 5,
      red: 0,
      black: 3,
      white: 3,
    },
  },
  {
    points: 5,
    resource: {
      color: "black",
      count: 1,
    },
    requirements: {
      green: 0,
      blue: 0,
      red: 7,
      black: 3,
      white: 0,
    },
  },
  {
    points: 4,
    resource: {
      color: "green",
      count: 1,
    },
    requirements: {
      green: 3,
      blue: 6,
      red: 0,
      black: 0,
      white: 3,
    },
  },
  {
    points: 5,
    resource: {
      color: "green",
      count: 1,
    },
    requirements: {
      green: 3,
      blue: 7,
      red: 0,
      black: 0,
      white: 0,
    },
  },
  {
    points: 4,
    resource: {
      color: "red",
      count: 1,
    },
    requirements: {
      green: 7,
      blue: 0,
      red: 0,
      black: 0,
      white: 0,
    },
  },
  {
    points: 4,
    resource: {
      color: "black",
      count: 1,
    },
    requirements: {
      green: 0,
      blue: 0,
      red: 7,
      black: 0,
      white: 0,
    },
  },
  {
    points: 4,
    resource: {
      color: "blue",
      count: 1,
    },
    requirements: {
      green: 0,
      blue: 0,
      red: 0,
      black: 0,
      white: 7,
    },
  },
];

export const getNewLevel3Cards = () => {
  const level3CardsCopy = JSON.parse(JSON.stringify(allLevel3Cards));
  shuffleArray(level3CardsCopy);
  return level3CardsCopy;
};

const allNobles = [
  {
    points: 3,
    cardRequirements: {
      green: 3,
      blue: 3,
      red: 3,
      black: 0,
      white: 0,
    },
  },
  {
    points: 3,
    cardRequirements: {
      green: 3,
      blue: 3,
      red: 0,
      black: 0,
      white: 3,
    },
  },
  {
    points: 3,
    cardRequirements: {
      green: 0,
      blue: 4,
      red: 0,
      black: 0,
      white: 4,
    },
  },
  {
    points: 3,
    cardRequirements: {
      green: 4,
      blue: 4,
      red: 0,
      black: 0,
      white: 0,
    },
  },
  {
    points: 3,
    cardRequirements: {
      green: 0,
      blue: 3,
      red: 0,
      black: 3,
      white: 3,
    },
  },
  {
    points: 3,
    cardRequirements: {
      green: 4,
      blue: 0,
      red: 4,
      black: 0,
      white: 0,
    },
  },
  {
    points: 3,
    cardRequirements: {
      green: 0,
      blue: 0,
      red: 3,
      black: 3,
      white: 3,
    },
  },
  {
    points: 3,
    cardRequirements: {
      green: 3,
      blue: 0,
      red: 3,
      black: 3,
      white: 0,
    },
  },
  {
    points: 3,
    cardRequirements: {
      green: 0,
      blue: 0,
      red: 0,
      black: 4,
      white: 4,
    },
  },
  {
    points: 3,
    cardRequirements: {
      green: 0,
      blue: 0,
      red: 4,
      black: 4,
      white: 0,
    },
  },
];

export const get5Nobles = () => {
  const allNoblesCopy = JSON.parse(JSON.stringify(allNobles));
  const fiveNobles = allNoblesCopy.slice(0, 5);
  return fiveNobles;
};
