let shortTurnTime, longTurnTime;

if (process.env.NODE_ENV === "development") {
  shortTurnTime = 30000;
  longTurnTime = 60000;
} else {
  shortTurnTime = 30000;
  longTurnTime = 60000;
}

export { shortTurnTime, longTurnTime };
