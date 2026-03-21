import { useEffect } from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import Header from './components/Header';
import Gallery from './components/Gallery';
import About from './components/About';
import Huds from './components/Huds';
import Cranestory from './components/Cranestory';
import Craneflock from './components/Craneflock';
import Nac18 from './components/Nac18';
import Saturn from './components/Saturn';
import F8interactive from './components/F8interactive';
import Houdini from './components/Houdini';
import ContactForm from './components/ContactForm';
import Nac19 from './components/Nac19';
import PIWorks from './components/PIWorks';
import TOTO from './components/TOTO';
import Manhole from './components/Manhole';
import Encoder from './components/Encoder';
import JpIO from './components/JpIO';
import NotchIMAG from './components/NotchIMAG';
import NAC23VJ from './components/NAC23VJ';
import projects from './content/projects.json';

const projectRouteComponents = {
	NAC23VJ,
	NotchIMAG,
	JpIO,
	Encoder,
	F8interactive,
	Cranestory,
	Craneflock,
	PIWorks,
	Huds,
	Saturn,
	Nac18,
	Nac19,
	Houdini,
	TOTO,
	Manhole
};

const projectRoutes = projects
	.map(project => {
		const component = projectRouteComponents[project.routeKey];
		if (!component) {
			return [];
		}

		const paths = [project.path, ...(project.aliases || [])];
		const title = project.seoTitle || `${project.cardTitle} | JP Kelly`;
		const description = project.seoDescription || project.cardText;
		const imagePath = project.seoImage || project.thumbnails?.[0]?.src || '/thumbnails/nac23vj.png';
		return paths.map(path => ({
			id: `${project.id}-${path}`,
			path,
			component,
			title,
			description,
			imagePath,
			canonicalPath: project.path
		}));
	})
	.flat();

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

function ProjectRoutePage({ component: ProjectComponent, title, description, imagePath, canonicalPath, ...routeProps }) {
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

		return () => {
			document.title = previousTitle || DEFAULT_TITLE;
			restoreMetaTags.forEach(restore => restore());
		};
	}, [title, description, imagePath, canonicalPath, routeProps.location]);

	return <ProjectComponent {...routeProps} />;
}

function App() {
	return (
		<BrowserRouter>
			<div className="w-full mt-3 px-5 font-normal bg-black text-gray-300">
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
		</BrowserRouter>
	);
}

export default App;
