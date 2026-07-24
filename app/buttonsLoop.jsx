import moveRecognizer from "./skillmoves/MoveRecognizer";

export default function buttonsLoop(axesHeldLog, controlsLog, setControlsLog, setAxesHeldLog, prevButtons,button, index) {
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
        moveRecognizer(axesHeldLog, updated)
        return updated.slice(0, 10);
    });
    setAxesHeldLog((prev) => {
        if (index == 9 || index == 8) {
        return [];
        }
        return prev;
    })
    
    }
    

}