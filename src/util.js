export const updateLogseqState = (values) => {
    const newState = Object.assign({}, logseq.settings);
    Object.keys(values).forEach(key => {
        newState[key] = values[key];
    })

    logseq.updateSettings(newState);
}