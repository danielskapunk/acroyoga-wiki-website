import { getCollection } from 'astro:content'

// Outputs: /builtwith.json
export async function GET({ params, request }) {
	const acroEntries = await getCollection('acro')
	return new Response(JSON.stringify(acroEntries))
}
