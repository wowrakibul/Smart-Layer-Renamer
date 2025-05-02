/// <reference types="@figma/plugin-typings" />
export function generateSmartName(node, parentName, index, options) {
    const type = node.type.toLowerCase();
    const casing = (str) => {
        if (options.namingStyle === "camelCase")
            return str.charAt(0).toLowerCase() + str.slice(1);
        if (options.namingStyle === "snake_case")
            return str.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
        return str; // PascalCase
    };
    const prefix = options.prefixes[type] || type;
    return casing(`${parentName}_${prefix}_${index}`);
}
export function renameChildrenRecursively(node, parentName, indexRef, options) {
    if ("children" in node) {
        for (const child of node.children) {
            if (options.preserve && !child.name.toLowerCase().includes("layer"))
                continue;
            indexRef.count++;
            const newName = generateSmartName(child, parentName, indexRef.count, options);
            child.name = newName;
            if ("children" in child) {
                renameChildrenRecursively(child, parentName, indexRef, options);
            }
        }
    }
}
