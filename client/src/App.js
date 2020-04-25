import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import './App.css';

// Components
import Home from './Components/HomePage/Home';
import Login from './Components/LoginPage/Login';

function App({ isUserLoggedIn }) {

  const HomeRoute = ({ loginStaus, ...props }) =>
    loginStaus === true || localStorage.getItem('sessionID') ? <Route {...props} /> : <Redirect to="/login" />

  const LoginRoute = ({ loginStaus, ...props }) =>
    loginStaus === false ? <Route {...props} /> : <Redirect to="/" />

  return (
    <Router>
      <Switch>
        <HomeRoute loginStaus={isUserLoggedIn} exact path="/" component={Home} />
        <LoginRoute loginStaus={isUserLoggedIn} exact path="/login" component={Login} />
      </Switch>
    </Router>
  );
}

const mapStateToProps = state => ({
  isUserLoggedIn: state.isUserLoggedIn
})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(App);
