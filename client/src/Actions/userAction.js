import axios from "axios";
import { SIGN_OUT, USER_INFO, USER_ONBOARDING } from "./actionTypes";

export const getUserInfo = () => dispatch => {
    axios.get('/users/' + localStorage.getItem('sessionID'))
        .then(res => {
            if (res.data.serverResponse === 'success') {
                dispatch({
                    type: USER_INFO,
                    payload: res.data.userInfo
                })
            } else {
                if (res.data.serverResponse === 'logout') {
                    localStorage.removeItem('sessionID');
                    dispatch({
                        type: SIGN_OUT
                    })
                }
            }
        })
        .catch(err => {
            console.log(err);
        })
};

export const addUser = email => dispatch => {
    axios.post("/users/add", { userEmail: email, sessionID: localStorage.getItem('sessionID') })
        .then(res => {
            if (res.data.serverResponse === 'logout') {
                localStorage.removeItem('sessionID');
                dispatch({
                    type: SIGN_OUT
                })
            }
        })
        .catch(err => console.log(err))
}

export const acceptUser = email => dispatch => {
    axios.post("/users/accept", { userEmail: email, sessionID: localStorage.getItem('sessionID') })
        .then(res => {
            if (res.data.serverResponse === 'logout') {
                localStorage.removeItem('sessionID');
                dispatch({
                    type: SIGN_OUT
                })
            }
        })
        .catch(err => console.log(err))
}

export const rejectUser = email => dispatch => {
    axios.post("/users/reject", { userEmail: email, sessionID: localStorage.getItem('sessionID') })
        .then(res => {
            if (res.data.serverResponse === 'logout') {
                localStorage.removeItem('sessionID');
                dispatch({
                    type: SIGN_OUT
                })
            }
        })
        .catch(err => console.log(err))
}

export const removeUser = email => () => {
    axios.post("/users/remove", { userEmail: email, sessionID: localStorage.getItem('sessionID') })
        .catch(err => console.log(err))
}

export const onboardingUser = () => dispatch => {
    axios.post('/users/onboarding', { sessionID: localStorage.getItem("sessionID") })
        .then(res => {
            if (res.data.serverResponse === 'success') {
                dispatch({
                    type: USER_ONBOARDING,
                    payload: res.data.userInfo
                })
            }
        })
        .catch(err => {

        })
}