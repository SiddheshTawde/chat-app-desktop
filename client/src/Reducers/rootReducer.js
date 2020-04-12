import { combineReducers } from 'redux';
import { loginReducer, signUpReducer } from './loginReducer';
import { userReducer } from './userReducer';
import { chatReducer } from './chatReducer';

export const rootReducer = combineReducers({
    isUserLoggedIn: loginReducer,
    userSignedUp: signUpReducer,
    userInfo: userReducer,
    chats: chatReducer
})