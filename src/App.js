import React from "preact/compat";
import {useEffect, useState} from "preact/hooks";
import HotkeyEditor from "./HotkeyEditor";
import OptionCheck from "./OptionCheck";
import {model} from "./main";

const App = () => {
    const [settings, setSettings] = useState({})

    useEffect(() => {
        setSettings(logseq.settings);
    }, [])

    useEffect(() => {
        logseq.updateSettings(settings);
        setTimeout(() => {
            model.toggleFocus(false);
        }, 200)
    }, [settings]);

    return (
        <div>
            <div className={"title"}>Focus Mode Settings</div>
            <fieldset>
                <legend>On Startup</legend>
                <OptionCheck checked={settings['focus_on_startup']} setSettings={setSettings} name="focus_on_startup" label="Enter Focus Mode"/>
            </fieldset>

            <fieldset>
                <legend>On Toggle</legend>
                <OptionCheck checked={settings['go_fullscreen']} setSettings={setSettings} name="go_fullscreen" label="Fullscreen Mode"/>
                <OptionCheck checked={settings['hide_properties']} setSettings={setSettings} name="hide_properties" label="Page Properties"/>
                <OptionCheck checked={settings['line_highlight']} setSettings={setSettings} name="line_highlight" label="Line Highlight"/>
            </fieldset>

            <fieldset>
                <legend>On Focus</legend>
                <OptionCheck checked={settings['hide_sidebar']} setSettings={setSettings} name="hide_sidebar" label="Hide Left Sidebar"/>
                <OptionCheck checked={settings['hide_right_sidebar']}  setSettings={setSettings} name="hide_right_sidebar" label="Hide Right Sidebar"/>
            </fieldset>

            <fieldset>
                <legend>On Unfocus</legend>
                <OptionCheck checked={settings['open_left_sidebar_on_unfocus']} setSettings={setSettings} name="open_left_sidebar_on_unfocus" label="Show Left Sidebar"/>
                <OptionCheck checked={settings['open_right_sidebar_on_unfocus']} setSettings={setSettings} name="open_right_sidebar_on_unfocus" label="Show Right Sidebar"/>
            </fieldset>

            <fieldset>
                <legend>Keyboard Shortcut</legend>
                <div>
                    <p className={'instructions'}>Click in the box below and type the key combination you wish to use to
                        toggle focus mode. <span className="warning">(Restart Required)</span></p>
                    <HotkeyEditor setSettings={setSettings}/>
                </div>
            </fieldset>

            <p className="ctl">
                <button onClick={() => {
                    logseq.hideMainUI()
                }}>Close Settings
                </button>
            </p>
        </div>
    )
}

export default App;