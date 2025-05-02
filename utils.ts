/// <reference types="@figma/plugin-typings" />

interface RenameOptions {
  namingStyle: 'camelCase' | 'snake_case' | 'PascalCase';
  prefixes: { [key: string]: string };
  preserve: boolean;
}

export function generateSmartName(
  node: SceneNode,
  parentName: string,
  index: number,
  options: RenameOptions
): string {
  const type = node.type.toLowerCase();
  const casing = (str: string): string => {
    if (options.namingStyle === "camelCase") return str.charAt(0).toLowerCase() + str.slice(1);
    if (options.namingStyle === "snake_case") return str.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
    return str; // PascalCase
  };

  const prefix = options.prefixes[type] || type;
  return casing(`${parentName}_${prefix}_${index}`);
}

export function renameChildrenRecursively(
  node: SceneNode & ChildrenMixin,
  parentName: string,
  indexRef: { count: number },
  options: RenameOptions
): void {
  if ("children" in node) {
    for (const child of node.children) {
      if (options.preserve && !child.name.toLowerCase().includes("layer")) continue;
      indexRef.count++;
      const newName = generateSmartName(child, parentName, indexRef.count, options);
      child.name = newName;
      if ("children" in child) {
        renameChildrenRecursively(child as SceneNode & ChildrenMixin, parentName, indexRef, options);
      }
    }
  }
}