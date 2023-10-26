// 1. Import utilities from `astro:content`

import { defineCollection, z } from 'astro:content'

// 2. Define your collection(s)
const acroCollection = defineCollection({
	type: 'content', // v2.5.0 and later
	schema: ({ image }) =>
		z.object({
			name: z.string(),
			aka: z.array(z.string()),
			level: z.enum(['easy', 'medium', 'hard']),
			image: image().refine((img) => img.width >= 600, {
				message: 'Cover image must be at least 1080 pixels wide!'
			}),
			video: z.optional(z.string()),
			to: z.array(
				z.object({
					pose: z.string(),
					video: z.string(),
					canGoBack: z.boolean()
				})
			),
			tags: z.array(z.string()),
			numPeople: z.enum(['two', 'three', 'more'])
		})
})

// 3. Export a single `collections` object to register your collection(s)
//    This key should match your collection directory name in "src/content"
export const collections = {
	acro: acroCollection
}
