import { unified } from '@astrojs/markdown-remark'
import icon from 'astro-icon'
import pagefind from 'astro-pagefind'
import { defineConfig } from 'astro/config'
import { h } from 'hastscript'
import remarkDirective from 'remark-directive'
import { visit } from 'unist-util-visit'

// Sorrund block with tag see https://github.com/remarkjs/remark-directive
function remarkSectionPlugin() {
	return function (tree) {
		visit(tree, function (node) {
			if (
				node.type === 'containerDirective' ||
				node.type === 'leafDirective' ||
				node.type === 'textDirective'
			) {
				const data = node.data || (node.data = {})
				const hast = h(node.name, node.attributes || {})

				data.hName = hast.tagName
				data.hProperties = hast.properties
			}
		})
	}
}

// https://astro.build/config
export default defineConfig({
	// site: 'https://danielskapunk.github.io',
	// base: '/acroyoga-wiki-website',
	// output: 'hybrid',
	build: {
		format: 'file'
	},
	markdown: {
		processor: unified({ remarkPlugins: [remarkDirective, remarkSectionPlugin] })
	},
	integrations: [icon(), pagefind()]
})
