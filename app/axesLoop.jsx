export default function axesLoop(setControlsLog, setAxesHeldLog,prevAxes,prevAxesHeld,value,index) {
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
    setAxesHeldLog((prev) => {
        const updated = [...prev, logEntry];
        return updated.slice(0, 10);
    })
    console.log("reached the loop") 
    console.log(index, "was held for more than 2 seconds")
    //prevAxesHeld[index] = 0 we only want to track the held once.
    
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
        return updated.slice(0, 10);
    });
    }
}