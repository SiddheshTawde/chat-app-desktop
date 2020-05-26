import React, { useState, useEffect } from 'react';
import './Home.css';
import LostAstronaut from './lost-astronaut.png';
import LonelyAstronaut from './lonely-astronaut.png'
import { connect } from 'react-redux';
import io from 'socket.io-client';
import { Modal, Sidenav } from 'materialize-css';

import { signOutAction } from '../../Actions/logoutAction';
import { getUserInfo } from '../../Actions/userAction';
import { getAllChats } from '../../Actions/chatAction';
import AddUser from '../AddUserPage/AddUser';
import Chat from '../ChatScreen/Chat';
import Onboarding from '../OnboardingScreen/Onboarding';

export const socket = io('/');

function Home({ signOutAction, getUserInfo, getAllChats, userInfo, chats }) {

    const [showPanel, updatePanel] = useState("DefaultScreen");

    useEffect(() => {
        Modal.init(document.getElementById('logout-modal'), {
            dismissible: false
        });

        Sidenav.init(document.getElementById('main-sidenav'))
    }, [])

    useEffect(() => {
        getUserInfo();
        getAllChats();
    }, [getUserInfo, getAllChats])

    useEffect(function () {
        socket.on("update chats", () => getAllChats());
        socket.on("update user status", (data) => getAllChats());
        socket.on("conversations", () => {
            getAllChats();
            updatePanel("ChatScreen")
        })
    });

    useEffect(function () {
        socket.emit("User Online", localStorage.getItem("sessionID"));

        window.BeforeUnloadEvent = function () {
            socket.emit("User Offline", localStorage.getItem("sessionID"));
        }
    }, []);

    const [currentChatInfo, updateChatInfo] = useState({})
    const handleChatToggle = (chatInfo) => {
        updateChatInfo(chatInfo);
        updatePanel("ChatScreen");
    }

    /*
    Detect System's Theme and set app's theme.

    This can be changed later from home screen
    */

    if (window.localStorage.getItem('data-theme') === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        window.localStorage.setItem('data-theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        window.localStorage.setItem('data-theme', 'light');
    }

    useEffect(() => {
        if (window.localStorage.getItem('data-theme') === 'dark') {
            // System Dark Mode
            document.documentElement.setAttribute('data-theme', 'dark');
            document.getElementById("theme-switch").checked = true;
            window.localStorage.setItem('data-theme', 'dark');
        } else {
            // System Light Mode
            document.documentElement.setAttribute('data-theme', 'light');
            document.getElementById("theme-switch").checked = false;
            window.localStorage.setItem('data-theme', 'light');
        }
    }, [])

    const handleThemeChange = () => {
        document.documentElement.classList.add('color-theme-in-transition');
        window.setTimeout(function () {
            document.documentElement.classList.remove('color-theme-in-transition')
        }, 1000);

        if (document.documentElement.getAttribute("data-theme") === 'light') {
            // Set to Dark
            document.documentElement.setAttribute('data-theme', 'dark');
            window.localStorage.setItem('data-theme', 'dark');
        } else {
            // Set to Light
            document.documentElement.setAttribute('data-theme', 'light');
            window.localStorage.setItem('data-theme', 'light');
        }
    }

    return (
        <div className='home-wrapper'>
            <div className="navbar-fixed">
                <nav>
                    <div className="nav-wrapper surface-1">
                        <div className="sidenav-trigger hide-on-large-only" data-target="main-sidenav">
                            <i className="material-icons sub-text">menu</i>
                        </div>
                        <p className="brand-logo main-text no-margin hide-on-med-and-down">Welcome, <span className="profile-trigger">{userInfo.fullname.split(" ")[0]}</span></p>
                        <ul className="right">
                            <li className="notifications-wrapper">
                                <div className="notificaiton-count red circle valign-wrapper">
                                    <p className="no-margin white-text">0</p>
                                </div>
                                <button className='btn-flat sub-text material-icons' style={{ textTransform: "none", fontSize: 18 }}>notifications</button>
                            </li>
                            <li className="hide-on-med-and-down">
                                <div className="switch">
                                    <label>
                                        Light
                                        <input type="checkbox" onChange={handleThemeChange} id='theme-switch' />
                                        <span className="lever"></span>
                                        Dark
                                    </label>
                                </div>
                            </li>
                            <li className="hide-on-med-and-down">
                                <button className='btn-flat sub-text button-text modal-trigger' style={{ textTransform: "none" }} data-target="logout-modal">Sign Out</button>
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>
            <div className="row no-margin h-100">
                <div className="col s12 l3 h-100 z-depth-1 suface-1">
                    <ul className="collection no-margin">
                        {chats[0] === "checking" ?
                            <li className="h-100 valign-wrapper">
                                <div className="w-100 center-align">
                                    <p className="button-text sub-text">Checking Messages...</p>
                                </div>
                            </li> :
                            (chats.length > 0 ?
                                (chats.map((chat, i) =>
                                    <li key={i} className="collection-item avatar surface-2" onClick={() => handleChatToggle({ tag: chat.tag, user: chat.participants[0], messages: chat.messages, isGroup: chat.isGroup, displayname: chat.displayname })}>
                                        <div className={chat.participants[0].onlineStatus === "online" ? "online-status z-depth-1 green" : "online-status z-depth-1 grey"} ></div>
                                        <img src={chat.participants[0].picture === "" ? "images/default_avatar.png" : chat.participants[0].picture} alt="avatar" className="circle" />
                                        <span className="title main-text">{chat.participants[0].fullname}</span>
                                        <p className="sub-text">{chat.messages.length === 0 ? "No previous conversations" : chat.messages[chat.messages.length - 1].body}</p>
                                        <div className="secondary-content sub-text">{chat.messages.length > 0 ? (new Date(chat.messages[chat.messages.length - 1].timestamp)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}</div>
                                    </li>
                                )) :
                                <li className="h-100 valign-wrapper">
                                    <div className="w-100 center-align" style={{ cursor: "pointer" }} onClick={() => updatePanel("AddUserScreen")}>
                                        <img src={LostAstronaut} alt="No Connections" className="no-connections-image" style={{ opacity: showPanel === "AddUserScreen" ? 0.2 : 1 }} />
                                        <button className="btn-flat no-margin button-text sub-text" disabled={showPanel === "AddUserScreen" ? true : false}>Make some friends.</button>
                                    </div>
                                </li>
                            )
                        }
                    </ul>
                </div>
                <div className="col s12 l9 h-100">
                    {showPanel === "DefaultScreen" ?
                        (chats[0] === 'checking' ?
                            <div className="default-wrapper" >
                                <div className="h-100 valign-wrapper" style={{ justifyContent: "center", flexDirection: "column" }}>
                                    <p className="button-text sub-text">Checking Messages...</p>
                                </div>
                            </div> :
                            (chats.length > 0 ?
                                <div className="default-wrapper">
                                    <div className="h-100 valign-wrapper" style={{ justifyContent: "center", flexDirection: "column" }}>
                                        <p className="button-text main-text">Start a Conversation</p>
                                        <p className="button-text main-text">OR</p>
                                        <button className="btn button-text sub-text surface-2 waves-effect waves-light" onClick={() => updatePanel("AddUserScreen")}>Find People</button>
                                    </div>
                                </div> :
                                <div className="default-wrapper">
                                    <div className="h-100 valign-wrapper" style={{ justifyContent: "center", flexDirection: "column" }}>
                                        <p className="button-text sub-text">You don't have Friends</p>
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

                {/* Modal Structure */}
                <div id="logout-modal" className="modal surface-1">
                    <div className="modal-content">
                        <p className="sub-text">You will not receive any messages after logging out.</p>
                    </div>
                    <div className="modal-footer transparent">
                        <button className="modal-close waves-effect waves-light btn-flat sub-text">close</button>
                        <button className="modal-close waves-effect waves-light btn surface-2 main-text" onClick={() => signOutAction()}>Logout</button>
                    </div>
                </div>
            </div>

            <ul id="main-sidenav" className="sidenav surface-1">
                <li>
                    <div className="user-view">
                        <div className="background surface-2">
                        </div>
                        <img className="circle" src={userInfo.picture === "" ? 'images/default_avatar.png' : userInfo.picture} alt="" />
                        <span className="main-text name">{userInfo.fullname}</span>
                        <span className="main-text email">{userInfo.email}</span>
                    </div>
                </li>

                <li className="valign-wrapper sidenav-logout-wrapper">
                    <p className="red-text no-margin modal-trigger sidenav-close" data-target="logout-modal">Logout</p>
                </li>
            </ul>
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
