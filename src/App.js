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
		return paths.map(path => ({
			id: `${project.id}-${path}`,
			path,
			component
		}));
	})
	.flat();

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
						<Route key={route.id} path={route.path} component={route.component} />
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
