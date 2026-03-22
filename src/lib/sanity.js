import { createClient } from '@sanity/client';

export const sanityClient = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
  dataset: import.meta.env.VITE_SANITY_DATASET,
  apiVersion: import.meta.env.VITE_SANITY_API_VERSION,
  useCdn: false,
});

export async function getAboutContent() {
  const query = `*[_type == "aboutPage"][0]`;
  return await sanityClient.fetch(query);
}

export async function getProjects() {
  const query = `*[_type == "project"] | order(order asc)`;
  return await sanityClient.fetch(query);
}
