export const updateLogseqState = (values) => {
    const newState = Object.assign({}, logseq.settings);
    Object.keys(values).forEach(key => {
        newState[key] = values[key];
    })

    logseq.updateSettings(newState);
}

export const stateContains = (state, value) => {
    return logseq.settings && logseq.settings[state] && logseq.settings[state].includes(value);
}

export const toggleElement = (elm) => {
    if (elm.style.display === "none") {
        elm.style.display = "block";
    } else {
        elm.style.display = "none";
    }
}
