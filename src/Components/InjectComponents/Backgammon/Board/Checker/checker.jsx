import React, { useState, useEffect } from 'react'
import './checker.css'
const Checker = ({ player, isPlayer1Turn, checkerIndex, containerLength, sender, isCheckerSelected, startRole, eatMode }) => {
    //Set checker color
    let playerClass = player === 1 ? 'Dark' : 'Bright';
    //Set if checker is match with the player (player 1 black--player 2 white )
    let disable;
    // Player 1

    if (isPlayer1Turn === true) {
        //Checkers black
        if (player === 1) {
            if (checkerIndex === containerLength - 1) {
                disable = false;
            }
            else {
                disable = true;
            }
        }
        else
            disable = true;
    }
    //Player 2
    if (isPlayer1Turn === false) {
        //checker not black
        if (player === 2) {
            if (checkerIndex === containerLength - 1) {
                disable = false;
            }
            else {
                disable = true;
            }
        } else
            disable = true;
    }
    if (!startRole)
        disable = true;
    if (eatMode)
        disable = true;
    const disClass = disable ? 'disable' : 'enable';
    const [isSelected, setIsSelected] = useState(false);


    const handleCheckerSelect = () => {
        if (sender) { //If mode is to send to checker
            setIsSelected(true) //CSS work
            isCheckerSelected(true); //Send selected to triangle
        }
        else {
            setIsSelected(false);//css work
            isCheckerSelected(false);
        }

    }

    return (
        disClass === 'enable' ?
            isSelected ?
                <div className={'checker ' + playerClass + ' ' + disClass + ' selected'} onClick={handleCheckerSelect}></div>
                :
                <div className={'checker ' + playerClass + ' ' + disClass} onClick={handleCheckerSelect}></div>
            :
            <div className={'checker ' + playerClass + ' ' + disClass} ></div>
    )
}
export default Checker;
