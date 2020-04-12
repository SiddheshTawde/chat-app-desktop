import React, { useState, useEffect } from 'react';
import { connect } from "react-redux";
import { socket } from "../HomePage/Home";
import "./Chat.css";

function Chat({ chatInfo, updatePanel, chats }) {

    const [message, onTypingMessage] = useState("");

    useEffect(() => {
        document.getElementById("chat-input").focus();

    }, [chatInfo])

    const sendMessage = e => {
        e.preventDefault();
        if (message !== "") {
            socket.emit('message', {
                conversationID: chatInfo.tag,
                participant: chatInfo.user.email,
                message: {
                    userFullname: chatInfo.user.fullname,
                    userEmail: chatInfo.user.email,
                    body: message,
                    timestamp: Date.now(),
                }
            });
        }
    }

    return (
        <div className="chat-screen-wrapper grey darken-4 z-depth-1">

            <div className="chat-header valign-wrapper">
                <p className="no-margin grey-text text-lighten-4">{chatInfo.user.fullname}</p>
                <button className="btn-flat material-icons grey-text text-lighten-4" style={{ textTransform: "none", fontSize: 24 }} onClick={() => updatePanel("DefaultScreen")}>close</button>
            </div>

            <ul>
                {chatInfo.messages.length > 0 ?
                    (chatInfo.messages.map((message, index) =>
                        <li key={index} className="valign-wrapper" style={{ justifyContent: message.userEmail === chatInfo.user.email ? "flex-end" : "flex-start" }}>
                            {message.userEmail === chatInfo.user.email ?
                                <div className="message-wrapper-you row grey lighten-3 z-depth-1">
                                    <div className="col s12">
                                        <p className="no-margin button-text left-align grey-text">{message.userFullname}</p>
                                    </div>
                                    <div className="col s12">
                                        <p className="grey-text text-darken-4 right-align">{message.body}</p>
                                    </div>
                                    <div className="col s12">
                                        <p className="no-margin button-text left-align grey-text">{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                    </div>
                                </div>
                                :
                                <div className="message-wrapper-other row grey darken-3 z-depth-1">
                                    <div className="col s12">
                                        <p className="no-margin button-text right-align grey-text">{message.userFullname}</p>
                                    </div>
                                    <div className="col s12">
                                        <p className="grey-text text-lighten-4">{message.body}</p>
                                    </div>
                                    <div className="col s12">
                                        <p className="no-margin button-text right-align grey-text">{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                    </div>
                                </div>
                            }
                        </li>
                    ))
                    : <li className="valign-wrapper grey-text button-text h-100" style={{ justifyContent: "center" }}>No Previous Messages.</li>
                }
            </ul>

            <div className="row no-margin chat-input-wrapper z-depth-2 valign-wrapper grey lighten-3">
                <form className="col s12 valign-wrapper" onSubmit={sendMessage}>
                    <div className="row no-margin w-100">
                        <button type="button" className="input-field col s1 waves-effect waves-dark valign-wrapper no-margin header-icons chat-emoji-button">
                            <i className="material-icons grey-text text-darken-4">insert_emoticon</i>
                        </button>
                        <div className="input-field col s10 valign-wrapper no-margin">
                            <textarea id="chat-input" className="materialize-textarea no-margin" placeholder="Type Something..." value={message} onChange={e => onTypingMessage(e.target.value)}></textarea>
                        </div>
                        <button type="submit" className="input-field col s1 waves-effect waves-dark valign-wrapper no-margin header-icons chat-submit-button">
                            <i className="material-icons grey-text text-darken-4">send</i>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => ({
    chats: state.chats
})

const mapDispatchToProps = {

}


export default connect(mapStateToProps, mapDispatchToProps)(Chat);

/* <li className="valign-wrapper" style={{ justifyContent: "flex-start" }}>
    <div className="message-wrapper-other row grey darken-3 z-depth-1">
        <div className="col s12">
            <p className="no-margin button-text right-align grey-text">John Doe</p>
        </div>
        <div className="col s12">
            <p className="grey-text text-lighten-4">Message from John</p>
        </div>
        <div className="col s12">
            <p className="no-margin button-text right-align grey-text">00:00</p>
        </div>
    </div>
</li>

<li className="valign-wrapper" style={{ justifyContent: "flex-end" }}>
    <div className="message-wrapper-you row grey lighten-3 z-depth-1">
        <div className="col s12">
            <p className="no-margin button-text left-align grey-text">Siddhesh Tawde</p>
        </div>
        <div className="col s12">
            <p className="grey-text text-darken-4 right-align">Message from Siddhesh</p>
        </div>
        <div className="col s12">
            <p className="no-margin button-text left-align grey-text">00:00</p>
        </div>
    </div>
</li> */