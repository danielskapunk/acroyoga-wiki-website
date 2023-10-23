import mdx from "@astrojs/mdx";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";
import { h } from "hastscript";
import remarkDirective from "remark-directive";
import { visit } from "unist-util-visit";

function remarkSectionPlugin() {
  return function (tree) {
    console.log("tree", tree);
    visit(tree, function (node) {
      if (
        node.type === "containerDirective" ||
        node.type === "leafDirective" ||
        node.type === "textDirective"
      ) {
        const data = node.data || (node.data = {});
        const hast = h(node.name, node.attributes || {});

        data.hName = hast.tagName;
        data.hProperties = hast.properties;
      }
    });
  };
}

// https://astro.build/config
export default defineConfig({
  markdown: {
    remarkPlugins: [remarkDirective, remarkSectionPlugin],
  },
  integrations: [mdx(), tailwind()],
});
