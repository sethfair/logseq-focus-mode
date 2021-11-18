/** @jsx h */
import '@logseq/libs'

import './index.css';

import {h, render} from 'preact'
import {useEffect, useState} from 'preact/hooks'

function App() {
    const [settings, setSettings] = useState()

    useEffect(() => {
        setSettings(logseq.settings);
    }, [])

    useEffect(() => {
        logseq.updateSettings(settings);
    }, [settings]);

    const OptionCheck = ({label, name}) => {
        return (<div className={"option-check"}>
                <label>{label}</label>
                <input checked={settings && settings[name]} name={name} type="checkbox" onClick={(e) => {
                    const newState = Object.assign({}, settings);
                    newState[name] = e.target.checked === true;
                    setSettings(newState);
                }}/>
            </div>
        );
    }

    return (
        <div>
            <div className={"title"}>Focus Mode</div>
            <OptionCheck name="hide_sidebar" label="Hide Sidebar"/>
            <OptionCheck name="go_fullscreen" label="Go Fullscreen"/>
            <OptionCheck name="hide_properties" label="Hide Properties"/>

            <p className="ctl">
                <button onClick={() => {
                    logseq.hideMainUI()
                }}>Close
                </button>
            </p>
        </div>
    )
}

function main() {
    const doc = document
    let toggleOn = false;

    render(<App/>, doc.querySelector('#app'))

    logseq.provideModel({
            toggleLeftSideBar() {
                window.parent.dispatchEvent(new KeyboardEvent('keydown', {
                    'key': 't'
                }));
                window.parent.dispatchEvent(new KeyboardEvent('keydown', {
                    'key': 'l'
                }));
            },

            toggleFocus() {
                this.initSettings();
            },

            initSettings() {
                toggleOn = !toggleOn
                const {go_fullscreen, hide_sidebar, hide_properties} = logseq.settings;
                if (go_fullscreen) {
                    logseq.App.setFullScreen(toggleOn);
                }

                if (hide_sidebar) {
                    this.toggleLeftSideBar();
                }

                logseq.provideStyle(`
                  .pre-block {
                    display: ${hide_properties && toggleOn ? 'none' : 'block'}
                  }
               `);
            },

            openFontsPanel(e) {
                const {rect} = e

                logseq.setMainUIInlineStyle({
                    top: `${rect.top + 20}px`,
                    left: `${rect.right - 10}px`,
                })

                logseq.toggleMainUI()
            },
        },
    )



    const id = logseq.baseInfo.id

    logseq.provideStyle(`
        @import url("https://cdn.jsdelivr.net/npm/boxicons@latest/css/boxicons.min.css");
        
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
    })

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
                    <i class="bx bx-expand-alt"></i>
                </a>
                 <a
                   data-on-click="openFontsPanel"
                   class="button"
                   data-rect
                >
                    <i class="bx bx-dots-vertical-rounded"></i>
                </a>
        </span>
    `,
        })

    document.addEventListener('keydown', function (e) {
        if (e.keyCode === 27) {
            logseq.hideMainUI()
        }
    }, false)
}


// bootstrap
logseq.ready(main).catch(console.error)




