
import axios from 'axios';
import { GET_CHATS } from './actionTypes';
import { socket } from '../Components/HomePage/Home';

export const getAllChats = () => dispatch => {

    /*
        Get all previous conversatiions.
            Gets all converstaion from MongoDB.
            Run's on first render.
            
            Important to join rooms during first load.
    */

    axios.get('/chats/' + localStorage.getItem('sessionID'))
        .then(res => {
            if (res.data.serverResponse === 'success') {

                // Join rooms
                let rooms = [];
                res.data.chats.forEach(room => {
                    rooms.push(room.tag)
                })
                socket.emit('subscribe', { rooms: rooms })

                dispatch({
                    type: GET_CHATS,
                    payload: res.data.chats
                })
            }
        })
        .catch(err => console.log(err))
}

export const updateAllChats = () => dispatch => {

    /*
        Update your conversatiions.
            Gets all converstaion from MongoDB but only updates if there is a new message.
            Conversation Modals are re-rendered every time you get a messages.
            
            No need to join rooms here.
    */

    axios.get('/chats/' + localStorage.getItem('sessionID'))
        .then(res => {
            if (res.data.serverResponse === 'success') {
                dispatch({
                    type: GET_CHATS,
                    payload: res.data.chats
                })
            }
        })
        .catch(err => console.log(err))
}