import { createRef } from 'preact'
import {useEffect, useState} from 'preact/hooks'
import React from "preact/compat";

let keyboardTimeout;
const HotkeyEditor = ({setSettings}) => {
    const [enableHotkeySet, setEnableHotkey] = useState(false)
    const [hotkey, setHotkey] = useState(logseq.settings.keyboard)
    const [previousHotKey, setPreviousHotkey] = useState(false)
    const [shouldAppendKey, setAppendKey] = useState(false)
    const hotkeyInputField = createRef();

    const handleSetHotKey = e => {
        e.preventDefault();
        const previousAppend = shouldAppendKey;
        if (keyboardTimeout) clearTimeout(keyboardTimeout);

        keyboardTimeout = setTimeout(() => {
            setAppendKey(false);
        }, 250);
        setAppendKey(true);

        if (previousAppend) {
            setHotkey(`${hotkey} ${e.key}`);
        } else {
            if (e.ctrlKey) {
                setHotkey(`ctrl+${e.key.toString()}`)
            } else if (e.shiftKey) {
                setHotkey(`shift+${e.key.toString()}`)
            } else {
                setHotkey(e.key);
            }
        }
    };

    const handleCancelBtn = () => {
        setHotkey(previousHotKey);
        setEnableHotkey(false);
    }

    const clearHotKey = () => {
        setPreviousHotkey(hotkey);
        setHotkey('');
    }

    const handleKeyPress = (e) => {
        if (enableHotkeySet) handleSetHotKey(e);
    }

    const handleSave = (e) => {
        const newState = Object.assign({}, logseq.settings);
        newState['keyboard'] = hotkey;
        setSettings(newState);
        setEnableHotkey(false)

        if (confirm('Restart of Logseq is required for hotkey changes to take effect.')) {
            logseq.App.relaunch();
        }
    }

    const handleInputClick = () => {
        if (!enableHotkeySet) {
            setEnableHotkey(true);
            clearHotKey();
        }
    }

    const handleEditClick = () => {
        if (hotkeyInputField && hotkeyInputField.current) {
            hotkeyInputField.current.focus();
            setEnableHotkey(true);
        }
    }

    return (
        <div>
            <input ref={hotkeyInputField} value={hotkey} className={`hotkeybox ${enableHotkeySet && "enabled"}`}
                   onClick={handleInputClick} onFocus={handleInputClick} onKeyPress={handleSetHotKey}/>
            {!enableHotkeySet && <button className="hotkey-btn edit-hotkey" onClick={handleEditClick}>edit</button>}
            {enableHotkeySet && <button className="hotkey-btn edit-hotkey" onClick={handleSave}>save</button>}
            {enableHotkeySet && <button className="hotkey-btn cancel-hotkey" onClick={handleCancelBtn}>cancel</button>}
        </div>
    )
}

export default HotkeyEditor;