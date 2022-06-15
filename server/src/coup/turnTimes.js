let shortTurnTime, longTurnTime;

if (process.env.NODE_ENV === "development") {
  shortTurnTime = 10000;
  longTurnTime = 15000;
} else {
  shortTurnTime = 30000;
  longTurnTime = 60000;
}

export { shortTurnTime, longTurnTime };
