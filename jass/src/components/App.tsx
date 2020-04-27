import React from 'react';
import '../styles/App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Dashboard from './Dashboard';
import User from './User';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import GameBoard from './GameBoard';
import CreateGame from "./CreateGame";

function App() {
  return (
      <Router>
        <div>
          <AppBar position="static">
            <Toolbar>
              <Button className={"headerButton"} aria-label="menu">
                <Link className={"headerLink"} to="/">Dashboard</Link>
              </Button>
              <Button className={"headerButton"} aria-label="menu">
                <Link className={"headerLink"} to="/users">Users</Link>
              </Button>
            </Toolbar>
          </AppBar>

          {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
          <Switch>
            <Route path="/users">
              <User/>
            </Route>
            <Route path="/game/create">
              <CreateGame/>
            </Route>
            <Route path="/game/:id" render={(props) => <GameBoard {...props}/>}
            />
            <Route path="/">
              <Dashboard/>
            </Route>

          </Switch>
        </div>
      </Router>
  );
}

export default App;
