import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

// Environment variables with fallbacks for development
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'demo-project'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const apiVersion = process.env.SANITY_API_VERSION || '2024-03-15'
const token = process.env.SANITY_TOKEN

// Configuration validation
if (!projectId || projectId === 'demo-project') {
  console.warn('⚠️  Sanity project ID not configured. Using demo mode.')
  console.log('📝 To connect to your Sanity project:')
  console.log('   1. Copy .env.local.template to .env.local')
  console.log('   2. Add your Sanity project credentials')
  console.log('   3. Restart the development server')
}

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
  // Configure for demo mode if no project ID is provided
  ignoreBrowserTokenWarning: projectId === 'demo-project',
})

const builder = imageUrlBuilder(sanityClient)

export const urlFor = (source: any) => builder.image(source)

export { projectId, dataset }

// Demo mode flag
export const isDemoMode = projectId === 'demo-project'
