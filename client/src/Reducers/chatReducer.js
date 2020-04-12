import { GET_CHATS } from "../Actions/actionTypes";

export const chatReducer = (state = ["checking"], action) => {
    switch (action.type) {
        case GET_CHATS:
            return action.payload

        default:
            return state;
    }
}