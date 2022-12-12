import React from 'react';
import { Switch, Route, BrowserRouter as Router } from "react-router-dom";
import Login from './Login';
import Signup from './Signup';
import Panel from './Panel';
import "./App.css";
import { useStateValue } from "./StateProvider";

function App() {

  const [{ user }] = useStateValue();

  return (
    <div className="font-graphik">
      <Router>
        <Switch>
          {user ? (
            <Route path="/panel">
              <Panel />
            </Route>
          ) : <Route path="/" exact>
            <Login />
          </Route>}
          <Route path="/" exact>
            <Login />
          </Route>
          <Route path="/signup">
            <Signup />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
