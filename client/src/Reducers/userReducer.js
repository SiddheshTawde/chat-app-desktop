import { USER_INFO, USER_ONBOARDING } from "../Actions/actionTypes";

const userInfoState = {
    fullname: "",
    email: "",
    picture: '',
    picture_original: '',
    showOnboarding: false
}

export const userReducer = (state = userInfoState, action) => {
    switch (action.type) {
        case USER_INFO:
            return action.payload;

        case USER_ONBOARDING:
            return action.payload

        default:
            return state;
    }
}