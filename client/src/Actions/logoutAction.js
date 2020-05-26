import axios from 'axios';
import { SIGN_OUT } from '../Actions/actionTypes';
import { toast } from 'materialize-css';
import { socket } from '../Components/HomePage/Home';

export const signOutAction = history => dispatch => {
    axios.post('/signout', { sessionID: localStorage.getItem('sessionID') })
        .then(res => {
            if (res.data.serverResponse === 'success') {
                // Clean up
                localStorage.removeItem('sessionID');
                dispatch({
                    type: SIGN_OUT
                })

                socket.emit("User Offline", localStorage.getItem("sessionID"));

                history.push('/login');
            } else {
                // Error on server side
                toast({ html: `<span>${res.data.serverResponse}</span><button class="btn-flat toast-action" onclick="M.Toast.dismissAll()"><i class="material-icons grey-text text-darken-4">close</i></button>`, classes: "grey lighten-4 red-text text-darken-2", displayLength: 4000 })
            }
        })
        .catch(err => console.log(err))
}