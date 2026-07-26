import { useState } from "react";
import { skillMoves } from "../constants";

export default function MoveRecognizer(
  axesHeldLog,
  controlsLog,
  moveRecognized,
  setMoveRecognized,
) {
  var currentMove = null;

  const arraysEqual = (a, b) =>
    a.length === b.length && a.every((v, i) => v === b[i]);
  console.log("controls recognizer:", controlsLog); // these need to combine somehow
  console.log("axes held recognizer:", axesHeldLog);

  const movesLog = controlsLog?.map((item) => item.index);
  console.log("moveslog: ", movesLog);

  for (const [key, value] of Object.entries(skillMoves)) {
    if (arraysEqual(movesLog, value)) {
      setMoveRecognized(true);
      currentMove = key;
    }
  }

  const fakeShot = [4, 1, 0];
  console.log(JSON.stringify(fakeShot));
  console.log(arraysEqual(movesLog, fakeShot));

  return <div>{moveRecognized && { currentMove }}</div>;
}

// fake shot: lb + b + a and move left stick left then up or left then down
// 4 + 1 + 0 + left stick left then left stick up / left stick down'
