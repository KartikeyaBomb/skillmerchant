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
  32: "L-Stick Right",
  33: "L-Stick Left",
  34: "L-Stick Down",
  35: "L-Stick Up",
  36: "R-Stick Right",
  37: "R-Stick Left",
  38: "R-Stick Down",
  39: "R-Stick Up",
} as const;

export const skillMoves = {
  "ball roll left-up": [33, 35, 4, 1, 0],
  "ball roll left-down": [33, 34, 4, 1, 0],
};

export const directionDict = {
  0: "right",
  1: "left",
};
