import React, { useState, useEffect } from 'react'
import './board.css'
import DiceRolling from './Dice/diceRolling';
import Triangle from './Triangles/triangle'
import Prison from './Prison/prison';
export default function Board({ posPoints, isRequestedPlayer, socket, senderUserID, reciverUserID }) {
    const [gameSocket, setGameSocket] = useState(socket)

    //Dices valus
    const [dice1Value, setDice1Value] = useState(0);
    const [dice2Value, setDice2Value] = useState(0);
    const [firstTurnValue, setFirstTurnValue] = useState(0); //First turn movment value

    //Points (All game board data)
    const [points, setPoints] = useState(posPoints)

    //Sender and revicer indexers
    const [senderIndex, setSenderIndex] = useState();
    const [reciverIndex, setReciverIndex] = useState();

    //Indicate if now send or recive
    const [sendMode, setSendMode] = useState(true)//If false it's recive-mode
    //Every player have 2 turns
    const [turnsCounter, setTurnsCounter] = useState(0);
    const [passTurn, setPassTurn] = useState(false);
    //True- player 1 turn. False-player 2 turn.
    const [isPlayer1Turn, setIsPlayer1Turn] = useState(false);
    const [notMyTurn, setNotMyTurn] = useState(isPlayer1Turn && !isRequestedPlayer);

    //Role handler
    const [disableCube, setDisableCube] = useState(false); //Disable roll dice button
    const [startRole, setStartRole] = useState(false);//Can play his role (false if not roled)

    //Eaten checkers
    const [player1EatenCheckers, setPlayer1EatenCheckers] = useState(0);
    const [player2EatenCheckers, setPlayer2EatenCheckers] = useState(0);
    const [eatMode, setEatMode] = useState(false);

    //Players statring getting checkersOut
    const [player1Outing, setPlayer1Outing] = useState(false);
    const [player2Outing, setPlayer2Outing] = useState(false);

    const [player1OutCheckers, setPlayer1OutCheckers] = useState(0);
    const [player2OutCheckers, setPlayer2OutCheckers] = useState(0);


    /////////////////////////////////////////////////////////////Handle DICE Values/////////////////////////
    //get the dice values, And set the player turn (1 or 2)
    const getDiceValues = (values) => {
        setDisableCube(true); //Disable cube rolling
        setStartRole(true); //can make a role
        setDice1Value(values[0]);
        setDice2Value(values[1]);
        const val1 = values[0];
        const val2 = values[1];
        if ((isPlayer1Turn && !isRequestedPlayer) || (!isPlayer1Turn && isRequestedPlayer)) { //If its player 1 and player 1 turn or the opposite
            gameSocket.current.emit('sendDicesValues', { val1, val2, reciverUserID })
        }
    }



    //After gettin the dice values, reset the avalible triangles
    useEffect(() => {
        restartTrianglesAvailability();
    }, [dice1Value, dice2Value])

    //Set eat mode on (player have eaten checkers)
    useEffect(() => {
        if ((player1EatenCheckers > 0 && isPlayer1Turn) || (player2EatenCheckers > 0 && !isPlayer1Turn)) {
            setEatMode(true);
            setStartRole(false)
        }

        if (gameSocket) {
            //is player 1 turn but im player 2          is player 2 turn but im not player 2  (Not my turn)
            if ((isPlayer1Turn && isRequestedPlayer) || (!isPlayer1Turn && !isRequestedPlayer)) { //If the other player made a turn
                setNotMyTurn(true);
                setDisableCube(true);
                setStartRole(false);
                setEatMode(false)
                gameSocket.current.on('getOppenentDicesValues', data => {
                    const { val1, val2 } = data;
                    setDice1Value(val1);
                    setDice2Value(val2);
                })
            }
            else {
                setDisableCube(false);
                setStartRole(false)
            }
            gameSocket.current.emit('isPlayer1Turn', { isPlayer1Turn, reciverUserID });
        }
    }, [isPlayer1Turn])
    /////////////////////////////////////////////////////////////////////////////////////////////////////////

    //Handle (validate) selected checker
    const handleTriangleMovment = (value) => {
        console.log(value);
        if (value[0] === true) {  //Send mode ON
            if (eatMode) {
                setSenderIndex(value[1]);
                setSendMode(false);
            }
            else if (points[value[1]].player === 1 && isPlayer1Turn
                ||
                points[value[1]].player === 2 && !isPlayer1Turn) {//If the sender match the player
                setSenderIndex(value[1]);
                setSendMode(false);
            }
        }
        else {//Recive mode ON
            if (eatMode) {
                if (value[1] === -1 || value[1] === -2) {
                    console.log('eee');
                    setSendMode(true)
                    restartTrianglesAvailability();
                    setSenderIndex();
                }
                else {
                    console.log(';rijvnr');
                    setReciverIndex(value[1]);
                    setSendMode(true) //After recive set to send
                }
            }
            else if (value[1] === senderIndex) {//If I click the te checker I aleady clicked, unclick it
                setSendMode(true)
                restartTrianglesAvailability();
                setSenderIndex();
            }
            else if (points[value[1]].isAvailable) {
                setReciverIndex(value[1]);
                setSendMode(true) //After recive set to send
                // setEatMode(false); //Eat mode disable

            }


        }
    }

    //Calculate avalible triangles according to sender position
    useEffect(() => {
        const res = calculateAvailableTriangles(senderIndex)
        if (!res) {
            setPassTurn(true);
        }
        else {
            setPassTurn(false);
        }


    }, [senderIndex])


    useEffect(() => {
        if (player1OutCheckers === 15) {
            alert('player 1 win!')
        }
        if (checkIfAllCheckersInBase1(player1OutCheckers))
            setPlayer1Outing(true);
        else setPlayer1Outing(false);
    }, [turnsCounter, player1OutCheckers])


    useEffect(() => {
        if (player2OutCheckers === 15) {
            alert('player 2 win!')
        }
        if (checkIfAllCheckersInBase2(player2OutCheckers))
            setPlayer2Outing(true);
        else setPlayer2Outing(false);
    }, [turnsCounter, player2OutCheckers])

    const checkIfAllCheckersInBase2 = (playerOutCheckers) => {
        let player2CheckersSum = 0;
        for (let i = 0; i < 6; i++) {
            player2CheckersSum += points[i].checkers;
            if (player2CheckersSum === 15 - playerOutCheckers) {//Fix i to ===
                return true;
            }
        }
        return false;
    }
    const checkIfAllCheckersInBase1 = (playerOutCheckers) => {
        console.log(playerOutCheckers);
        let player1CheckersSum = 0;
        for (let i = 0; i < 6; i++) {
            player1CheckersSum += points[23 - i].checkers;
            if (player1CheckersSum === 15 - playerOutCheckers) {//Fix i to ===
                return true;
            }
        }
        return false;
    }
    //Moving the checkers
    useEffect(() => {
        if (reciverIndex || reciverIndex === 0) {
            if (points[reciverIndex].isAvailable === true) {
                setTurnsCounter(turnsCounter + 1) //Turns counter (every player gets 2 turns)
                let pointsClone = points;

                if (!eatMode) pointsClone[senderIndex].checkers -= 1;
                if (isPlayer1Turn) { //Player 1 chckers handler
                    if (eatMode) { //If let the checker out of prison
                        if (player1EatenCheckers - 1 === 0)
                            setEatMode(false)
                        setPlayer1EatenCheckers(player1EatenCheckers - 1)
                        setFirstTurnValue(reciverIndex + 1);//Set how much the checker move forword (for 2nd turn)
                    }
                    else
                        setFirstTurnValue(reciverIndex - senderIndex);//Set how much the checker move forword (for 2nd turn)

                    if (pointsClone[reciverIndex].checkers === 0) { //If triangle is free change the player there
                        pointsClone[reciverIndex].player = 1;
                    }
                    if (pointsClone[reciverIndex].checkers === 1 && pointsClone[reciverIndex].player === 2) { //If has eaten
                        setPlayer2EatenCheckers(player2EatenCheckers + 1)
                        pointsClone[reciverIndex].player = 1;
                        pointsClone[reciverIndex].checkers -= 1;
                    }


                }
                else {//Player 2 chckers handler
                    if (eatMode) {//If let the checker out of prison
                        if (player2EatenCheckers - 1 === 0)
                            setEatMode(false)
                        setPlayer2EatenCheckers(player2EatenCheckers - 1)
                        setFirstTurnValue(24 - reciverIndex)
                    }
                    else
                        setFirstTurnValue(senderIndex - reciverIndex);//Set how much the checker move forword (for 2nd turn)


                    if (pointsClone[reciverIndex].checkers === 0) { //If triangle is free change the player there
                        pointsClone[reciverIndex].player = 2;
                    }
                    if (pointsClone[reciverIndex].checkers === 1 && pointsClone[reciverIndex].player === 1) { //eat
                        setPlayer1EatenCheckers(player1EatenCheckers + 1)
                        pointsClone[reciverIndex].player = 2;
                        pointsClone[reciverIndex].checkers -= 1;
                    }

                }
                if (!eatMode && pointsClone[senderIndex].checkers === 0) {
                    pointsClone[senderIndex].player = false;
                    pointsClone[senderIndex].isAvailable = true;

                }

                pointsClone[reciverIndex].checkers += 1;
                setPoints([...pointsClone])
                restartTrianglesAvailability();
                setSenderIndex();
                setReciverIndex();

                //Send to socket the a turn made
                if (gameSocket) {
                    gameSocket.current.emit('turnMade', { pointsClone, reciverUserID });
                }
            }
        }
    }, [reciverIndex])

    //Change the player turn
    useEffect(() => {
        //Update the board according every move made
        if (gameSocket) {
            gameSocket.current.on('handleTurns', isPlayer1Turn => {
                setIsPlayer1Turn(isPlayer1Turn)
            })
            gameSocket.current.on('refreshBoard', data => {
                console.log('refrsh');
                const { pointsClone } = data;
                setPoints(pointsClone);
            })
            gameSocket.current.on('getPlayer1EatenCheckers', data => {
                setPlayer1EatenCheckers(data.player1EatenCheckers);
            })
            gameSocket.current.on('getPlayer2EatenCheckers', data => {
                setPlayer2EatenCheckers(data.player2EatenCheckers);
            })
        }
        if ((turnsCounter === 2 && dice1Value !== dice2Value) || turnsCounter === 4 && dice1Value === dice2Value) {
            setIsPlayer1Turn(!isPlayer1Turn);
            setDisableCube(false);//enable the cube rolling after done play
            setStartRole(false)// Finish turn, cant make roll until rolling the dices
            setTurnsCounter(0);
            restartTrianglesAvailability();
        }
        if (checkIfAllCheckersInBase1(player1OutCheckers)) {
            setPlayer1Outing(true)
        }
        else setPlayer1Outing(false);
        if (checkIfAllCheckersInBase2(player2OutCheckers)) {
            setPlayer2Outing(true)
        }
        else setPlayer2Outing(false);

    }, [turnsCounter])



    useEffect(() => {
        socket.current.emit('eatenPlayer1Checkers', { reciverUserID, player1EatenCheckers });
    }, [player1EatenCheckers])
    useEffect(() => {
        socket.current.emit('eatenPlayer2Checkers', { reciverUserID, player2EatenCheckers });
    }, [player2EatenCheckers])




    const restartTrianglesAvailability = () => {
        let pointsClone = points;
        pointsClone.map(point => point.isAvailable = false);
        setPoints([...pointsClone]);
    }

    //Display avalible triangles
    const calculateAvailableTriangles = (senderIndexValue) => {
        let pointsClone = points;
        if (isPlayer1Turn) {

            const availablePoints = pointsClone.filter(point =>
                point.checkers <= 1 //if has only 1 checker
                || point.player !== 2 //If not player 2
            )
            availablePoints.forEach(point => {
                //Get the indxes of the the avalible triangles
                const reciverPointIndex = pointsClone.indexOf(point)

                //Calculate according to eat mode (can only recive on his own base)
                if (eatMode) {
                    if (reciverPointIndex < 6) {
                        if (turnsCounter === 0) {
                            console.log('point index: ' + reciverPointIndex);
                            if (dice1Value === reciverPointIndex + 1 || dice2Value === reciverPointIndex + 1) {
                                pointsClone[reciverPointIndex].isAvailable = true;
                            }
                        }
                        else {
                            console.log('First turn vlue: ' + firstTurnValue);
                            if (firstTurnValue === dice1Value) { //if dice 1 turn already made
                                if (dice2Value === reciverPointIndex) {
                                    pointsClone[reciverPointIndex].isAvailable = true;
                                }

                            }
                            else { //if dive 2 turn alreadt made
                                if (dice1Value === reciverPointIndex) {
                                    pointsClone[reciverPointIndex].isAvailable = true;

                                }
                            }
                        }

                    }

                }
                else if (reciverPointIndex > senderIndexValue) { //If go forward
                    if (turnsCounter === 0) { //if not last turn
                        if (senderIndexValue + dice1Value === reciverPointIndex || senderIndexValue + dice2Value === reciverPointIndex) {
                            pointsClone[reciverPointIndex].isAvailable = true;
                        }
                    }
                    else { //if last turn
                        console.log('here second turn player 1');
                        console.log('First turn value: ' + firstTurnValue);

                        if (firstTurnValue === dice1Value) { //if dice 1 turn already made
                            if (senderIndex + dice2Value === reciverPointIndex) {
                                pointsClone[reciverPointIndex].isAvailable = true;
                            }
                        }
                        else { //if dive 2 turn alreadt made
                            if (senderIndex + dice1Value === reciverPointIndex) {
                                pointsClone[reciverPointIndex].isAvailable = true;
                            }
                        }
                    }
                }
            })
            if (eatMode) {
                for (let i = 0; i < 6; i++) {
                    if (pointsClone[i].isAvailable)
                        return true;
                }
                return false;
            }
        }
        else {
            const availablePoints = pointsClone.filter(point =>
                point.checkers <= 1 //if has only 1 checker
                || point.player !== 1 //If not player 1
            )

            availablePoints.forEach(point => {
                const reciverPointIndex = pointsClone.indexOf(point)
                if (eatMode) {
                    if (reciverPointIndex > 17) {
                        if (turnsCounter === 0) {
                            if (24 - dice1Value === reciverPointIndex || 24 - dice2Value === reciverPointIndex) {
                                pointsClone[reciverPointIndex].isAvailable = true;
                            }
                        }
                        else {
                            if (firstTurnValue === dice1Value) { //if dice 1 turn already made
                                if (24 - dice2Value === reciverPointIndex) {
                                    pointsClone[reciverPointIndex].isAvailable = true;
                                }
                            }
                            else { //if dive 2 turn alreadt made
                                if (24 - dice1Value === reciverPointIndex) {
                                    pointsClone[reciverPointIndex].isAvailable = true;
                                }
                            }

                        }
                    }
                }
                else if (reciverPointIndex < senderIndexValue) { //If go forward
                    if (turnsCounter === 0) { //iF not last turn
                        if (senderIndexValue - dice1Value === reciverPointIndex || senderIndexValue - dice2Value === reciverPointIndex) {
                            pointsClone[reciverPointIndex].isAvailable = true;
                        }
                    }
                    else { //if last turn
                        console.log('here second turn player 2');
                        console.log('First turn value: ' + firstTurnValue);

                        if (firstTurnValue === dice1Value) { //if dice 1 turn already made
                            if (senderIndex - dice2Value === reciverPointIndex) {
                                pointsClone[reciverPointIndex].isAvailable = true;
                            }
                        }
                        else { //if dive 2 turn alreadt made
                            if (senderIndex - dice1Value === reciverPointIndex) {
                                pointsClone[reciverPointIndex].isAvailable = true;

                            }
                        }
                    }
                }
            })
            if (eatMode) {
                console.log(pointsClone);
                for (let i = 0; i < 6; i++) {
                    if (pointsClone[23 - i].isAvailable)
                        return true;
                }
                return false;
            }
        }

        setPoints([...pointsClone]);
    }
    const checkIfFreeBefore = (isPlayer1Turn, points) => {
        if (isPlayer1Turn) {
            for (let i = 18; i < senderIndex; i++) {
                if (points[i].checkers !== 0 && points[i].player === 1)
                    return false;
            }
        }
        else {
            for (let i = 5; i > senderIndex; i--) {
                if (points[i].checkers !== 0&& points[i].player === 2)
                    return false;
            }
        }
        return true;
    }
    const outHandle = (isPlayer1Turn, diceValue, turnsCounter, player1OutCheckers, player2OutCheckers) => {
        setFirstTurnValue(diceValue);
        setTurnsCounter(turnsCounter + 1)
        isPlayer1Turn ? setPlayer1OutCheckers(player1OutCheckers + 1) : setPlayer2OutCheckers(player2OutCheckers + 1)
        setSendMode(true)
        restartTrianglesAvailability();
        setSenderIndex();
    }
    const handleOuting = () => {
        if (isPlayer1Turn && !isRequestedPlayer) {
            if (player1Outing) {
                let pointsClone = points
                let isFreeBefore = checkIfFreeBefore(true, pointsClone)
                if (turnsCounter === 0) { //if not last turn
                    console.log('In player 1 first turn, Sender inedx: ' + senderIndex + " turncounter: " + turnsCounter + " dice1 value: " + dice1Value + " dice2 valje: " + dice2Value + " senderIndex: " + senderIndex + " is free before: " + isFreeBefore + " player 1 out checkers ");
                    if ((senderIndex === 24 - dice1Value && !isFreeBefore) || (isFreeBefore && senderIndex >= 24 - dice1Value)) {
                        pointsClone[senderIndex].checkers -= 1;
                        outHandle(true, dice1Value, turnsCounter, player1OutCheckers, player2OutCheckers);
                    }
                    else if ((senderIndex === 24 - dice2Value && !isFreeBefore) || (isFreeBefore && senderIndex >= 24 - dice2Value)) {
                        pointsClone[senderIndex].checkers -= 1;
                        outHandle(true, dice2Value, turnsCounter, player1OutCheckers, player2OutCheckers);
                    }
                    else {
                        alert('player 1 checker cannot go out')
                        setSendMode(true)
                        restartTrianglesAvailability();
                        setSenderIndex();
                    }
                }
                else {
                    console.log('firstTurnValue: ' + firstTurnValue + " dice 1 value: " + dice1Value + " dice 2 value: " + dice2Value);
                    if (firstTurnValue === dice1Value) {
                        console.log('In player 1 not first turn, Sender inedx: ' + senderIndex + " turncounter: " + turnsCounter + " dice1 value: " + dice1Value + " dice2 valje: " + dice2Value + " first turn value: " + firstTurnValue + " senderIndex: " + senderIndex + " is free before: " + isFreeBefore + " player 1 out checkers ");
                        if ((24 - dice2Value === senderIndex && !isFreeBefore) || (isFreeBefore && 24 - dice2Value <= senderIndex)) {
                            pointsClone[senderIndex].checkers -= 1
                            outHandle(true, dice1Value, turnsCounter, player1OutCheckers, player2OutCheckers);
                        }
                    }
                    else if (firstTurnValue === dice2Value) {
                        console.log('In player 1 no first turn, Sender inedx: ' + senderIndex + " turncounter: " + turnsCounter + " dice1 value: " + dice1Value + " dice2 valje: " + dice2Value + " first turn value: " + firstTurnValue + " senderIndex: " + senderIndex + " is free before: " + isFreeBefore + " player 1 out checkers ");

                        if ((24 - dice1Value === senderIndex && !isFreeBefore) || (isFreeBefore && 24 - dice1Value <= senderIndex)) {
                            pointsClone[senderIndex].checkers -= 1;
                            outHandle(true, dice1Value, turnsCounter, player1OutCheckers, player2OutCheckers);
                        }
                    }
                    else {
                        alert('player 1 checker cannot go out')
                        setSendMode(true)
                        restartTrianglesAvailability();
                        setSenderIndex();
                    }
                }
                setPoints([...pointsClone])
                //Send to socket the a turn made
                if (gameSocket) {
                    gameSocket.current.emit('turnMade', { pointsClone, reciverUserID });
                }
            }
            else {
                alert('You need all checkers on your base')
                setSendMode(true)
                restartTrianglesAvailability();
                setSenderIndex();
            }
        }
        if (!isPlayer1Turn && isRequestedPlayer) {
            if (player2Outing) {
                let pointsClone = points
                let isFreeBefore = checkIfFreeBefore(false, pointsClone)

                if (turnsCounter === 0) { //iF not last turn
                    console.log('In player 2 first turn, Sender inedx: ' + senderIndex + " turncounter: " + turnsCounter + " dice1 value: " + dice1Value + " dice2 valje: " + dice2Value + " senderIndex: " + senderIndex + " is free before: " + isFreeBefore + " player 1 out checkers ");
                    if ((senderIndex === dice1Value - 1 && !isFreeBefore) || (isFreeBefore && senderIndex <= dice1Value - 1)) {
                        console.log('here');
                        pointsClone[senderIndex].checkers -= 1;
                        outHandle(false, dice1Value, turnsCounter, player1OutCheckers, player2OutCheckers);
                    }
                    else if (senderIndex === dice2Value - 1 && !isFreeBefore || (isFreeBefore && senderIndex <= dice2Value - 1)) {
                        pointsClone[senderIndex].checkers -= 1;
                        outHandle(false, dice2Value, turnsCounter, player1OutCheckers, player2OutCheckers);
                    }
                    else {
                        alert('player 2 checker cannot go out')
                        setSendMode(true)
                        restartTrianglesAvailability();
                        setSenderIndex();
                    }
                }
                else {
                    console.log('firstTurnValue: ' + firstTurnValue + " dice 1 value: " + dice1Value + " dice 2 value: " + dice2Value);
                    if (firstTurnValue === dice1Value) {
                        console.log('In player 2 not first turn, Sender inedx: ' + senderIndex + " turncounter: " + turnsCounter + " dice1 value: " + dice1Value + " dice2 valje: " + dice2Value + " senderIndex: " + senderIndex + " is free before: " + isFreeBefore + " player 1 out checkers ");

                        if ((dice2Value - 1 === senderIndex && !isFreeBefore) || (isFreeBefore && senderIndex <= dice2Value - 1)) {
                            console.log('In turn 2 handle ');
                            pointsClone[senderIndex].checkers -= 1
                            outHandle(false, dice1Value, turnsCounter, player1OutCheckers, player2OutCheckers);
                        }
                    }
                    else if (firstTurnValue === dice2Value) {
                        console.log('In player 2 not first turn, Sender inedx: ' + senderIndex + " turncounter: " + turnsCounter + " dice1 value: " + dice1Value + " dice2 valje: " + dice2Value + " senderIndex: " + senderIndex + " is free before: " + isFreeBefore + " player 1 out checkers ");

                        if ((dice1Value - 1 === senderIndex && !isFreeBefore) || (isFreeBefore && senderIndex <= dice1Value - 1)) {
                            console.log('In turn 2 handle ');

                            pointsClone[senderIndex].checkers -= 1;
                            outHandle(false, dice1Value, turnsCounter, player1OutCheckers, player2OutCheckers);
                        }
                    }
                    else {
                        alert('player 2 checker cannot go out')
                        setSendMode(true)
                        restartTrianglesAvailability();
                        setSenderIndex();
                    }
                }
                setPoints([...pointsClone])
                //Send to socket the a turn made
                if (gameSocket) {
                    gameSocket.current.emit('turnMade', { pointsClone, reciverUserID });
                }
            }
            else {
                alert('You need all checkers on your base')
                setSendMode(true)
                restartTrianglesAvailability();
                setSenderIndex();
            }
        }
    }
    const handleTurnPass = () => {
        if (dice1Value === dice2Value) {
            setTurnsCounter(4)
        }
        else {
            setTurnsCounter(2);
        }
        setPassTurn(false)
    }
    return (

        <div id="board" className={isRequestedPlayer ? "container-fluid rotateBoard" : "container-fluid nonRotate"}>

            <div id='leftSide' className="row ">
                <div className='up'>
                    <Triangle position='up' color={1} numOfCheckers={points[11].checkers} player={points[11].player} isPlayer1Turn={isPlayer1Turn} canRecive={points[11].isAvailable} sender={sendMode} reciver={!sendMode} pointIndex={11} setTriangleData={handleTriangleMovment} startRole={startRole} eatMode={eatMode} />
                    <Triangle position='up' color={0} numOfCheckers={points[10].checkers} player={points[10].player} isPlayer1Turn={isPlayer1Turn} canRecive={points[10].isAvailable} sender={sendMode} reciver={!sendMode} pointIndex={10} setTriangleData={handleTriangleMovment} startRole={startRole} eatMode={eatMode} />
                    <Triangle position='up' color={1} numOfCheckers={points[9].checkers} player={points[9].player} isPlayer1Turn={isPlayer1Turn} canRecive={points[9].isAvailable} sender={sendMode} reciver={!sendMode} pointIndex={9} setTriangleData={handleTriangleMovment} startRole={startRole} eatMode={eatMode} />
                    <Triangle position='up' color={0} numOfCheckers={points[8].checkers} player={points[8].player} isPlayer1Turn={isPlayer1Turn} canRecive={points[8].isAvailable} sender={sendMode} reciver={!sendMode} pointIndex={8} setTriangleData={handleTriangleMovment} startRole={startRole} eatMode={eatMode} />
                    <Triangle position='up' color={1} numOfCheckers={points[7].checkers} player={points[7].player} isPlayer1Turn={isPlayer1Turn} canRecive={points[7].isAvailable} sender={sendMode} reciver={!sendMode} pointIndex={7} setTriangleData={handleTriangleMovment} startRole={startRole} eatMode={eatMode} />
                    <Triangle position='up' color={0} numOfCheckers={points[6].checkers} player={points[6].player} isPlayer1Turn={isPlayer1Turn} canRecive={points[6].isAvailable} sender={sendMode} reciver={!sendMode} pointIndex={6} setTriangleData={handleTriangleMovment} startRole={startRole} eatMode={eatMode} />
                </div>
                <div className='down'>
                    <Triangle position='down' color={0} numOfCheckers={points[12].checkers} player={points[12].player} isPlayer1Turn={isPlayer1Turn} canRecive={points[12].isAvailable} sender={sendMode} reciver={!sendMode} pointIndex={12} setTriangleData={handleTriangleMovment} startRole={startRole} eatMode={eatMode} />
                    <Triangle position='down' color={1} numOfCheckers={points[13].checkers} player={points[13].player} isPlayer1Turn={isPlayer1Turn} canRecive={points[13].isAvailable} sender={sendMode} reciver={!sendMode} pointIndex={13} setTriangleData={handleTriangleMovment} startRole={startRole} eatMode={eatMode} />
                    <Triangle position='down' color={0} numOfCheckers={points[14].checkers} player={points[14].player} isPlayer1Turn={isPlayer1Turn} canRecive={points[14].isAvailable} sender={sendMode} reciver={!sendMode} pointIndex={14} setTriangleData={handleTriangleMovment} startRole={startRole} eatMode={eatMode} />
                    <Triangle position='down' color={1} numOfCheckers={points[15].checkers} player={points[15].player} isPlayer1Turn={isPlayer1Turn} canRecive={points[15].isAvailable} sender={sendMode} reciver={!sendMode} pointIndex={15} setTriangleData={handleTriangleMovment} startRole={startRole} eatMode={eatMode} />
                    <Triangle position='down' color={0} numOfCheckers={points[16].checkers} player={points[16].player} isPlayer1Turn={isPlayer1Turn} canRecive={points[16].isAvailable} sender={sendMode} reciver={!sendMode} pointIndex={16} setTriangleData={handleTriangleMovment} startRole={startRole} eatMode={eatMode} />
                    <Triangle position='down' color={1} numOfCheckers={points[17].checkers} player={points[17].player} isPlayer1Turn={isPlayer1Turn} canRecive={points[17].isAvailable} sender={sendMode} reciver={!sendMode} pointIndex={17} setTriangleData={handleTriangleMovment} startRole={startRole} eatMode={eatMode} />
                </div>
            </div>
            <div id='rightSide' className="row">
                <div className='up'>
                    <Triangle position='up' color={1} numOfCheckers={points[5].checkers} player={points[5].player} isPlayer1Turn={isPlayer1Turn} canRecive={points[5].isAvailable} sender={sendMode} reciver={!sendMode} pointIndex={5} setTriangleData={handleTriangleMovment} startRole={startRole} eatMode={eatMode} />
                    <Triangle position='up' color={0} numOfCheckers={points[4].checkers} player={points[4].player} isPlayer1Turn={isPlayer1Turn} canRecive={points[4].isAvailable} sender={sendMode} reciver={!sendMode} pointIndex={4} setTriangleData={handleTriangleMovment} startRole={startRole} eatMode={eatMode} />
                    <Triangle position='up' color={1} numOfCheckers={points[3].checkers} player={points[3].player} isPlayer1Turn={isPlayer1Turn} canRecive={points[3].isAvailable} sender={sendMode} reciver={!sendMode} pointIndex={3} setTriangleData={handleTriangleMovment} startRole={startRole} eatMode={eatMode} />
                    <Triangle position='up' color={0} numOfCheckers={points[2].checkers} player={points[2].player} isPlayer1Turn={isPlayer1Turn} canRecive={points[2].isAvailable} sender={sendMode} reciver={!sendMode} pointIndex={2} setTriangleData={handleTriangleMovment} startRole={startRole} eatMode={eatMode} />
                    <Triangle position='up' color={1} numOfCheckers={points[1].checkers} player={points[1].player} isPlayer1Turn={isPlayer1Turn} canRecive={points[1].isAvailable} sender={sendMode} reciver={!sendMode} pointIndex={1} setTriangleData={handleTriangleMovment} startRole={startRole} eatMode={eatMode} />
                    <Triangle position='up' color={0} numOfCheckers={points[0].checkers} player={points[0].player} isPlayer1Turn={isPlayer1Turn} canRecive={points[0].isAvailable} sender={sendMode} reciver={!sendMode} pointIndex={0} setTriangleData={handleTriangleMovment} startRole={startRole} eatMode={eatMode} />
                </div>
                <div className={isRequestedPlayer ? "diceArea rotateBoard" : 'diceArea'}>
                    {
                        notMyTurn ?
                            <DiceRolling dicesValues={getDiceValues} opponentDice1Value={dice1Value} opponentDice2Value={dice2Value} isPlayer1Turn={isPlayer1Turn} disableCubes={disableCube} />
                            :
                            <DiceRolling dicesValues={getDiceValues} isPlayer1Turn={isPlayer1Turn} disableCubes={disableCube} />

                    }
                    <button className="outBtn" onClick={handleOuting} >Out</button>
                    {
                        <button className="outBtn" onClick={handleTurnPass} disabled={!eatMode}>Pass</button>
                    }

                </div>
                <div className='down'>
                    <Triangle position='down' color={0} numOfCheckers={points[18].checkers} player={points[18].player} isPlayer1Turn={isPlayer1Turn} canRecive={points[18].isAvailable} sender={sendMode} reciver={!sendMode} pointIndex={18} setTriangleData={handleTriangleMovment} startRole={startRole} eatMode={eatMode} />
                    <Triangle position='down' color={1} numOfCheckers={points[19].checkers} player={points[19].player} isPlayer1Turn={isPlayer1Turn} canRecive={points[19].isAvailable} sender={sendMode} reciver={!sendMode} pointIndex={19} setTriangleData={handleTriangleMovment} startRole={startRole} eatMode={eatMode} />
                    <Triangle position='down' color={0} numOfCheckers={points[20].checkers} player={points[20].player} isPlayer1Turn={isPlayer1Turn} canRecive={points[20].isAvailable} sender={sendMode} reciver={!sendMode} pointIndex={20} setTriangleData={handleTriangleMovment} startRole={startRole} eatMode={eatMode} />
                    <Triangle position='down' color={1} numOfCheckers={points[21].checkers} player={points[21].player} isPlayer1Turn={isPlayer1Turn} canRecive={points[21].isAvailable} sender={sendMode} reciver={!sendMode} pointIndex={21} setTriangleData={handleTriangleMovment} startRole={startRole} eatMode={eatMode} />
                    <Triangle position='down' color={0} numOfCheckers={points[22].checkers} player={points[22].player} isPlayer1Turn={isPlayer1Turn} canRecive={points[22].isAvailable} sender={sendMode} reciver={!sendMode} pointIndex={22} setTriangleData={handleTriangleMovment} startRole={startRole} eatMode={eatMode} />
                    <Triangle position='down' color={1} numOfCheckers={points[23].checkers} player={points[23].player} isPlayer1Turn={isPlayer1Turn} canRecive={points[23].isAvailable} sender={sendMode} reciver={!sendMode} pointIndex={23} setTriangleData={handleTriangleMovment} startRole={startRole} eatMode={eatMode} />
                </div>
            </div>
            <div id="middle">
                <div className="down">

                    <Prison
                        position='down'
                        numOfCheckers={player2EatenCheckers}
                        player={2}
                        isPlayer1Turn={isPlayer1Turn}
                        sender={sendMode}
                        reciver={!sendMode}
                        pointIndex={-1}
                        setTriangleData={handleTriangleMovment}
                        startRole={startRole} />

                </div>
                <div className="up">
                    <Prison
                        position='up'
                        numOfCheckers={player1EatenCheckers}
                        player={1}
                        isPlayer1Turn={isPlayer1Turn}
                        sender={sendMode}
                        reciver={!sendMode}
                        pointIndex={-2}
                        setTriangleData={handleTriangleMovment}
                        startRole={startRole} />
                </div>
            </div>

        </div>
    )
}
