import React, { useEffect, useState } from 'react'
import './onlineUsers.css'
import UsersService from '../../../Services/UsersService'
const OnlineUsers = ({ users, senderID }) => {
    const [onlineUsers, setOnlineUsers] = useState([])
    const usersId = [];
    useEffect(() => {
        users.forEach(user => {
            usersId.push(user.userID)
        });

    }, [])

    useEffect(() => {
        const getAllusers = async () => {
            const onlineUsers = UsersService.getUsersByID(usersId)
            setOnlineUsers(onlineUsers);
        }
        getAllusers()
    }, [senderID])
    return (
        <div className="chatOnline">
            {
                onlineUsers ?
                    onlineUsers.map(user => {
                        return (
                            <div className="chatOnlineFriend" key={user._id}>
                                <div className="onlineBadge"></div>
                                <span className="onlineUserName">{user.userName}</span>
                            </div>
                        )
                    })
                    :
                    <div>Hi</div>
            }
        </div>

    )
}
export default OnlineUsers