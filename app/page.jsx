"use client";

import React, { useEffect, useState, useRef } from "react";
import { styles, indexToButtonMap, indexToAxesMap } from "./constants";
import moveRecognizer from "./skillmoves/MoveRecognizer";
import MoveRecognizer from "./skillmoves/MoveRecognizer";

export default function App() {
  const [isConnected, setIsConnected] = useState(false);
  const prevButtonsRef = useRef([]);
  const prevAxesRef = useRef([]);
  const prevAxesHeldRef = useRef([]);
  const [controlsLog, setControlsLog] = useState([]);
  const [axesHeldLog, setAxesHeldLog] = useState([]);
  const [moveRecognized, setMoveRecognized] = useState(false);
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

          if (wasHeld && isHeld) {
            if (prevAxesHeld[index])
              prevAxesHeld[index] += 1; // increment counter
            else prevAxesHeld[index] = 1;
            console.log("holding", index);
          }

          if (prevAxesHeld[index] >= 120) {
            const logEntry = {
              index,
              value,
              id: `${Date.now()}-${index}`,
            };

            console.log(logEntry, "held log");
            setAxesHeldLog((prev) => {
              const updated = [...prev, logEntry];
              moveRecognizer(
                updated,
                controlsLog,
                moveRecognized,
                setMoveRecognized,
              );
              return updated.slice(0, 10);
            });

            console.log(index, "was held for more than 2 seconds");
            //prevAxesHeld[index] = 0

            moveRecognizer(
              updated,
              controlsLog,
              moveRecognized,
              setMoveRecognized,
            ); // this needs to be more efficient than calling the recognizer twice in the same file.
          }
          if (wasHeld && !isHeld) {
            prevAxesHeld[index] = 0;
          }

          if (!wasHeld && isHeld) {
            // if its just newly held, its a one time click
            const logEntry = {
              index,
              value,
              id: `${Date.now()}-${index}`,
            };

            setControlsLog((prev) => {
              const updated = [...prev, logEntry];
              moveRecognizer(
                updated,
                controlsLog,
                moveRecognized,
                setMoveRecognized,
              );
              return updated.slice(0, 10);
            });
          }
        });

        gp.buttons.forEach((button, index) => {
          const wasPressed = prevButtons[index]?.pressed || false;
          const isPressed = button.pressed;

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
              moveRecognizer(
                axesHeldLog,
                updated,
                moveRecognized,
                setMoveRecognized,
              );
              return updated.slice(0, 10);
            });
            setAxesHeldLog((prev) => {
              if (index == 9 || index == 8) {
                return [];
              }
              return prev;
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

  return (
    <div style={styles.page}>
      <p>
        Status:{" "}
        <strong>
          {isConnected ? "Gamepad connected" : "Waiting for gamepad"}
        </strong>
      </p>

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
                  <strong>
                    {indexToAxesMap[entry.index][entry.value + 1]}
                  </strong>
                </div>
              )}
            </li>
          ))}
        </ul>
        <ul style={styles.logList}>
          {axesHeldLog.map((entry) => (
            <li key={entry.id} style={styles.logItem}>
              <div>
                <strong>
                  {indexToAxesMap[entry.index][entry.value + 1]} Held
                </strong>
              </div>
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
      </div>
    </div>
  );
}
