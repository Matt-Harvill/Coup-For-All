let shortTurnTime, longTurnTime;

if (process.env.NODE_ENV === "development") {
  console.log(process.env.NODE_ENV);
  shortTurnTime = 10000;
  longTurnTime = 15000;
} else {
  shortTurnTime = 30000;
  longTurnTime = 60000;
}

export { shortTurnTime, longTurnTime };
