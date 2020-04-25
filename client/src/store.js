import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import { rootReducer } from './Reducers/rootReducer';

// createStore requires (rootReducer & enhancers). - developement
// export const store = createStore(rootReducer, compose(applyMiddleware(thunk), window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f))

// createStore requires (rootReducer & enhancers). - production
export const store = createStore(rootReducer, applyMiddleware(thunk))