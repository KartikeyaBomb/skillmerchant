export const styles = {
  page: { padding: "16px", fontFamily: "sans-serif" },
  viewerBox: { flex: 1 },
  iframe: { width: "100%", height: "500px" },
  logBox: { width: "100%", justifyItems: "center" },
  logList: { padding: 2, margin: 2, display: "flex" },
  logItem: { marginBottom: "4px", fontSize: "20px", paddingRight: "10px" },
} as const;

export const indexToButtonMap = {
  0: "A",
  1: "B",
  2: "X",
  3: "Y",
  4: "LB",
  5: "RB",
  6: "LT",
  7: "RT",
  8: "Back",
  9: "Start",
  10: "Left Stick",
  11: "Right Stick",
  12: "D-Pad Up",
  13: "D-Pad Down",
  14: "D-Pad Left",
  15: "D-Pad Right",
} as const;

export const indexToAxesMap = {
  0: { 2: "L-Stick Right", 0: "L-Stick Left" },
  1: { 2: "L-Stick Down", 0: "L-Stick Up" },
  2: { 2: "R-Stick Right", 0: "R-Stick Left" },
  3: { 2: "R-Stick Down", 0: "R-Stick Up" },
} as const;

export const indexToAxesHeldMap = {
  0: { 2: "L-Stick Right Held", 0: "L-Stick Left Held" },
  1: { 2: "L-Stick Down Held", 0: "L-Stick Up Held" },
  2: { 2: "R-Stick Right Held", 0: "R-Stick Left Held" },
  3: { 2: "R-Stick Down Held", 0: "R-Stick Up Held" },
} as const;

export const skillMoves = {
  "ball roll": [4, 1, 0],
};
