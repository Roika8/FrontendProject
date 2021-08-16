import React, { useState, useEffect } from 'react'
import Board from './Board/board'
import './backgammon.css'
const Backgammon = ({ socket, reciverUserID, senderUserID, isCurrentInGame }) => {
    const [points, setPoints] = useState();
    const [startGame, setStartGame] = useState(false);
    const [gotRequest, setGotRequest] = useState(false);
    const [isRequestedPlayer, setIsRequestedPlayer] = useState(false);//Indicate if got request so rotate the board
    const [gameSocket, setGameSocket] = useState(socket);



    //Init points
    useEffect(() => {
        let array = [];
        for (let index = 0; index < 24; index++) {
            array.push({ player: false, checkers: 0, isAvailable: false })
        }
        // Player 1
        array[0] = { player: 1, checkers: 2 };
        array[11] = { player: 1, checkers: 5 };
        array[16] = { player: 1, checkers: 3 };
        array[18] = { player: 1, checkers: 5 };
        //player 2
        array[12] = { player: 2, checkers: 5 };
        array[7] = { player: 2, checkers: 3 };
        array[5] = { player: 2, checkers: 5 };
        array[23] = { player: 2, checkers: 2 };

        setPoints(array);

    }, [])


    useEffect(() => {
        if (gameSocket) {
            gameSocket.current.on('startGame', (reciver) => {
                console.log('here');
                if (reciver === reciverUserID) {
                    setIsRequestedPlayer(true);
                }
                setStartGame(true);
                //Send the opponent ID
                isCurrentInGame([true, reciver === reciverUserID ? senderUserID : reciverUserID]);
            })
        }

    }, [gameSocket])

    const handleStartGame = (e) => {
        e.preventDefault();
        if (!gotRequest) {//If wants to send game request
            gameSocket.current.emit('sendGameRequest', {
                reciverID: reciverUserID,
                senderID: senderUserID
            });

        }
    }
    const handleGameExit = (e) => {
        e.preventDefault();
        if (window.confirm('Leaving game will disconnect the game for both player, Are you sure you want to exit?')) {
            gameSocket.current.disconnect()
        }
    }

    return (
        <React.Fragment>
            {
                startGame
                    ?
                    points && gameSocket &&
                    <React.Fragment>
                        <button className="exitBtn" onClick={(e) => handleGameExit(e)}>exit game</button>
                        <Board posPoints={points} isRequestedPlayer={isRequestedPlayer} socket={gameSocket} senderUserID={senderUserID} reciverUserID={reciverUserID} />
                    </React.Fragment>

                    :
                    <div className='preGame'>
                        {
                            <button className="startGameBtn" onClick={handleStartGame} >Send request</button>
                        }

                    </div>
            }
        </React.Fragment>


    )
}
export default Backgammon;
