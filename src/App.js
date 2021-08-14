import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Header from './components/Header';
import Projects from './components/Projects.js';
import About from './components/About.js';
import Cranestory from './components/Cranestory.js';
import Nac2018 from './components/Nac2018.js';

function App() {
  return (
    <BrowserRouter>
      <div className="w-full mt-3 px-5 font-normal bg-black text-gray-300">
        <Header />
        <Switch>
          <Route exact path="/" component={About} />
          <Route path="/projects" component={Projects} />
          <Route path="/about" component={About} />
          <Route path="/cranestory" component={Cranestory} />
          <Route path="/nac2018" component={Nac2018} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
