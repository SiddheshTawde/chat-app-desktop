import React, { useState, useEffect } from 'react';
import './Home.css';
import LostAstronaut from './lost-astronaut.png';
import LonelyAstronaut from './lonely-astronaut.png'
import { connect } from 'react-redux';
import io from 'socket.io-client';
import { signOutAction } from '../../Actions/loginAction';
import { getUserInfo } from '../../Actions/userAction';
import { getAllChats } from '../../Actions/chatAction';
import AddUser from '../AddUserPage/AddUser';
import Chat from '../ChatScreen/Chat';
import Onboarding from '../OnboardingScreen/Onboarding';

export const socket = io('/');

function Home({ signOutAction, getUserInfo, getAllChats, userInfo, chats }) {

    const [showPanel, updatePanel] = useState("DefaultScreen");

    useEffect(() => {
        getUserInfo();
        getAllChats();
    }, [getUserInfo, getAllChats])

    useEffect(function () {
        socket.on("update chats", () => getAllChats());
        socket.on("conversations", () => {
            getAllChats();
            updatePanel("ChatScreen")
        })
    })

    const [currentChatInfo, updateChatInfo] = useState({})
    const handleChatToggle = (chatInfo) => {
        updateChatInfo(chatInfo);
        updatePanel("ChatScreen");
    }

    return (
        <div className='home-wrapper'>
            <div className="navbar-fixed">
                <nav>
                    <div className="nav-wrapper grey darken-4">
                        <p className="brand-logo no-margin">Welcome, <span className="profile-trigger">{userInfo.fullname.split(" ")[0]}</span></p>
                        <ul className="right hide-on-med-and-down">
                            <li className="notifications-wrapper">
                                <div className="notificaiton-count red circle valign-wrapper">
                                    <p className="no-margin grey-text text-lighten-4">0</p>
                                </div>
                                <button className='btn-flat grey-text text-lighten-4 material-icons' style={{ textTransform: "none", fontSize: 18 }}>notifications</button>
                            </li>
                            <li>
                                <button className='btn-flat grey-text text-lighten-4 button-text' style={{ textTransform: "none" }} onClick={() => signOutAction()}>Sign Out</button>
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>
            <div className="row no-margin h-100">
                <div className="col s12 l3 h-100 z-depth-1 grey darken-4">
                    <ul className="collection no-margin">
                        {chats[0] === "checking" ?
                            <li className="h-100 valign-wrapper">
                                <div className="w-100 center-align">
                                    <p className="button-text grey-text">Checking Messages...</p>
                                </div>
                            </li> :
                            (chats.length > 0 ?
                                (chats.map((chat, i) =>
                                    <li key={i} className="collection-item avatar grey darken-3" onClick={() => handleChatToggle({ tag: chat.tag, user: chat.participants[0], messages: chat.messages, isGroup: chat.isGroup, displayname: chat.displayname })}>
                                        <img src={chat.participants[0].picture === "" ? "images/default_avatar.png" : chat.participants[0].picture} alt="avatar" className="circle" />
                                        <span className="title white-text">{chat.participants[0].fullname}</span>
                                        <p>{chat.messages.length === 0 ? "No previous conversations" : chat.messages[chat.messages.length - 1].body}</p>
                                        <div className="secondary-content">{chat.messages.length > 0 ? (new Date(chat.messages[chat.messages.length - 1].timestamp)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}</div>
                                    </li>
                                )) :
                                <li className="h-100 valign-wrapper">
                                    <div className="w-100 center-align" style={{ cursor: "pointer" }} onClick={() => updatePanel("AddUserScreen")}>
                                        <img src={LostAstronaut} alt="No Connections" className="no-connections-image" style={{ opacity: showPanel === "AddUserScreen" ? 0.2 : 1 }} />
                                        <button className="btn-flat no-margin button-text grey-text" disabled={showPanel === "AddUserScreen" ? true : false}>Make some friends.</button>
                                    </div>
                                </li>
                            )
                        }
                    </ul>
                </div>
                <div className="col s12 l9 hide-on-med-and-down h-100">
                    {showPanel === "DefaultScreen" ?
                        (chats[0] === 'checking' ?
                            <div className="default-wrapper">
                                <div className="h-100 valign-wrapper" style={{ justifyContent: "center", flexDirection: "column" }}>
                                    <p className="button-text grey-text">Checking Messages...</p>
                                </div>
                            </div> :
                            (chats.length > 0 ?
                                <div className="default-wrapper">
                                    <div className="h-100 valign-wrapper" style={{ justifyContent: "center", flexDirection: "column" }}>
                                        <p className="button-text white-text">Start a Conversation</p>
                                        <p className="button-text white-text">OR</p>
                                        <button className="btn button-text grey darken-3 waves-effect waves-light" onClick={() => updatePanel("AddUserScreen")}>Find People</button>
                                    </div>
                                </div> :
                                <div className="default-wrapper">
                                    <div className="h-100 valign-wrapper" style={{ justifyContent: "center", flexDirection: "column" }}>
                                        <p className="button-text grey-text">You don't have Friends</p>
                                        <img src={LonelyAstronaut} alt="" />
                                    </div>
                                </div>
                            )
                        ) : null
                    }

                    {showPanel === "ChatScreen" ?
                        <Chat chatInfo={currentChatInfo} updatePanel={updatePanel} /> : null
                    }

                    {showPanel === "AddUserScreen" ?
                        <AddUser updatePanel={updatePanel} /> : null
                    }
                </div>
            </div>

            {userInfo.showOnboarding ? <Onboarding updatePanel={updatePanel} /> : null}
        </div>
    )
}

const mapStateToProps = state => ({
    userInfo: state.userInfo,
    chats: state.chats
})

const mapDispatchToProps = {
    signOutAction,
    getUserInfo,
    getAllChats
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
