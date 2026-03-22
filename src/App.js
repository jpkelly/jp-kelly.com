import { useEffect, useRef, useState } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Header from './components/Header';
import Gallery from './components/Gallery';
import About from './components/About';
import ContactForm from './components/ContactForm';
import SanityProjectTemplate from './components/SanityProjectTemplate';
import { getProjectById } from './lib/sanity';
import { useSiteProjects } from './lib/siteProjects';
const projectMdxModules = import.meta.glob('./content/projects/*.mdx', { eager: true });

function getProjectIdFromMdxPath(path) {
	return path
		.split('/')
		.pop()
		?.replace(/\.mdx$/i, '') || '';
}

const projectContentComponents = Object.entries(projectMdxModules).reduce((acc, [path, module]) => {
	const projectId = getProjectIdFromMdxPath(path);
	const mdxComponent = module?.default;

	if (projectId && mdxComponent) {
		acc[projectId] = mdxComponent;
	}

	return acc;
}, {});

function buildProjectRoutes(projectList) {
	return projectList
		.map(project => {
			if (!project?.id || !project?.path) {
				return [];
			}

			const component = projectContentComponents[project.id] || null;
			const paths = [project.path, ...(project.aliases || [])];
			const title = project.seoTitle || `${project.cardTitle} | JP Kelly`;
			const description = project.seoDescription || project.cardText;
			const imagePath = project.seoImage || project.thumbnails?.[0]?.src || '/thumbnails/nac23vj.png';

			return paths.map(path => ({
				id: `${project.id}-${path}`,
				projectId: project.id,
				path,
				component,
				title,
				description,
				imagePath,
				canonicalPath: project.path
			}));
		})
		.flat();
}

const DEFAULT_TITLE = 'JP Kelly | Portfolio';
const DEFAULT_DESCRIPTION = 'Portfolio site for JP Kelly.';
const DEFAULT_IMAGE_PATH = '/thumbnails/nac23vj.png';

function normalizeImagePath(imagePath) {
	if (!imagePath) {
		return DEFAULT_IMAGE_PATH;
	}

	if (/^https?:\/\//i.test(imagePath)) {
		return imagePath;
	}

	return imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
}

function upsertMetaTag({ name, property, content }) {
	const selector = name ? `meta[name="${name}"]` : `meta[property="${property}"]`;
	let tag = document.querySelector(selector);
	let createdTag = false;
	const previousContent = tag?.getAttribute('content') || '';

	if (!tag) {
		tag = document.createElement('meta');
		if (name) {
			tag.setAttribute('name', name);
		}
		if (property) {
			tag.setAttribute('property', property);
		}
		document.head.appendChild(tag);
		createdTag = true;
	}

	tag.setAttribute('content', content);

	return () => {
		if (!tag) {
			return;
		}

		if (createdTag) {
			document.head.removeChild(tag);
		} else {
			tag.setAttribute('content', previousContent);
		}
	};
}

function upsertCanonicalTag(href) {
	let tag = document.querySelector('link[rel="canonical"]');
	let createdTag = false;
	const previousHref = tag?.getAttribute('href') || '';

	if (!tag) {
		tag = document.createElement('link');
		tag.setAttribute('rel', 'canonical');
		document.head.appendChild(tag);
		createdTag = true;
	}

	tag.setAttribute('href', href);

	return () => {
		if (!tag) {
			return;
		}

		if (createdTag) {
			document.head.removeChild(tag);
		} else {
			tag.setAttribute('href', previousHref);
		}
	};
}

