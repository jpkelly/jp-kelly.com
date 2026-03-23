import { useEffect, useState } from 'react';
import localProjects from '../content/projects.json';
import { getProjects, sanityImageUrl } from './sanity';

const DEFAULT_THUMBNAIL = { src: '/thumbnails/nac23vj.png', alt: 'Project thumbnail' };

function normalizePath(pathValue) {
	if (typeof pathValue !== 'string' || !pathValue.trim()) {
		return '';
	}

	const trimmedPath = pathValue.trim();
	if (/^https?:\/\//i.test(trimmedPath)) {
		return trimmedPath;
	}

	return trimmedPath.startsWith('/') ? trimmedPath : `/${trimmedPath}`;
}

function normalizeThumbnailItem(thumbnail, fallbackAlt) {
	if (!thumbnail) {
		return null;
	}

	try {
		if (typeof thumbnail.src === 'string' && thumbnail.src.trim()) {
			return {
				src: normalizePath(thumbnail.src),
				alt: thumbnail.alt || fallbackAlt || DEFAULT_THUMBNAIL.alt
			};
		}

		const sanityImage = thumbnail.image || thumbnail;
		const sanitySrc = sanityImageUrl(sanityImage);
		if (!sanitySrc) {
			return null;
		}

		return {
			src: sanitySrc,
			alt: thumbnail.alt || fallbackAlt || DEFAULT_THUMBNAIL.alt
		};
	} catch (_err) {
		return null;
	}
}

function normalizeThumbnails(project) {
	const rawThumbnails = Array.isArray(project?.thumbnails) ? project.thumbnails : [];
	const normalized = rawThumbnails
		.map(thumbnail => normalizeThumbnailItem(thumbnail, project?.cardTitle))
		.filter(Boolean);

	if (normalized.length > 0) {
		return normalized;
	}

	const fallbackImage = normalizeThumbnailItem(project?.seoImage, project?.cardTitle);
	if (fallbackImage) {
		return [fallbackImage];
	}

	return [DEFAULT_THUMBNAIL];
}

function normalizeProject(project) {
	try {
		if (!project || typeof project !== 'object') {
			return null;
		}

		const id = typeof project.id === 'string' ? project.id.trim() : '';
		const path = normalizePath(project.path);
		const menuLabel = typeof project.menuLabel === 'string' ? project.menuLabel.trim() : '';
		const cardTitle = typeof project.cardTitle === 'string' ? project.cardTitle.trim() : '';
		const cardText = typeof project.cardText === 'string' ? project.cardText.trim() : '';
		const normalizedSeoImage = normalizeThumbnailItem(project.seoImage, cardTitle)?.src || null;

		if (!id || !path || !menuLabel || !cardTitle || !cardText) {
			return null;
		}

		return {
			...project,
			id,
			path,
			menuLabel,
			cardTitle,
			cardText,
			seoImage: normalizedSeoImage,
			aliases: Array.isArray(project.aliases) ? project.aliases.map(normalizePath).filter(Boolean) : [],
			thumbnails: normalizeThumbnails(project)
		};
	} catch (_err) {
		return null;
	}
}

function mergeProjectMetadata(localProject, sanityProject) {
	const merged = {
		...(localProject || {}),
		...(sanityProject || {})
	};

	return normalizeProject(merged);
}

export function orderProjectsBySanity(baseProjects, sanityProjects) {
	if (!Array.isArray(baseProjects)) {
		return [];
	}

	const normalizedBaseProjects = baseProjects.map(normalizeProject).filter(Boolean);
	if (!Array.isArray(sanityProjects) || sanityProjects.length === 0) {
		return normalizedBaseProjects;
	}

	const baseProjectMap = new Map(normalizedBaseProjects.map(project => [project.id, project]));
	const seenProjectKeys = new Set();
	const orderedProjects = [];

	sanityProjects.forEach(sanityProject => {
		const localProject = baseProjectMap.get(sanityProject?.id) || null;
		let mergedProject = null;
		try {
			mergedProject = mergeProjectMetadata(localProject, sanityProject);
		} catch (_err) {
			mergedProject = null;
		}
		const dedupeKey = `${mergedProject?.id || ''}::${mergedProject?.path || ''}`;
		if (!mergedProject || seenProjectKeys.has(dedupeKey)) {
			return;
		}

		orderedProjects.push(mergedProject);
		seenProjectKeys.add(dedupeKey);
	});

	normalizedBaseProjects.forEach(project => {
		const dedupeKey = `${project?.id || ''}::${project?.path || ''}`;
		if (!seenProjectKeys.has(dedupeKey)) {
			orderedProjects.push(project);
			seenProjectKeys.add(dedupeKey);
		}
	});

	return orderedProjects;
}

export function useSiteProjects() {
	const [projects, setProjects] = useState(localProjects);

	useEffect(() => {
		let isMounted = true;

		(async () => {
			try {
				const sanityProjects = await getProjects();
				if (!isMounted || !Array.isArray(sanityProjects) || sanityProjects.length === 0) {
					return;
				}

				setProjects(orderProjectsBySanity(localProjects, sanityProjects));
			} catch (_err) {
				// Keep local fallback ordering if Sanity is unavailable.
			}
		})();

		return () => {
			isMounted = false;
		};
	}, []);

	return projects;
}