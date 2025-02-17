{
    
    //
    // Inject gamepad events as keyboard events
    //
    
    // simple input map, button 0 injects 'b', button 1 injects 'c', etc.
    const KEY_MAP = ['b', 'c', 'a', 'd'];
    
    let pad = {
        device: null,
        buttons: [false, false, false, false],
    };
    
    window.addEventListener("gamepadconnected", (ev) => {
        if (pad.device === null) {
            pad.device = ev.gamepad.index;
            console.log("Using controller:", ev.gamepad.id)
        }
        
        console.log("Start polling controller...");
        window.requestAnimationFrame(poll_pads);
    });
    
    window.addEventListener("gamepaddisconnected", (ev) => {
        if (ev.gamepad.index === pad.device) {
            pad.device = null;
            console.log("Detaching controller:", ev.gamepad.id)
        }
    });
    
    const poll_pads = () => {
        if (pad.device === null) {
            console.log("Controller polling stopped");
            return;
        }
        
        let pad_state = navigator.getGamepads()[pad.device];
        
        for (let button_id = 0; button_id < pad.buttons.length; button_id++) {
            let new_state = pad_state.buttons[button_id].pressed;
            if (new_state != pad.buttons[button_id]) {
                if (new_state === false) {
                    inject_keypress(button_id);
                }
                pad.buttons[button_id] = new_state;
            }
        }
        
        window.requestAnimationFrame(poll_pads);
    }
    
    const inject_keypress = (button_id) => {
        let ev = new KeyboardEvent ("keydown", { bubbles: true, cancelable: true, key: KEY_MAP[button_id], char: KEY_MAP[button_id] });
        document.body.dispatchEvent(ev);
    }
}