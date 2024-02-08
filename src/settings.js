export const settingUI = () => {
    const settings =  [
        {
            key: "on_startup",
            type: "enum",
            enumChoices: ["Enter Focus Mode"],
            enumPicker: "checkbox",
            description:
                "When Logseq starts up.",
            title: "On Startup"
        },
        {
            key: "on_toggle",
            type: "enum",
            enumChoices: ["Toggle Fullscreen Mode", "Toggle Page Properties", "Toggle Line Highlight", "Toggle Top Bar"],
            enumPicker: "checkbox",
            description:
                "When full screen mode is toggled.",
            title: "On Toggle"
        },
        {
            key: "on_focus",
            type: "enum",
            enumChoices: ["Hide Left Sidebar", "Hide Right Sidebar", "Hide Help", "Custom Hide Elements", "Zoom"],
            enumPicker: "checkbox",
            description:
                "When entering focus mode.",
            title: "On Focus"
        },
        {
            key: "on_unfocus",
            type: "enum",
            enumChoices: ["Show Left Sidebar", "Show Right Sidebar", "Show Help", "Custom Show Elements", "Unzoom"],
            enumPicker: "checkbox",
            description:
                "When exiting focus mode.",
            title: "On Unfocus"
        },
        {
            key: "keyboard",
            type: "string",
            default: "f f",
            description:
                "To toggle focus mode with the keyboard. Type in the key or key combination you wish to use to toggle. If you want multiple key combinations, add a space or \"+\" between the keys (\"f f\" or \"f+f\"). IMPORTANT: After changing the hotkey, you must restart Logseq for it to take effect.",
            title: "Toggle Focus Mode Keyboard Hotkey"
        },
        {
            key: "custom_hide_on_focus",
            type: "string",
            description:
                "CSS selector of elements you wish to hide when entering focus mode.",
            title: "Custom Hide On Focus"
        },
        {
            key: "custom_show_on_unfocus",
            type: "string",
            description:
                "CSS selector of elements you wish to show when exiting focus mode.",
            title: "Custom Show On Unfocus"
        },
        {
            key: "zoom_factor",
            type: "number",
            description:
                "Zoom factor(%) when focus mode is enabled; Only if 'Zoom' is selected on 'On Focus'",
            default: 150,
            title: "Zoom Factor"
        }
    ];

    logseq.useSettingsSchema(settings);
};