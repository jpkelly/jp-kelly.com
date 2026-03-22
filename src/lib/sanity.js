import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID;
const dataset = import.meta.env.VITE_SANITY_DATASET;
const apiVersion = import.meta.env.VITE_SANITY_API_VERSION || '2024-03-13';

export const sanityClient = projectId && dataset
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
    })
  : null;

const urlBuilder = sanityClient ? createImageUrlBuilder(sanityClient) : null;

export function sanityImageUrl(source) {
  if (!urlBuilder || !source) {
    return null;
  }

  return urlBuilder.image(source).url();
}

export async function getAboutContent() {
  if (!sanityClient) {
    return null;
  }

  const query = `*[_type == "aboutPage"][0]`;
  return await sanityClient.fetch(query);
}

export async function getProjects() {
  if (!sanityClient) {
    return [];
  }

  const query = `*[_type == "project"] | order(order asc)`;
  return await sanityClient.fetch(query);
}

export async function getProjectById(projectIdValue) {
  if (!sanityClient || !projectIdValue) {
    return null;
  }

  const query = `*[_type == "project" && id == $projectId][0]`;
  return await sanityClient.fetch(query, { projectId: projectIdValue });
}
