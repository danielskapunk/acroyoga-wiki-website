export interface InstagramEmbed {
	embedUrl: string
	type: 'p' | 'reel' | 'tv'
}

export function getInstagramEmbed(rawUrl: string): InstagramEmbed | null {
	if (!rawUrl) return null
	try {
		const parsed = new URL(rawUrl)
		if (!/(^|\.)instagram\.com$/i.test(parsed.hostname)) return null
		const [type, code] = parsed.pathname.split('/').filter(Boolean)
		if ((type === 'p' || type === 'reel' || type === 'tv') && code) {
			return { embedUrl: `https://www.instagram.com/${type}/${code}/embed`, type }
		}
	} catch {}
	return null
}
