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


function App() {
    return (

        <Router>
            <div>
                <AppBar position="static">
                    <Toolbar>
                        <Button aria-label="menu">
                            <Link to="/">Dashboard</Link>
                        </Button>
                        <Button aria-label="menu">
                            <Link to="/users">Users</Link>
                        </Button>
                    </Toolbar>
                </AppBar>

                {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
                <Switch>
                    <Route path="/users">
                        <User/>
                    </Route>
                    <Route path="/">
                        <Dashboard/>
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}

export default App;