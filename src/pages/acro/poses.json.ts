import { getCollection } from 'astro:content'

// Outputs: /builtwith.json
export async function GET({ params, request }) {
	const acroEntries = await getCollection('acro')
	// Keep the legacy filename order (Content Layer sorts by entry id instead)
	acroEntries.sort((a, b) => {
		const x = String(a.filePath)
		const y = String(b.filePath)
		return x < y ? -1 : x > y ? 1 : 0
	})
	return new Response(JSON.stringify(acroEntries))
}
