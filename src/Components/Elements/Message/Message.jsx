import React from 'react'
import './message.css'
const Message = ({ own, content, timeStamp }) => {

    return (
        <div className={own ? "message own" : "message"}>
            <div className="messageTop">
                <p className="messageText">
                    {content}
                </p>
            </div>
            <div className="messageButton">
                {new Date(timeStamp).toLocaleTimeString()}
            </div>

        </div>
    )
}
export default Message
