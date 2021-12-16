import React from "preact/compat";
import {h, render} from 'preact'
import App from "./App";
import { updateLogseqState } from './util';

export let model;
const main = (inFocusMode = false) => {
    const doc = document
    let toggleOn = inFocusMode;

    if (logseq.settings.focus_on_startup) {
        logseq.App.setFullScreen(logseq.settings.go_fullscreen);
    } else {
        logseq.App.setFullScreen(false);
    }

    render(<App/>, doc.querySelector('#app'))

    model = {
        toggleFocus(toggle = true) {

            if (toggle) {
                toggleOn = !toggleOn;

                if (logseq.settings.go_fullscreen) {
                    logseq.App.setFullScreen(toggleOn);
                }
            }

            if (toggleOn) {
                if (logseq.settings.hide_sidebar) {
                    logseq.App.setLeftSidebarVisible(false);
                }

                if (logseq.settings.hide_right_sidebar) {
                    logseq.App.setRightSidebarVisible(false);
                }

                if(logseq.settings.line_highlight) {
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

                if(logseq.settings.hide_topbar) {
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
            }

            if (!toggleOn) {
                if (logseq.settings.open_left_sidebar_on_unfocus) {
                    logseq.App.setLeftSidebarVisible(true);
                }

                if (logseq.settings.open_right_sidebar_on_unfocus) {
                    logseq.App.setRightSidebarVisible(true);
                }

                if(logseq.settings.line_highlight) {
                    logseq.provideStyle(`
                    .block-content-wrapper {
                      opacity: 100%;
                    }
                    
                    .editor-wrapper {
                      opacity: 100%;
                    }
                   `)
                }
                
                if(logseq.settings.hide_topbar) {
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

    // set default settings on initialization
    if(!logseq.settings.init) {
        updateLogseqState({
            fullscreen: true,
            keyboard: 'f f',
            init: true
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
        if (e.key === 'Escape') {
            logseq.hideMainUI()
        }
    }, false)
}

export default main;