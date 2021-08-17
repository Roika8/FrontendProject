import React from 'react'
import './notFound.css'
const NotFound = () => {
    const handleBtnClick = () => {
        window.location = '/main';
    }
    return (
        <div className="wrapper">
            <button className="notFoundBtn" id="btn5" >404</button>
            <button className="notFoundBtn" id="btn6" onClick={handleBtnClick}>Not</button>
            <button className="notFoundBtn" id="btn7" onClick={handleBtnClick}>Found</button>
            <button className="notFoundBtn" id="btn1" onClick={handleBtnClick}>Back</button>
            <button className="notFoundBtn" id="btn2" onClick={handleBtnClick}>To</button>
            <button className="notFoundBtn" id="btn3" onClick={handleBtnClick}>Home</button>
            <button className="notFoundBtn" id="btn4" onClick={handleBtnClick}>Page</button>
        </div>
    )
}
export default NotFound