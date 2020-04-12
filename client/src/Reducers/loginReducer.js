import { SIGN_IN, SIGN_UP, SIGN_OUT } from "../Actions/actionTypes";

let initialState;
// If sessionID in localStorage has any value:
if (localStorage.getItem('sessionID')) {
    //Then user is logged in
    initialState = true;
} else {
    // If localStorage is empty, then user logged out
    initialState = false; // false
}

export const loginReducer = (state = initialState, action) => {
    switch (action.type) {
        case SIGN_IN:
            return true;

        case SIGN_OUT:
            return false;

        default:
            return state;
    }
}

export const signUpReducer = (state = false, action) => {
    switch (action.type) {
        case SIGN_UP:
            return true;

        default:
            return state;
    }
}
