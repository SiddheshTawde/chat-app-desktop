import React, { useState, useEffect } from 'react';
import { connect } from "react-redux";
import { socket } from "../HomePage/Home";
import "./Chat.css";
import { useSpring, animated } from 'react-spring';

function Chat({ chatInfo, updatePanel, chats, userInfo }) {

    const [message, onTypingMessage] = useState("");

    const TransitionProps = useSpring({
        from: {
            opacity: 0,
            transform: 'scale3d(0.95, 0.95, 0.95)'
        },
        to: {
            opacity: 1,
            transform: 'scale3d(1, 1, 1)'
        }
    })

    // update Current Conversation only 
    const [thisChat, updateThisChat] = useState([]);
    useEffect(() => {
        chats.forEach(chat => {
            if (chatInfo.tag === chat.tag) {
                updateThisChat(chat.messages)
            }
        });

    }, [chats, chatInfo.tag])

    useEffect(() => {
        document.getElementById("chat-input").focus();
    }, [])

    // Scroll to Bottom of list on Load & on receiving new message
    useEffect(() => {
        document.getElementById("message-box").scrollTo({
            top: document.getElementById("message-box").scrollHeight,
            behavior: 'smooth'
        })
    });

    const sendMessage = e => {
        e.preventDefault();
        if (message !== "") {
            socket.emit('message', {
                conversationID: chatInfo.tag,
                participant: chatInfo.user.email,
                message: {
                    userFullname: userInfo.fullname,
                    userEmail: userInfo.email,
                    body: message,
                    timestamp: Date.now(),
                }
            });
        };

        onTypingMessage("");
    }

    return (
        <animated.div className="chat-screen-wrapper surface-1 z-depth-1" style={TransitionProps}>

            <div className="chat-header valign-wrapper">
                <p className="no-margin main-text">{chatInfo.user.fullname}</p>
                <button className="btn-flat material-icons main-text" style={{ textTransform: "none", fontSize: 24 }} onClick={() => updatePanel("DefaultScreen")}>close</button>
            </div>

            <ul id="message-box">
                {thisChat.length > 0 ?
                    (thisChat.map((message, index) =>
                        <li key={index} className="valign-wrapper" style={{ justifyContent: message.userEmail === userInfo.email ? "flex-end" : "flex-start" }}>
                            {message.userEmail === userInfo.email ?
                                <div className="message-wrapper-you row grey lighten-2 z-depth-1">
                                    <div className="col s12">
                                        <p className="no-margin button-text left-align grey-text">{message.userFullname}</p>
                                    </div>
                                    <div className="col s12">
                                        <p className="grey-text text-darken-4 right-align message-body">{message.body}</p>
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
                                        <p className="grey-text text-lighten-4 message-body">{message.body}</p>
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
        </animated.div>
    )
}

const mapStateToProps = (state) => ({
    chats: state.chats,
    userInfo: state.userInfo
})

const mapDispatchToProps = {

}


export default connect(mapStateToProps, mapDispatchToProps)(Chat);
