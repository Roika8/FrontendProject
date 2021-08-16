import React, { useState, useEffect, useRef } from 'react';
import UsersService from '../../../Services/UsersService';
import chatService from '../../../Services/chatService';
import { io } from "socket.io-client";
import Message from '../../Elements/Message/Message';
import Navbar from '../../Elements/Navbar/navbar';
import { makeStyles, useTheme } from '@material-ui/core/styles';

import clsx from 'clsx';


import './Chat.css'
import Users from '../../InjectComponents/Users/users';
import OnlineUsers from '../../InjectComponents/onlineUsers/onlineUsers';
import Backgammon from '../../InjectComponents/Backgammon/backgammon';
import Drawer from '../../Elements/Navbar/drawer';
import DialogRequest from '../../Elements/Dialog/DialogRequest';

const drawerWidth = 155;
// import backgroundStarter from '../../image/backgroundStarter.png';
const useStyles = makeStyles((theme) => ({
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    },
    content: {
        marginTop:'64px',
        flexGrow: 1,
        display: 'flex',
        padding: theme.spacing(0),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: -drawerWidth,
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft:-35,
    },
}));

const Chat = () => {
    const classes = useStyles();
    const theme = useTheme();


    //Users search
    const [userName, setUserName] = useState();
    //User data
    const senderUserID = UsersService.getUserIDfromToken();
    const [reciverUserID, setReciverUserID] = useState();

    //Chat settings
    const [currentChatID, setCurrentChat] = useState(-1)
    const [messagesObject, setMessages] = useState([]); //Type of {id,content,chatroomID,sender,timestamp}
    const [newMessageContent, setNewMessageContent] = useState("");
    const [arrivalMessage, setArrivalMessage] = useState();
    const [onlineUsers, setOnlineUsers] = useState();

    //Game request
    const [gotRequest, setGotRequest] = useState(false);
    const [userIDGameRequest, setUserIDGameRequest] = useState("");
    const [usernameGameRequest, setUsernameGameRequest] = useState("");

    const [userInGame, setUserInGame] = useState(false);
    const [outGame, setOutGame] = useState(false);
    //Scrool down to chat
    const scrollRef = useRef();
    //Socket definition
    const ENDPOINT = "https://soaprojectbackend.azurewebsites.net";
    const socket = useRef();

    const [open, setOpen] = useState(false);
    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        socket.current = io(ENDPOINT)
        //Set the user to socket, and revice the online users
    }, [])

    useEffect(() => {
        socket.current.emit('addSenderToConnection', senderUserID);
        //Get users from server
        socket.current.on('usersFromServer', users => {
            setOnlineUsers(users);
            console.log(users);
        })
    }, [senderUserID])



    // Room chat settings
    useEffect(() => {
        //Crete here a request
        setOutGame(false);

        //User aleady in game and recive an id
        if (userInGame[0]) {
            setOutGame(true);
            setReciverUserID();
            alert('Game is diconnect ,You will be redirect to main page')
            setUserInGame(false)
            socket.current.emit('userExitGame', userInGame[1]);

        }
        const setChatRoom = async () => {
            const chatRoomID = await chatService.getChatRoomID(reciverUserID, senderUserID);
            setCurrentChat(chatRoomID);
        }
        setChatRoom();

    }, [reciverUserID])

    //Load all messages
    useEffect(() => {
        if (currentChatID) {
            const getChatMessages = async () => {
                const messages = await chatService.getChatRoomMessages(currentChatID);
                const { data } = messages;
                setMessages(data)
                scrollRef.current?.scrollIntoView()
            }
            getChatMessages();
        }

    }, [currentChatID])

    useEffect(() => {
        if (socket) {
            //Handle arrival message

            socket.current.on("getMessage", data => {
                let sendMessage = {
                    sender: data.senderId,
                    content: data.content,
                    chatRoomID: currentChatID
                }
                setArrivalMessage(sendMessage);
            })
            //Handle arrival game Request
            socket.current.on('reciveGameRequest', async (senderID) => {
                const senderUsername = await getUsernameByID(senderID);
                setUserIDGameRequest(senderID);
                setUsernameGameRequest(senderUsername);
                setGotRequest(true);
            })
            socket.current.on('opponentExitGame', () => {
                alert('Opponent left')
                // setOutGame(true);
                setUserInGame(false)
                setReciverUserID();
            })
        }
    }, [socket])

    const handleAnswer = (value) => {
        if (value[0]) {
            setReciverUserID(value[1]);
            console.log(value[1]);
            socket.current.emit('acceptGameRequest', {
                reciverID: value[1]
            })
        }
        setGotRequest(false);
    }
    const getUsernameByID = async (userID) => {
        const requestUserName = await UsersService.getUserByID(userID)
        return requestUserName.data.userName

    }

    useEffect(() => {
        const setMsg = async () => {
            let messageData = await chatService.sendMessage(arrivalMessage) //Type of {id,content,chatroomID,sender,timestamp}
            setMessages([...messagesObject, messageData])
            scrollRef.current?.scrollIntoView({ behavior: 'smooth' })

        }
        setMsg();
    }, [arrivalMessage])


    //Get the reciver ID to chat with
    const onChangeReciver = (reciverUserID) => {
        setReciverUserID(reciverUserID);
    }

    //Send message
    const handleSendMessage = async (e) => {
        e.preventDefault();
        setNewMessageContent("")
        const sendMessage = {
            sender: senderUserID,
            content: newMessageContent,
            chatRoomID: currentChatID
        }

        socket.current.emit("userSendMessage", {
            senderId: senderUserID,
            content: newMessageContent,
            reciverID: reciverUserID
        })
        const messageData = await chatService.sendMessage(sendMessage) //Type of {id,content,chatroomID,sender,timestamp}
        setMessages([...messagesObject, messageData])
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    return (
        <React.Fragment>
            <div className="mainWrapper">
                <Drawer user={senderUserID} handleDrawerOpen={handleDrawerOpen} handleDrawerClose={handleDrawerClose} open={open} setOpen={setOpen} />
                <main
                    className={clsx(classes.content, {
                        [classes.contentShift]: open,
                    })}
                >
                    <div className={classes.drawerHeader}></div>
                    <div className="allUsers">
                        <div className="allUsersWrapper">
                            <input placeholder='Search' className='userSearch' onChange={(e, val) => { e.preventDefault(); setUserName(e.target.value); console.log(e.target.value); }} />
                            <Users onChange={onChangeReciver} senderID={senderUserID} searchedUsername={userName} />
                        </div>
                    </div>
                    <div className="onlineUsers">
                        <div className="onlineUsersWrapper">
                            {onlineUsers && <OnlineUsers users={onlineUsers} senderID={senderUserID} />}
                        </div>
                    </div>
                    <div className="chatArea">
                        <div className="chatAreaWrapper">
                            <div className="chatAreaTop">
                                {
                                    currentChatID === -1
                                        ?
                                        <div className="noSelectedFriend">No friends selected ..</div>
                                        :
                                        messagesObject
                                            ?
                                            messagesObject.map(msg => {

                                                return (
                                                    <div key={msg._id} ref={scrollRef}>
                                                        {/* true if The sender */}
                                                        <Message
                                                            own={msg.sender === senderUserID}
                                                            content={msg.messageContent}
                                                            timeStamp={msg.sendingTime}
                                                        />
                                                    </div>

                                                );
                                            })
                                            :
                                            <h1> a good way to start a conversation is by saying hello :)</h1>
                                }

                            </div>

                            <div className="chatAreaButtom">
                                <textarea
                                    className="chatMessageInput"
                                    placeholder=" Write somthing.."
                                    value={newMessageContent}
                                    onChange={(e) => setNewMessageContent(e.target.value)}
                                ></textarea>
                                <button className="chatSubmitButton" onClick={handleSendMessage}>Send</button>
                            </div>
                        </div>
                    </div>
                    <div className="gameBoard">
                        {gotRequest &&

                            <DialogRequest userName={usernameGameRequest} senderID={userIDGameRequest} answer={handleAnswer} />

                        }
                        {socket.current && reciverUserID && !outGame ?
                            <Backgammon socket={socket} reciverUserID={reciverUserID} senderUserID={senderUserID} isCurrentInGame={(value) => setUserInGame(value)} />
                            :
                            <div className='template'>
                                <div className="welcomeSentence">Select someone to play and invite him!</div>
                            </div>

                        }
                    </div>
                </main>
            </div>

        </React.Fragment>



    );
}
export default Chat;