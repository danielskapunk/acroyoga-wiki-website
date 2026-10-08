import { getCollection } from 'astro:content'

export function slugify(name: string): string {
	return name
		.toLowerCase()
		.normalize('NFKD')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
}

function prettify(slug: string): string {
	return slug
		.split('-')
		.filter(Boolean)
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ')
}

export interface ResolvedLink {
	label: string
	href: string | null
}

export async function buildTransitionContext() {
	const [acroEntries, transitionEntries] = await Promise.all([
		getCollection('acro'),
		getCollection('transitions')
	])
	const poseMeta = new Map(
		acroEntries.map((entry) => [
			entry.id,
			{
				name: entry.data.name,
				shortName: entry.data.shortName
			}
		])
	)
	const transitionIds = new Set(transitionEntries.map((entry) => entry.id))

	return {
		poseInfo(slug: string): ResolvedLink {
			const meta = poseMeta.get(slug)
			if (!meta) {
				return { label: prettify(slug), href: null }
			}
			const label = meta.shortName && meta.shortName.trim() ? meta.shortName : meta.name
			return label ? { label, href: `/acro/${slug}` } : { label: prettify(slug), href: null }
		},
		transitionInfo(t: { name: string; slug?: string }): ResolvedLink {
			const id = t.slug || slugify(t.name)
			return {
				label: t.name,
				href: transitionIds.has(id) ? `/transitions/${id}` : null
			}
		}
	}
}

export type TransitionContext = Awaited<ReturnType<typeof buildTransitionContext>>