function ProjectRoutePage({ component: ProjectComponent, title, description, imagePath, canonicalPath, projectId, ...routeProps }) {
	const [sanityProject, setSanityProject] = useState(null);

	useEffect(() => {
		let mounted = true;

		(async () => {
			try {
				const projectDoc = await getProjectById(projectId);
				if (mounted) {
					setSanityProject(projectDoc || null);
				}
			} catch (_err) {
				if (mounted) {
					setSanityProject(null);
				}
			}
		})();

		return () => {
			mounted = false;
		};
	}, [projectId]);

	useEffect(() => {
		const previousTitle = document.title;
		document.title = title || DEFAULT_TITLE;

		const effectiveDescription = description || DEFAULT_DESCRIPTION;
		const origin = window.location.origin;
		const effectiveCanonicalPath = canonicalPath || routeProps.location?.pathname || '/';
		const effectiveUrl = `${origin}${effectiveCanonicalPath}`;
		const normalizedImagePath = normalizeImagePath(imagePath);
		const effectiveImage = /^https?:\/\//i.test(normalizedImagePath)
			? normalizedImagePath
			: `${origin}${normalizedImagePath}`;

		const restoreMetaTags = [
			upsertMetaTag({ name: 'description', content: effectiveDescription }),
			upsertMetaTag({ property: 'og:type', content: 'website' }),
			upsertMetaTag({ property: 'og:site_name', content: 'JP Kelly' }),
			upsertMetaTag({ property: 'og:title', content: title || DEFAULT_TITLE }),
			upsertMetaTag({ property: 'og:description', content: effectiveDescription }),
			upsertMetaTag({ property: 'og:url', content: effectiveUrl }),
			upsertMetaTag({ property: 'og:image', content: effectiveImage }),
			upsertMetaTag({ name: 'twitter:card', content: 'summary_large_image' }),
			upsertMetaTag({ name: 'twitter:title', content: title || DEFAULT_TITLE }),
			upsertMetaTag({ name: 'twitter:description', content: effectiveDescription }),
			upsertMetaTag({ name: 'twitter:image', content: effectiveImage })
		];
		const restoreCanonicalTag = upsertCanonicalTag(effectiveUrl);

		return () => {
			document.title = previousTitle || DEFAULT_TITLE;
			restoreMetaTags.forEach(restore => restore());
			restoreCanonicalTag();
		};
	}, [title, description, imagePath, canonicalPath, routeProps.location]);

	const sanityVideos = Array.isArray(sanityProject?.videos) ? sanityProject.videos : [];
	const sanityContent = Array.isArray(sanityProject?.content) ? sanityProject.content : [];
	const shouldUseSanityTemplate = sanityVideos.length > 0 || sanityContent.length > 0;

	return (
		<div className="content-rail my-5 py-5">
			<div className="w-full">
				{shouldUseSanityTemplate ? (
					<SanityProjectTemplate project={sanityProject} />
				) : ProjectComponent ? (
					<ProjectComponent />
				) : (
					<p>Project details coming soon.</p>
				)}
			</div>
		</div>
	);
}

export function AppShell() {
	const shellRef = useRef(null);
	const projects = useSiteProjects();
	const projectRoutes = buildProjectRoutes(projects);

	useEffect(() => {
		const shell = shellRef.current;
		if (!shell || typeof window === 'undefined') {
			return undefined;
		}

		const updateContentOffset = () => {
			const logo = shell.querySelector('.logo-anchor');
			if (!logo) {
				return;
			}

			const shellLeft = shell.getBoundingClientRect().left;
			const logoLeft = logo.getBoundingClientRect().left;
			const offset = Math.max(0, Math.round(logoLeft - shellLeft - 15));
			shell.style.setProperty('--content-left-offset', `${offset}px`);
		};

		updateContentOffset();
		window.addEventListener('resize', updateContentOffset);

		let observer;
		if ('ResizeObserver' in window) {
			observer = new ResizeObserver(updateContentOffset);
			observer.observe(shell);
		}

		return () => {
			window.removeEventListener('resize', updateContentOffset);
			if (observer) {
				observer.disconnect();
			}
		};
	}, []);

	return (
		<div ref={shellRef} className="w-full mt-3 px-5 font-normal bg-black text-gray-300">
			<Header />
			<Switch>
				<Route exact path="/" component={Gallery} />
				<Route path="/gallery" component={Gallery} />
				<Route path="/about" component={About} />
				<Route path="/contactform" component={ContactForm} />
				{projectRoutes.map(route => (
					<Route
						key={route.id}
						path={route.path}
						render={routeProps => (
							<ProjectRoutePage
								{...routeProps}
								component={route.component}
								title={route.title}
								description={route.description}
								imagePath={route.imagePath}
								canonicalPath={route.canonicalPath}
								projectId={route.projectId}
							/>
						)}
					/>
				))}
				<Route
					path="/archive"
					component={() => {
						window.open('https://jpkelly.net');
						window.location.href = '/about';

						return null;
					}}
				/>
			</Switch>
		</div>
	);
}

function App() {
	return (
		<BrowserRouter>
			<AppShell />
		</BrowserRouter>
	);
}

export default App;
