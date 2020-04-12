import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import './AddUser.css';
import { addUser, acceptUser, rejectUser } from '../../Actions/userAction';
import { socket } from '../HomePage/Home';

function AddUser({ addUser, acceptUser, rejectUser, updatePanel }) {
    // Get all users info
    const [allUsersList, setAllUsers] = useState(["checking"]);

    useEffect(() => {
        axios.post('/all', { sessionID: localStorage.getItem('sessionID') })
            .then(res => setAllUsers(res.data.allUsersInfo))
            .catch(err => console.log(err));

        socket.on("update chats", () => {
            axios.post('/all', { sessionID: localStorage.getItem('sessionID') })
                .then(res => setAllUsers(res.data.allUsersInfo))
                .catch(err => console.log(err))
        })
    }, []);

    return (
        <div className="add-user-wrapper grey darken-4 z-depth-1">
            <div className="add-user-header valign-wrapper">
                <p className="no-margin page-title grey-text text-lighten-4">Make new friends.</p>
                <div className="header-actions valign-wrapper">
                    <div className="input-field add-user-search-wrapper">
                        <i className="material-icons prefix">search</i>
                        <input type="search" placeholder="Search" autoComplete="off" spellCheck="false" autoCorrect="off" />
                    </div>
                    <button className="btn-flat button-text" onClick={() => updatePanel("DefaultScreen")}><span className="material-icons grey-text text-lighten-4">close</span></button>
                </div>
            </div>
            <ul className="no-margin h-100">
                {allUsersList[0] === "checking" ?
                    <li className="h-100 valign-wrapper button-text grey-text text-lighten-4" style={{ justifyContent: 'center' }}>Looking for people.</li> :
                    (allUsersList.length === 0 ?
                        <li className="h-100 valign-wrapper button-text grey-text text-lighten-4" style={{ justifyContent: 'center' }}>You are all alone.</li> :
                        (allUsersList.map((user, i) =>
                            <li key={i} className="user-card" >
                                <div className="user-card-wrapper grey darken-3 z-depth-1">
                                    <div className="row no-margin valign-wrapper" style={{ padding: '12px' }}>
                                        <div className="user-avatar-wrapper">
                                            <img src="/images/default_avatar.png" alt="" />
                                        </div>
                                        <div className="row no-margin user-info-wrapper">
                                            <div className="col s12">
                                                <p className="user-fullname grey-text text-lighten-4">{user.fullname}</p>
                                            </div>
                                            <div className="col s12">
                                                <p className="user-email grey-text">{user.email}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="user-status-wrapper row no-margin valign-wrapper">
                                        {user.isContact === 'false' ? <button type="button" className="btn-flat status-button green-text text-darken-1 button-text waves-effect waves-light" onClick={() => addUser(user.email)}>Add</button> : null}
                                        {user.isContact === 'true' ? <button type="button" className="btn-flat status-button red-text button-text waves-effect waves-light">Remove</button> : null}
                                        {user.isContact === 'awaiting' ? <button type="button" className="btn-flat status-button blue-text text-darken-2 button-text waves-effect waves-light">Awaiting</button> : null}
                                        {user.isContact === 'pending' ?
                                            <div className="valign-wrapper">
                                                <button type="button" className="btn-flat status-button green-text text-darken-1 button-text waves-effect waves-light" onClick={() => acceptUser(user.email)}>Accept</button>
                                                <button type="button" className="btn-flat status-button red-text button-text waves-effect waves-light" onClick={() => rejectUser(user.email)}>Reject</button>
                                            </div> :
                                            null
                                        }
                                    </div>
                                </div>
                            </li>
                        ))
                    )
                }
            </ul>
        </div>
    )
};

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = {
    addUser: addUser,
    acceptUser: acceptUser,
    rejectUser: rejectUser
}


export default connect(mapStateToProps, mapDispatchToProps)(AddUser);
