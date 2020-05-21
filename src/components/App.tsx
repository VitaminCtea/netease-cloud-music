import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
import Header from "./Header";
import Player from "containers/Player";
import Found from "containers/Found";
import User from "containers/User";
import Login from "containers/Login";
import Register from "components/Register";

function App() {
  return (
    <Router>
      <Header />
      <Switch>
        <Route exact path={"/login"} component={Login} />
        <Route exact path={"/register"} component={Register} />
        <Route exact path={"/found"} component={Found} />
        <Route exact path={"/video"} component={Video} />
        <Route exact path={"/cloudVillage"} component={CloudVillage} />
        <Route exact path={"/"} component={User} />
        <Redirect to={"/found"} />
      </Switch>
      <Player />
    </Router>
  );
}

const Video = () => (
  <div>
    video.........................................................................................
  </div>
);
const CloudVillage = () => (
  <div>
    CloudVillage.........................................................................................
  </div>
);

export default App;
