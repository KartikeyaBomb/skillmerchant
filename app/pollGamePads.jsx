import axesLoop from "./axesLoop"
import buttonsLoop from "./buttonsLoop"

export default function pollGamePads(setControlsLog, setAxesHeldLog, setIsConnected,prevButtonsRef,prevAxesRef,prevAxesHeldRef,rafId) {
      const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
      const gp = gamepads[0];

      if (gp) {
        setIsConnected(true);

        const prevButtons = prevButtonsRef.current;
        const prevAxes = prevAxesRef.current;
        const prevAxesHeld = prevAxesHeldRef.current;

        gp.axes.forEach((value, index) => {
          axesLoop(setControlsLog, setAxesHeldLog,prevAxes,prevAxesHeld,value,index)
        });
        

        gp.buttons.forEach((button, index) => {
          buttonsLoop(setControlsLog, setAxesHeldLog, prevButtons,button, index)
        })

        //if start button is clicked, reset prevButtons. Then for the new combo need to see if all buttons are clicked within a certain timeframe
        prevButtonsRef.current = gp.buttons.map((b) => ({
          pressed: b.pressed,
        }));

        

        prevAxesRef.current = gp.axes;
        prevAxesHeldRef.current = prevAxesHeld
      } else {
        setIsConnected(false);
        prevButtonsRef.current = [];
        prevAxesRef.current = [];
        prevAxesHeldRef.current = [];
        
      }
      
      rafId = requestAnimationFrame(pollGamePads);
    }