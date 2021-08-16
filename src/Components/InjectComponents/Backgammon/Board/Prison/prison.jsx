import React from 'react'
import './prison.css'
import Checker from '../Checker/checker'
const Prison = ({ position, player, numOfCheckers,pointIndex, isPlayer1Turn, sender,reciver, setTriangleData,  startRole }) => {
    let pos = position === 'up' ? 'Up' : 'down';
    let chekersContainerPosition = pos === 'Up' ? '' : 'chekersContainerPosition'

    //Checkers 1 array
    let checkersArray = [];
    if (numOfCheckers !== 0) {
        for (let index = 0; index < numOfCheckers; index++) {
            checkersArray.push(index)
        }
    }
    const handlePrisonerSelect = () => {
        if(startRole){
            setTriangleData([sender, pointIndex, reciver]) //If selected send data to board
        }

    }

    return (
        <div className="prison col-8">
            <div className={"prisonPart" + pos}></div>
            <div className={"prisonCheckersContainer " + chekersContainerPosition} >
                {
                    checkersArray.length !== 0 &&
                    checkersArray.map((i) => {
                        return (
                            <Checker player={player} isPlayer1Turn={isPlayer1Turn} key={i} isCheckerSelected={handlePrisonerSelect} containerLength={checkersArray.length} checkerIndex={i} sender={sender} startRole={startRole} />
                        )
                    })
                }
            </div>
        </div>

    )
}
export default Prison;