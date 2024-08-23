import { UnistNode, UnistTree } from "types/unist"
import { visit } from "unist-util-visit"

export function rehypeNpmCommand() {
  return (tree: UnistTree) => {
    visit(tree, (node: UnistNode) => {
      if (node.type !== "element" || node?.tagName !== "pre") {
        return
      }

      // npm install or npm i.
      if (node.properties?.["__rawString__"]?.startsWith("npm i")) {
        const npmCommand = node.properties?.["__rawString__"]
        node.properties["__npmCommand__"] = npmCommand
        node.properties["__yarnCommand__"] = npmCommand.replace(
          "npm install",
          "yarn add"
        )
        node.properties["__pnpmCommand__"] = npmCommand.replace(
          "npm install",
          "pnpm add"
        )
        node.properties["__bunCommand__"] = npmCommand.replace(
          "npm install",
          "bun add"
        )
      }

      // npx create & npm create.
      if (node.properties?.["__rawString__"]?.startsWith("npx create-") || node.properties?.["__rawString__"]?.startsWith("npm create")) {
        const npmCommand = node.properties?.["__rawString__"]
        node.properties["__npmCommand__"] = npmCommand
        node.properties["__yarnCommand__"] = npmCommand.replace(
          /^(npm create|npx create-)/, "yarn create "
        )
        node.properties["__pnpmCommand__"] = npmCommand.replace(/^(npm create|npx create-)/, "pnpm create "),
        node.properties["__bunCommand__"] = npmCommand.replace(/^npm create/, "bun create").replace(/^npx/, "bunx --bun")
      }

      // npx.
      if (
        node.properties?.["__rawString__"]?.startsWith("npx") &&
        !node.properties?.["__rawString__"]?.startsWith("npx create-")
      ) {
        const npmCommand = node.properties?.["__rawString__"]
        node.properties["__npmCommand__"] = npmCommand
        node.properties["__yarnCommand__"] = npmCommand
        node.properties["__pnpmCommand__"] = npmCommand.replace(
          "npx",
          "pnpm dlx"
        )
        node.properties["__bunCommand__"] = npmCommand.replace(
          "npx",
          "bunx --bun"
        )
      }
    })
  }
}
