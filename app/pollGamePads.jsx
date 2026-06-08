import axesLoop from "./axesLoop"
import buttonsLoop from "./buttonsLoop"

export default function pollGamePads(controlsLog, axesHeldLog, setControlsLog, setAxesHeldLog, setIsConnected,prevButtonsRef,prevAxesRef,prevAxesHeldRef) {
      const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
      // Find the first connected gamepad (could be at any index)
      const gp = Array.from(gamepads).find(g => g !== null);

      if (gp) {
        setIsConnected(true);

        const prevButtons = prevButtonsRef.current;
        const prevAxes = prevAxesRef.current;
        const prevAxesHeld = prevAxesHeldRef.current;

        gp.axes.forEach((value, index) => {
          axesLoop(axesHeldLog,controlsLog,setControlsLog, setAxesHeldLog,prevAxes,prevAxesHeld,value,index)
        });
        
        gp.buttons.forEach((button, index) => {
          buttonsLoop(axesHeldLog,controlsLog,setControlsLog, setAxesHeldLog, prevButtons,button, index)
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
    }