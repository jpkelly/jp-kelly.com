import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID || 'tl4n7qut';
const dataset = import.meta.env.VITE_SANITY_DATASET || 'production';
const apiVersion = import.meta.env.VITE_SANITY_API_VERSION || '2024-03-13';
const proxyPath = import.meta.env.VITE_SANITY_PROXY_PATH || '/sanity-proxy.php';
const forceProxy = (import.meta.env.VITE_SANITY_USE_PROXY || '').toLowerCase() === 'true';

export const sanityClient = projectId && dataset
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
    })
  : null;

const urlBuilder = sanityClient ? createImageUrlBuilder(sanityClient) : null;

function shouldUseProxy() {
  if (typeof window === 'undefined') {
    return false;
  }

  if (forceProxy) {
    return true;
  }

  const host = window.location.hostname;
  return host !== 'localhost' && host !== '127.0.0.1';
}

async function fetchViaProxy(action, params = {}) {
  if (!shouldUseProxy()) {
    return { handled: false, value: null };
  }

  try {
    const url = new URL(proxyPath, window.location.origin);
    url.searchParams.set('action', action);
    // Bust intermediary/browser caches so recently published Sanity changes show up immediately.
    url.searchParams.set('_ts', String(Date.now()));

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, String(value));
      }
    });

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });

    if (!response.ok) {
      return { handled: false, value: null };
    }

    const payload = await response.json();
    if (!payload || payload.ok !== true) {
      return { handled: false, value: null };
    }

    return {
      handled: true,
      value: payload.result ?? null,
    };
  } catch (_err) {
    return { handled: false, value: null };
  }
}

export function sanityImageUrl(source) {
  if (!urlBuilder || !source) {
    return null;
  }

  return urlBuilder.image(source).url();
}

export async function getAboutContent() {
  const proxyResponse = await fetchViaProxy('about');
  if (proxyResponse.handled) {
    return proxyResponse.value;
  }

  if (!sanityClient) {
    return null;
  }

  const query = `*[_type == "aboutPage"][0]`;
  return await sanityClient.fetch(query);
}

export async function getProjects() {
  const proxyResponse = await fetchViaProxy('projects');
  if (proxyResponse.handled) {
    return Array.isArray(proxyResponse.value) ? proxyResponse.value : [];
  }

  if (!sanityClient) {
    return [];
  }

  const query = `*[_type == "project"] | order(defined(orderRank) desc, orderRank asc, order asc)`;
  return await sanityClient.fetch(query);
}

export async function getMenuLinks() {
  const proxyResponse = await fetchViaProxy('menuLinks');
  if (proxyResponse.handled) {
    return Array.isArray(proxyResponse.value) ? proxyResponse.value : [];
  }

  if (!sanityClient) {
    return [];
  }

  const query = `*[_type == "siteSettings"][0].menuLinks`;
  const result = await sanityClient.fetch(query);
  return Array.isArray(result) ? result : [];
}

export async function getProjectById(projectIdValue) {
  const proxyResponse = await fetchViaProxy('projectById', { projectId: projectIdValue });
  if (proxyResponse.handled) {
    return proxyResponse.value;
  }

  if (!sanityClient || !projectIdValue) {
    return null;
  }

  const query = `*[_type == "project" && id == $projectId][0]`;
  return await sanityClient.fetch(query, { projectId: projectIdValue });
}
