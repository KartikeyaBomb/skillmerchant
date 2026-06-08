"use client";

import React, { useEffect, useState, useRef } from "react";
import { styles, indexToButtonMap, indexToAxesMap } from "./constants";
import moveRecognizer from "./skillmoves/moveRecognizer";
import pollGamePads from "./pollGamePads"

export default function App() {
  const [isConnected, setIsConnected] = useState(false);
  const prevButtonsRef = useRef([]);
  const prevAxesRef = useRef([]);
  const prevAxesHeldRef = useRef([]);
  
  const controlsLogRef = useRef([]);
  const axesHeldLogRef = useRef([]);

  const [controlsLog, setControlsLog] = useState([]);
  const [axesHeldLog, setAxesHeldLog] = useState([]);

  useEffect(() => {
    // Keep refs in sync with state
    controlsLogRef.current = controlsLog;
    axesHeldLogRef.current = axesHeldLog;
  }, [controlsLog, axesHeldLog]);

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
      pollGamePads(
        controlsLogRef.current,
        axesHeldLogRef.current,
        setControlsLog, 
        setAxesHeldLog, 
        setIsConnected,
        prevButtonsRef,
        prevAxesRef,
        prevAxesHeldRef);

      rafId = requestAnimationFrame(tick);
    };

    tick(); // this call happens once every refresh
    
    return () => {
    cancelAnimationFrame(rafId);
    window.removeEventListener("gamepadconnected", handleGamePadConnected);
    window.removeEventListener("gamepaddisconnected", handleGamePadDisconnected);
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
                    <strong>
                      {indexToButtonMap[entry.index]}
                    </strong>
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
