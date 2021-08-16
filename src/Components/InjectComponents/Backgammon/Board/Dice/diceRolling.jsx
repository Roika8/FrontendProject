import React, { useEffect, useState } from 'react'
import Dice from './dice';
import './diceRolling.css'
const DiceRolling = ({ dicesValues, isPlayer1Turn, disableCubes, opponentDice1Value, opponentDice2Value }) => {
    console.log(opponentDice1Value,opponentDice2Value);
    //Random number between 1-6
    const [dice1Value, setDice1Value] = useState();
    const [dice2Value, setDice2Value] = useState();
    // const [player1Turn, setPlayer1Turn] = useState(isPlayer1Turn);
    const [isFirstTime, setIsFirstTime] = useState(true);
    //Is rolling the dices
    const [canRoll, setCanRoll] = useState(!disableCubes);

    const roll = () => {
        setIsFirstTime(false);
        const val1 = Math.floor(Math.random() * 6) + 1
        const val2 = Math.floor(Math.random() * 6) + 1
        setDice1Value(val1);
        setDice2Value(val2);

        dicesValues([val1, val2])
        // setPlayer1Turn(!player1Turn)

        // setCanRoll(false);
    }

    return (
        <React.Fragment>
            <div className="diceWrapper">
                <div className="dice1">
                    {
                        opponentDice1Value ? <Dice value={opponentDice1Value} /> : <Dice value={dice1Value} />
                    }

                </div>
                <div className="diceRolling">
                    <div className="rollClick">
                        <button onClick={roll} className="diceRollButton" disabled={disableCubes}>Roll</button>
                    </div>
                    {isFirstTime && !opponentDice1Value ? 'Start game' : isPlayer1Turn ? <div>Player 1 role</div> : <div>Player 2 role</div>}
                </div>

                <div className="dice2">
                    {
                        opponentDice2Value ? <Dice value={opponentDice2Value} /> : <Dice value={dice2Value} />
                    }
                </div>

            </div>
        </React.Fragment>
    )
}

export default DiceRolling;