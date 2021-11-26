/** @jsx h */
import '@logseq/libs'
import './index.css';
import {h, render, createRef} from 'preact'
import {useEffect, useState} from 'preact/hooks'

let keyboardTimeout;
let appendKey = false;

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
            console.log('timeout')
            setAppendKey(false);
        }, 250);
        setAppendKey(true);


        if (previousAppend) {
            setHotkey(`${hotkey} ${e.key}`);
        } else {
            if (e.ctrlKey) {
                // setHotkey(`ctrl+${e.key.toString()}`)
            } else {
                setHotkey(e.key);
            }
        }
    };

    const handleCancelBtn = () => {
        console.log('handleCancelBtn');
        setHotkey(previousHotKey);
        setEnableHotkey(false);
    }

    const clearHotKey = () => {
        setPreviousHotkey(hotkey);
        setHotkey('');
    }

    const handleKeyPress = (e) => {
        console.log('handleKeyPress', e.key, e, enableHotkeySet);
        if(enableHotkeySet) handleSetHotKey(e);
    }

    const handleSave = (e) => {
        const newState = Object.assign({}, logseq.settings);
        newState['keyboard'] = hotkey;
        console.log(newState);
        setSettings(newState);
        setEnableHotkey(false)

        if(confirm('Restart of Logseq is required for the hotkey change to take effect.')) {
            logseq.App.relaunch();
        }
    }

    const handleInputClick = () => {
        console.log('handleInputClick')
        if (!enableHotkeySet) {
            setEnableHotkey(true);
            clearHotKey();
        }
    }

    const handleEditClick = () => {
        console.log('handle edit click');
        if (hotkeyInputField && hotkeyInputField.current) {
            hotkeyInputField.current.focus();
            setEnableHotkey(true);
        }
    }

    return <div>
        <input ref={hotkeyInputField} value={hotkey} className={`hotkeybox ${enableHotkeySet && "enabled"}`}
               onClick={handleInputClick} onFocus={handleInputClick} onKeyPress={handleKeyPress} />
        {!enableHotkeySet && <button className="hotkey-btn edit-hotkey" onClick={handleEditClick}>edit</button>}
        {enableHotkeySet && <button className="hotkey-btn edit-hotkey" onClick={handleSave}>save</button>}
        {enableHotkeySet && <button className="hotkey-btn cancel-hotkey" onClick={handleCancelBtn}>cancel</button>}
    </div>;
}

function App() {
    const [settings, setSettings] = useState({})

    useEffect(() => {
        setSettings(logseq.settings);
    }, [])

    useEffect(() => {
        logseq.updateSettings(settings);
    }, [settings]);

    const OptionCheck = ({label, name}) => {
        return (<div className={"option-check"}>
                <label>{label}</label>
                <input checked={logseq.settings && logseq.settings[name]} name={name} type="checkbox" onClick={(e) => {
                    const newState = Object.assign({}, logseq.settings);
                    newState[name] = e.target.checked === true;
                    setSettings(newState);
                }}/>
            </div>
        );
    }

    return (
        <div>
            <div className={"title"}>Focus Mode Settings</div>

            <fieldset>
                <legend>On Toggle</legend>
                <OptionCheck name="go_fullscreen" label="Fullscreen Mode"/>
                <OptionCheck name="hide_properties" label="Page Properties"/>
            </fieldset>

            <fieldset>
                <legend>On Focus</legend>
                <OptionCheck name="hide_sidebar" label="Hide Left Sidebar"/>
                <OptionCheck name="hide_right_sidebar" label="Hide Right Sidebar"/>
            </fieldset>

            <fieldset>
                <legend>On Unfocus</legend>
                <OptionCheck name="open_left_sidebar_on_unfocus" label="Show Left Sidebar"/>
                <OptionCheck name="open_right_sidebar_on_unfocus" label="Show Right Sidebar"/>
            </fieldset>

            <fieldset>
                <legend>Keyboard Shortcut</legend>
                <div>
                    <p class={'instructions'}>Click in the box below and type the key combination you wish to use to
                        toggle focus mode.</p>
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

function main() {
    const doc = document
    let toggleOn = false;
    render(<App/>, doc.querySelector('#app'))

    const model = {
            toggleFocus() {
                toggleOn = !toggleOn;

                if (toggleOn) {
                    if (logseq.settings.hide_sidebar) {
                        logseq.App.setLeftSidebarVisible(false);
                    }
                    if (logseq.settings.hide_right_sidebar) {
                        logseq.App.setRightSidebarVisible(false);
                    }
                }

                if (!toggleOn) {
                    if (logseq.settings.open_left_sidebar_on_unfocus) {
                        logseq.App.setLeftSidebarVisible(true);
                    }

                    if (logseq.settings.open_right_sidebar_on_unfocus) {
                        logseq.App.setRightSidebarVisible(true);
                    }
                }

                if (logseq.settings.go_fullscreen) {
                    logseq.App.setFullScreen(toggleOn);
                }

                if (logseq.settings.hide_properties) {
                    logseq.provideStyle(`
                      html.is-fullscreen .pre-block {
                        display: ${toggleOn ? 'none' : 'block'}
                      }
                   `);
                }
            },
            openFontsPanel(e) {
                const {rect} = e

                logseq.setMainUIInlineStyle({
                    top: `${rect.top + 25}px`,
                    left: `${rect.right - 17}px`,
                })

                logseq.toggleMainUI()
            },
        };
    logseq.provideModel(model)

    logseq.provideStyle(`
        .logseq-focus-toolbar {
          display: flex;
          border-radius: 5px;
        }
        
        .logseq-focus-toolbar a.button {
          padding: 0;   
          margin: 0;
        }
  `)

    logseq.setMainUIInlineStyle({
        position: 'fixed',
        width: '290px',
        zIndex: 999,
        transform: 'translateX(-50%)',
    });

    if (logseq.settings.keyboard) {
        logseq.App.registerCommandPalette({
            key: 'toggle_focus_mode_shortcut',
            label: 'Toggle Focus Mode Keyboard Shortcut',
            keybinding: {
                binding: logseq.settings.keyboard
            }
        }, () => {
            model.toggleFocus();
        });
    }

    logseq.App.registerUIItem('toolbar',
        {
            key: 'logseq-focus-toolbar',
            template: `
                <span class="logseq-focus-toolbar">
                        <a
                           data-on-click="toggleFocus"
                           class="button"
                           data-rect
                        >
                            <i class="ti ti-maximize"></i>
                        </a>
                         <a
                           data-on-click="openFontsPanel"
                           class="button"
                           data-rect
                        >
                            <i class="ti ti-dots-vertical"></i>
                        </a>
                </span>`
        })

    document.addEventListener('keydown', function (e) {
        if (e.keyCode === 27) {
            logseq.hideMainUI()
        }
    }, false)
}

// bootstrap
logseq.ready(main).catch(console.error)