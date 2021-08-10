import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Header from './components/Header';
import Projects from './components/Projects.js';
import Articles from './components/Articles.js';
import About from './components/About.js';

function App() {
  return (
    <BrowserRouter>
      <div className="w-full mt-3 px-5 font-normal bg-black text-gray-300">
        <Header />
        <Switch>
          <Route exact path="/" component={Projects} />
          <Route path="/articles" component={Articles} />
          <Route path="/about" component={About} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
