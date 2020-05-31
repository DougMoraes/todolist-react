import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import LoginForm from "../LoginForm/LoginForm";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/login" component={LoginForm} />
      </Switch>
    </Router>
  );
}

export default App;
