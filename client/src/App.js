import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import './App.css';

// Components
// import Home from './Components/HomePage/Home';
// import Login from './Components/LoginPage/Login';

const Home = lazy(() => import('./Components/HomePage/Home'));
const Login = lazy(() => import('./Components/LoginPage/Login'));

function App({ isUserLoggedIn }) {

  const HomeRoute = ({ loginStaus, ...props }) =>
    loginStaus === true || localStorage.getItem('sessionID') ? <Route {...props} /> : <Redirect to="/login" />

  const LoginRoute = ({ loginStaus, ...props }) =>
    loginStaus === false ? <Route {...props} /> : <Redirect to="/" />

  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Switch>
          <HomeRoute loginStaus={isUserLoggedIn} exact path="/" component={Home} />
          <LoginRoute loginStaus={isUserLoggedIn} exact path="/login" component={Login} />
        </Switch>
      </Suspense>
    </Router>
  );
}

const mapStateToProps = state => ({
  isUserLoggedIn: state.isUserLoggedIn
})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(App);
