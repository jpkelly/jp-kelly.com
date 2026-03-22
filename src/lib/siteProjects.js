import { useEffect, useState } from 'react';
import localProjects from '../content/projects.json';
import { getProjects } from './sanity';

function mergeProjectMetadata(localProject, sanityProject) {
	if (!sanityProject) {
		return localProject;
	}

	return {
		...localProject,
		path: sanityProject.path || localProject.path,
		aliases: Array.isArray(sanityProject.aliases) ? sanityProject.aliases : localProject.aliases,
		menuLabel: sanityProject.menuLabel || localProject.menuLabel,
		cardTitle: sanityProject.cardTitle || localProject.cardTitle,
		cardText: sanityProject.cardText || localProject.cardText
	};
}

export function orderProjectsBySanity(baseProjects, sanityProjects) {
	if (!Array.isArray(baseProjects) || baseProjects.length === 0) {
		return [];
	}

	if (!Array.isArray(sanityProjects) || sanityProjects.length === 0) {
		return baseProjects;
	}

	const baseProjectMap = new Map(baseProjects.map(project => [project.id, project]));
	const seenProjectIds = new Set();
	const orderedProjects = [];

	sanityProjects.forEach(sanityProject => {
		const localProject = baseProjectMap.get(sanityProject?.id);
		if (!localProject || seenProjectIds.has(localProject.id)) {
			return;
		}

		orderedProjects.push(mergeProjectMetadata(localProject, sanityProject));
		seenProjectIds.add(localProject.id);
	});

	baseProjects.forEach(project => {
		if (!seenProjectIds.has(project.id)) {
			orderedProjects.push(project);
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