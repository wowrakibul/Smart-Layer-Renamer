/// <reference types="@figma/plugin-typings" />
import { renameChildrenRecursively } from './utils';
if (figma.currentPage.selection.length !== 1) {
    figma.notify("Select one main frame to rename.");
    figma.closePlugin();
}
else {
    const main = figma.currentPage.selection[0];
    if ("children" in main) {
        figma.showUI(__html__, { width: 320, height: 400 });
        figma.ui.postMessage({ type: 'show-options', frameName: main.name });
    }
    else {
        figma.notify("Selected node has no children.");
        figma.closePlugin();
    }
}
figma.ui.onmessage = (msg) => {
    if (msg.type === 'rename-layers') {
        const main = figma.currentPage.selection[0];
        const baseName = main.name.replace(/\s+/g, "");
        const indexRef = { count: 0 };
        if ("children" in main) {
            renameChildrenRecursively(main, baseName, indexRef, msg.options);
            figma.notify(`Renamed ${indexRef.count} layers under "${main.name}".`);
        }
        figma.closePlugin();
    }
};
