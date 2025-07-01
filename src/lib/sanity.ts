import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!
const apiVersion = process.env.SANITY_API_VERSION || '2024-03-15'
const token = process.env.SANITY_TOKEN

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
})

const builder = imageUrlBuilder(sanityClient)

export const urlFor = (source: any) => builder.image(source)

export { projectId, dataset }
