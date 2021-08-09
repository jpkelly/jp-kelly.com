import logo from './logo.svg';
// Import the BrowserRouter, Route and Link components
import { BrowserRouter, Route, Link } from 'react-router-dom';
import { Box, Button, Anchor, Header, Text, Menu, Grommet } from 'grommet';
import { Home } from 'grommet-icons';
import Projects from './Projects.js';
import Articles from './Articles.js';
import About from './About.js';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Header background="black">
          <div className="navigation-sub">
            <Button icon={<Home />} hoverIndicator />
            {/* <Anchor href="/" margin="small" label="Projects" />
            <Anchor href="/articles" margin="small" label="Articles" />
            <Anchor href="/about" margin="small" label="About" /> */}
            <Link to="/" className="item">
              Projects
            </Link>
            <Link to="/articles" className="item">
              Articles
            </Link>
            <Link to="/about" className="item">
              About
            </Link>
          </div>
        </Header>
        <div className="navigation">
          <div className="navigation-sub">
            <Link to="/" className="item">
              Projects
            </Link>
            <Link to="/articles" className="item">
              Articles
            </Link>
            <Link to="/about" className="item">
              About
            </Link>
          </div>
        </div>
        {/* // Set up the Router */}
        <Route exact path="/" component={Projects} />
        <Route path="/articles" component={Articles} />
        <Route path="/about" component={About} />
      </div>
    </BrowserRouter>
  );
}

export default App;
