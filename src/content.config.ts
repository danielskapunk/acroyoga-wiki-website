import { defineCollection } from 'astro:content'
import { z } from 'astro/zod'
import { glob } from 'astro/loaders'

const acroCollection = defineCollection({
	loader: glob({ base: './src/content/acro', pattern: '**/*.md' }),
	schema: ({ image }) =>
		z.object({
			name: z.string(),
			aka: z.array(z.string()),
			level: z.enum(['easy', 'medium', 'hard']),
			image: image(),
			video: z.optional(z.string()),
			to: z.array(
				z.object({
					pose: z.string(),
					slug: z.string().default(''),
					video: z.string().default(''),
					canGoBack: z.boolean().default(true)
				})
			),
			tags: z.array(z.string()),
			numPeople: z.enum(['two', 'three', 'more'])
		})
})

const seqCollection = defineCollection({
	loader: glob({ base: './src/content/seq', pattern: '**/*.md' }),
	schema: ({ image }) =>
		z.object({
			name: z.string(),
			aka: z.array(z.string()),
			level: z.enum(['easy', 'medium', 'hard']),
			image: image(),
			video: z.optional(z.string()),
			tags: z.array(z.string()),
			numPeople: z.enum(['two', 'three', 'more'])
		})
})

export const collections = {
	acro: acroCollection,
	seq: seqCollection
}
