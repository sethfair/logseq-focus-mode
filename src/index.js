import '@logseq/libs'
import main from "./main";

logseq.ready(() => {
    main();
}).catch(console.error)