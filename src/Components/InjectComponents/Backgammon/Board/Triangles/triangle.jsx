import React, { useState, useEffect } from 'react'
import './triangle.css'
import Checker from '../Checker/checker';
const Triangle = ({ position, color, player, numOfCheckers, isPlayer1Turn, canRecive, reciver, sender, setTriangleData, pointIndex, startRole, eatMode }) => {
    //Set the checker color
    let colorStyle = color === 0 ? 'Bright' : 'Dark';
    //Set the checker position
    let pos = position === 'up' ? 'Up' : 'down';
    //Base can recive checkers
    const [recivable, setRecivable] = useState();

    useEffect(() => {

        setRecivable(canRecive === true ? 'canRecive' : 'cannotRecive')

    })
    //Checkers array
    let checkersArray = [];
    if (numOfCheckers !== 0) {
        for (let index = 0; index < numOfCheckers; index++) {
            checkersArray.push(index)
        }
    }


    //Make the down checkers to be at the buttom --CSS
    let chekersContainerPosition = pos === 'Up' ? '' : 'chekersContainerPosition'
    let recivablePos = pos === 'Up' ? '' : 'recivablePos'

    const handleTriangleSelect = () => {
        //Sender--------TRUE-----Number-----False
        //Reciver-------FALSE----Number-----True
        if (startRole) { //Only if can make a role
            console.log('here');
            setTriangleData([sender, pointIndex, reciver]) //If selected send data to board
        }
    }
    return (
        <div className="triangle col-2" onClick={handleTriangleSelect}>
            <div className={"trianglePart triangleLeft" + pos + colorStyle}></div>
            <div className={"trianglePart triangleRight" + pos + colorStyle}></div>
            <div className={"checkersContainer " + chekersContainerPosition} >
                {
                    checkersArray.length !== 0 &&
                    checkersArray.map((i) => {
                        return (
                            <Checker player={player} isPlayer1Turn={isPlayer1Turn} key={i} isCheckerSelected={handleTriangleSelect} containerLength={checkersArray.length} checkerIndex={i} sender={sender} startRole={startRole} eatMode={eatMode} />
                        )
                    })
                }
            </div>
            <div className={recivable + " " + recivablePos}></div>
        </div>

    )
}
export default Triangle
