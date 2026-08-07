"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  styles,
  indexToButtonMap,
  indexToAxesMap,
  directionDict,
} from "./constants";

import { skillMoves } from "./constants";

export default function App() {
  const [allMoves, setAllMoves] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const prevButtonsRef = useRef([]);
  const prevAxesRef = useRef([]);
  const prevAxesHeldRef = useRef([]);
  const [controlsLog, setControlsLog] = useState([]);
  const [move, setMove] = useState("");
  const [direction, setDirection] = useState(0);

  // this function switches the direction the player is facing, matters when reading axis inputs
  function DirectionToggle() {
    const switchDirection = () => {
      if (direction === 0) {
        setDirection(1);
      } else setDirection(0);
    };
    return (
      <div
        style={{
          padding: "24px",
          maxWidth: "384px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <label
          style={{
            display: "flex",
            gap: "8px",
            cursor: "pointer",
            userSelect: "none",
          }}
        >
          <input type="checkbox" onChange={switchDirection} />
          Toggle Direction - currently {directionDict[direction]}
        </label>
      </div>
    );
  }

  useEffect(() => {
    function handleGamePadDisconnected() {
      setIsConnected(false);
      prevButtonsRef.current = [];
      prevAxesRef.current = [];
      prevAxesHeldRef.current = [];
    }
    function handleGamePadConnected() {
      setIsConnected(true);
    }

    function filterLatestControl(prevControls, index) {
      const matches = prevControls.filter((c) => c.index === index);
      if (matches.length === 0) return prevControls;
      const latestControl = matches.reduce((latest, current) =>
        new Date(current.date) > new Date(latest.date) ? current : latest,
      );
      return prevControls.filter((control) => control !== latestControl);
    }

    window.addEventListener("gamepadconnected", handleGamePadConnected);
    window.addEventListener("gamepaddisconnected", handleGamePadDisconnected);
    let rafId;
    const tick = () => {
      const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
      // Find the first connected gamepad (could be at any index)
      const gp = Array.from(gamepads).find((g) => g !== null);

      if (gp) {
        setIsConnected(true);

        const prevButtons = prevButtonsRef.current;
        const prevAxes = prevAxesRef.current;
        const prevAxesHeld = prevAxesHeldRef.current;

        gp.axes.forEach((value, index) => {
          const wasHeld = prevAxes[index] == 1 || prevAxes[index] == -1;
          const isHeld = value == 1 || value == -1;

          if (wasHeld && !isHeld) {
            setControlsLog((prevControls) =>
              // remove the last occurence of The button being pressed
              filterLatestControl(prevControls, index + 16),
            );
          }

          if (!wasHeld && isHeld) {
            console.log("index before:", index, value);
            // if its just newly held, its a one time click
            if (value == -1) value = 0; // this turns -1 value to 0. so now values are 0 and 1
            index = 2 * (index + 16) + value; // now adding value to index to makes axesMap 8 kv pairs instead of 4 inner dicts
            console.log("index after:", index, value);
            value += 1; // we don't want some values to be 0 or else the html code wont run {entry.value &&}
            const logEntry = {
              index,
              value,
              id: `${Date.now()}-${index}`,
            };

            setControlsLog((prev) => {
              const updated = [...prev, logEntry];

              return updated.slice(0, 10);
            });

            setAllMoves((prev) => {
              const updated = [...prev, logEntry];
              console.log("log entry when setallmoves is called", logEntry);

              return updated.slice(0, 10);
            });
          }
        });

        gp.buttons.forEach((button, index) => {
          const wasPressed = prevButtons[index]?.pressed || false;
          const isPressed = button.pressed;

          if (wasPressed && !isPressed) {
            setControlsLog((prevControls) =>
              filterLatestControl(prevControls, index),
            );
            console.log("");
          }

          if (!wasPressed && isPressed) {
            const logEntry = {
              index,
              timeStamp: new Date().toLocaleTimeString(),
              id: `${Date.now()}-${index}`,
            };

            setControlsLog((prev) => {
              if (index == 9 || index == 8) {
                return [];
              }
              const updated = [...prev, logEntry];

              return updated.slice(0, 10);
            });

            setAllMoves((prev) => {
              if (index == 9 || index == 8) {
                return [];
              }
              const updated = [...prev, logEntry];

              return updated.slice(0, 10);
            });
          }
        });
        //if start button is clicked, reset prevButtons. Then for the new combo need to see if all buttons are clicked within a certain timeframe
        prevButtonsRef.current = gp.buttons.map((b) => ({
          pressed: b.pressed,
        }));

        prevAxesRef.current = gp.axes;
        prevAxesHeldRef.current = prevAxesHeld;
      } else {
        setIsConnected(false);
        prevButtonsRef.current = [];
        prevAxesRef.current = [];
        prevAxesHeldRef.current = [];
      }

      rafId = requestAnimationFrame(tick);
    };

    tick(); // this call happens once every refresh

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("gamepadconnected", handleGamePadConnected);
      window.removeEventListener(
        "gamepaddisconnected",
        handleGamePadDisconnected,
      );
    };
  }, []);

  useEffect(() => {
    const arraysEqual = (skillMoves, moveLog) =>
      skillMoves.every((num) => movesLog.includes(num));

    const movesLog = allMoves?.map((item) => item.index);

    // matches the input to the skill move.
    setMove(
      Object.entries(skillMoves).find(([, array]) =>
        arraysEqual(array, movesLog),
      )?.[0],
    );
  }, [allMoves, direction]);

  return (
    <div style={styles.page}>
      <p>
        Status:{" "}
        <strong>
          {isConnected ? "Gamepad connected" : "Waiting for gamepad"}
        </strong>
      </p>
      <DirectionToggle />

      <div style={styles.logBox}>
        <ul style={styles.logList}>
          {controlsLog.map((entry) => (
            <li key={entry.id} style={styles.logItem}>
              {!entry.value && (
                <div>
                  <strong>{indexToButtonMap[entry.index]}</strong>
                </div>
              )}
              {entry.value && (
                <div>
                  <strong>{indexToAxesMap[entry.index]}</strong>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <div style={styles.viewerBox}>
          <iframe
            title="Gamepad Viewer"
            style={styles.iframe}
            src="https://app.gpv.gg/?p=1&s=0&smeter=1&sc=.65"
          />
        </div>
        <div style={styles.logBox}>
          <ul style={styles.logList}>
            {allMoves.map((entry) => (
              <li key={entry.id} style={styles.logItem}>
                {!entry.value && (
                  <div>
                    <strong>{indexToButtonMap[entry.index]}</strong>
                  </div>
                )}
                {entry.value && (
                  <div>
                    <strong>{indexToAxesMap[entry.index]}</strong>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
        <strong>{move}</strong>
      </div>
    </div>
  );
}
