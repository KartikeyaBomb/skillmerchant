import moveRecognizer from "./skillmoves/moveRecognizer";
import pollGamePads from "./pollGamePads"
export default function axesLoop(axesHeldLog, controlsLog, setControlsLog, setAxesHeldLog,prevAxes,prevAxesHeld,value,index) {
    const wasHeld = prevAxes[index] == 1 || prevAxes[index] == -1;
    const isHeld = value == 1 || value == -1;
    
    if (wasHeld && isHeld) {
        if (prevAxesHeld[index]) prevAxesHeld[index] += 1 // increment counter
        else prevAxesHeld[index] = 1
        console.log("holding", index)
    }
    
    if (prevAxesHeld[index] >= 120) {
    const logEntry = {
        index,
        value,
        id: `${Date.now()}-${index}`,
    }

    console.log(logEntry, "held log")
    setAxesHeldLog((prev) => {
        const updated = [...prev, logEntry];
        moveRecognizer(updated, controlsLog)
        return updated.slice(0, 10);
    })
    
    console.log(index, "was held for more than 2 seconds")
    //prevAxesHeld[index] = 0

    moveRecognizer(axesHeldLog,controlsLog) // this needs to be more efficient than calling the recognizer twice in the same file. 

    }
    if (wasHeld && !isHeld) {
        prevAxesHeld[index] = 0
    }

    if (!wasHeld && isHeld) { // if its just newly held, its a one time click
    const logEntry = {
        index,
        value,
        id: `${Date.now()}-${index}`,
    };

    setControlsLog((prev) => {
        const updated = [...prev, logEntry];
        moveRecognizer(axesHeldLog, updated)
        return updated.slice(0, 10);
    });

    
    }

    

    
}