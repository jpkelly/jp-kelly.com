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

function App() {
	return (
		<BrowserRouter>
			<div className="w-full mt-3 px-5 font-normal bg-black text-gray-300">
				<Header />
				<Switch>
					<Route exact path="/" component={Gallery} />
					<Route path="/gallery" component={Gallery} />
					<Route path="/about" component={About} />
					<Route path="/huds" component={Huds} />
					<Route path="/cranestory" component={Cranestory} />
					<Route path="/craneflock" component={Craneflock} />
					<Route path="/nac18" component={Nac18} />
					<Route path="/saturn" component={Saturn} />
					<Route path="/F8interactive" component={F8interactive} />
					<Route path="/Houdini" component={Houdini} />
					<Route path="/contactform" component={ContactForm} />
					<Route path="/nac19" component={Nac19} />
					<Route path="/PIWorks" component={PIWorks} />
					<Route path="/TOTO" component={TOTO} />
					<Route path="/manhole" component={Manhole} />
					<Route path="/encoder" component={Encoder} />
					<Route path="/jpio" component={JpIO} />
					<Route path="/notchimag" component={NotchIMAG} />
					<Route path="/nac23vj" component={NAC23VJ} />
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
