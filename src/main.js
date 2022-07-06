import { updateLogseqState } from './util';
import { settingUI } from './settings';
import {stateContains} from "./util";

export let model;
const main = () => {
    settingUI();
    let toggleOn = stateContains("on_startup", "Enter Focus Mode");
    logseq.App.setFullScreen(toggleOn);

    model = {
        toggleFocus() {
            toggleOn = !toggleOn;

            if (stateContains("on_toggle", "Toggle Fullscreen Mode")) {
                logseq.App.setFullScreen(toggleOn);
            }

            if (toggleOn) {
                if (stateContains("on_focus", "Hide Left Sidebar")) {
                    logseq.App.setLeftSidebarVisible(false);
                }

                if (stateContains("on_focus", "Hide Right Sidebar")) {
                    logseq.App.setRightSidebarVisible(false);
                }

                if (stateContains("on_focus", "Hide Help")) {
                    logseq.provideStyle(`.cp__sidebar-help-btn { display: none; }`);
                }

                if (stateContains("on_toggle", "Toggle Line Highlight")) {
                    logseq.provideStyle(`
                    .block-content-wrapper {
                      opacity: 35%;
                    }
                    
                    .editor-wrapper {
                      opacity: 100%;
                    }
                   `)
                } else {
                    logseq.provideStyle(`
                    .block-content-wrapper, .bullet-container  {
                      opacity: 100%;
                    }
                    
                    .editor-wrapper, .editor-wrapper .bullet-container {
                      opacity: 100%;
                    }
                   `)
                }

                if (stateContains("on_toggle", "Toggle Top Bar")) {
                    logseq.provideStyle(`
                    div#head:hover {
                        opacity: 1; 
                      }
                    div#head {
                        opacity: 0;  
                    }
                   `)
                } else {
                    logseq.provideStyle(`
                    div#head:hover {
                        opacity: 1; 
                      }
                    div#head {
                        opacity: 1;  
                    }
                   `)
                }

                if (stateContains("on_focus", "Custom Hide Elements")) {
                    if (logseq.settings.custom_hide_on_focus) {
                        logseq.provideStyle(`${logseq.settings.custom_hide_on_focus} { display: none; }`);
                    }
                }
            }

            if (!toggleOn) {
                if (stateContains("on_unfocus", "Show Left Sidebar")) {
                    logseq.App.setLeftSidebarVisible(true);
                }

                if (stateContains("on_unfocus", "Show Help")) {
                    logseq.provideStyle(`.cp__sidebar-help-btn { display: block; }`);
                }

                if (stateContains("on_unfocus", "Show Right Sidebar")) {
                    logseq.App.setRightSidebarVisible(true);
                }

                if (stateContains("on_unfocus", "Custom Show Elements")) {
                    if (logseq.settings.custom_show_on_unfocus) {
                        logseq.provideStyle(`${logseq.settings.custom_show_on_unfocus} { display: block; }`);
                    }
                }

                if (stateContains("on_toggle", "Toggle Line Highlight")) {
                    logseq.provideStyle(`
                    .block-content-wrapper {
                      opacity: 100%;
                    }
                    
                    .editor-wrapper {
                      opacity: 100%;
                    }
                   `)
                }

                if (stateContains("on_toggle", "Toggle Top Bar")) {
                    logseq.provideStyle(`
                    div#head:hover {
                        opacity: 1; 
                      }
                    div#head {
                        opacity: 1;  
                    }
                   `)
                }
            }

            if (stateContains("on_toggle", "Toggle Page Properties")) {
                logseq.provideStyle(`
                      html.is-fullscreen .pre-block {
                        display: ${toggleOn ? 'none' : 'block'}
                      }
                `);
            }
        }
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

    // set default settings on initialization
    if(!logseq.settings.init) {
        updateLogseqState({
            init: true,
            keyboard: "f f",
            on_startup: [
                "Enter Focus Mode"
            ],
            on_toggle: [
                "Toggle Fullscreen Mode"
            ],
            on_focus: [
                "Hide Left Sidebar",
                "Hide help"
            ],
            on_unfocus: [
                "Show Left Sidebar",
                "Show help"
            ]
        });
    }

    // register keyboard
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
                </span>`
        })
}

export default main;