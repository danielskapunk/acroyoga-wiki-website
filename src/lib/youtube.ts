import matcher from '@astro-community/astro-embed-youtube/matcher'

const bareId = /^[A-Za-z0-9_-]{11}$/

export interface YouTubeVideo {
	id: string
	start?: string
}

export function parseYouTube(url: string): YouTubeVideo | null {
	if (!url) return null
	const id = bareId.test(url) ? url : matcher(url)
	if (!id) return null
	let start: string | undefined
	try {
		const parsed = new URL(url)
		const raw = parsed.searchParams.get('t') || parsed.searchParams.get('start') || ''
		const seconds = raw.replace(/s$/, '')
		if (/^\d+$/.test(seconds)) start = seconds
	} catch {}
	return start ? { id, start } : { id }
}
