import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Header from './components/Header';
import Gallery from './components/Gallery';
import About from './components/About';
import Huds from './components/Huds';
import Cranestory from './components/Cranestory';
import Craneflock from './components/Craneflock';
import Nac2018 from './components/Nac2018';
import Saturn from './components/Saturn';
import F8interactive from './components/F8interactive';
import Houdini from './components/Houdini';
import ContactForm from './components/ContactForm';

function App() {
  return (
    <BrowserRouter>
      <div className="w-full mt-3 px-5 font-normal bg-black text-gray-300">
        <Header />
        <Switch>
          <Route exact path="/" component={About} />
          <Route path="/gallery" component={Gallery} />
          <Route path="/about" component={About} />
          <Route path="/huds" component={Huds} />
          <Route path="/cranestory" component={Cranestory} />
          <Route path="/craneflock" component={Craneflock} />
          <Route path="/nac2018" component={Nac2018} />
          <Route path="/saturn" component={Saturn} />
          <Route path="/F8interactive" component={F8interactive} />
          <Route path="/Houdini" component={Houdini} />
          <Route path="/contactform" component={ContactForm} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
