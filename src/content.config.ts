import { defineCollection } from 'astro:content'
import { z } from 'astro/zod'
import { glob } from 'astro/loaders'

const acroCollection = defineCollection({
	loader: glob({ base: './src/content/acro', pattern: '**/*.md' }),
	schema: ({ image }) =>
		z.object({
			name: z.string(),
			shortName: z.string().optional(),
			aka: z.array(z.string()),
			level: z.enum(['easy', 'medium', 'hard']),
			image: image(),
			video: z.optional(z.string()),
			transitions: z
				.array(
					z.object({
						name: z.string(),
						aka: z.array(z.string()).default([]),
						pose: z.string(),
						direction: z.enum(['in', 'out', 'both']),
						slug: z.string().optional(),
						video: z.optional(z.string())
					})
				)
				.default([]),
			tags: z.array(z.string()),
			numPeople: z.enum(['two', 'three', 'more'])
		})
})

const seqCollection = defineCollection({
	loader: glob({ base: './src/content/seq', pattern: '**/*.md' }),
	schema: ({ image }) =>
		z.object({
			name: z.string(),
			shortName: z.string().optional(),
			aka: z.array(z.string()),
			level: z.enum(['easy', 'medium', 'hard']),
			image: image(),
			video: z.optional(z.string()),
			tags: z.array(z.string()),
			numPeople: z.enum(['two', 'three', 'more'])
		})
})

const transitionsCollection = defineCollection({
	loader: glob({ base: './src/content/transitions', pattern: '**/*.md' }),
	schema: z.object({
		name: z.string(),
		aka: z.array(z.string()).default([]),
		video: z.optional(z.string()),
		tags: z.array(z.string()).default([])
	})
})

export const collections = {
	acro: acroCollection,
	seq: seqCollection,
	transitions: transitionsCollection
}
