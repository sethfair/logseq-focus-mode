import '@logseq/libs'
import './index.css';
import main from "./main";

logseq.ready(() => {
    main(logseq.settings.focus_on_startup);
}).catch(console.error)