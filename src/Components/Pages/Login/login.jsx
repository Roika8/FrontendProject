import React, { useState } from 'react'
import Joi from 'joi';
import UsersService from '../../../Services/UsersService';
import './Login.css'
const Login = (props) => {

    const [userName, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});

    const validSchma = Joi.object({
        userName: Joi.string().required(),
        password: Joi.string().required()
    })


    const validate = () => {
        // const result = validSchma.validate({ userName, password }, { abortEarly: false });
        // if (!result.error) return null;
        const userObj = { userName: userName, password: password }
        let errors = {}
        if (userObj.userName.trim() === "")
            errors.userName = "We need to know your user name to let you in..";
        if (userObj.password.trim() === "")
            errors.password = "What is the secret word?";
            console.log(errors);
        return errors;
    }
    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            const errorsList = validate();
            if (Object.keys(errorsList).length !== 0)
                setErrors(errorsList)
            else {
                const userDetais = { userName: userName, password: password }
                const res = await UsersService.login(userDetais)
                console.log(res.data);
                localStorage.setItem('userToken', res.data)
                window.location = '/';
            }
        }
        catch (e) {
            setErrors({ notValid: e.message });
        }
    }
    return (
        <div className="login">
            <div className="loginWrapper">
                <div className="loginLeft">
                    <h3 className="loginLogo">
                        <div>Play backgammon</div>
                        <div>Meet friends,</div>
                        <div>And win games</div>
                    </h3>

                    <span className='loginDescription'>
                        <div>Play, chat and win players from all around the world,</div>
                        <div>And proove that you are the best backgammon player .</div>
                    </span>
                </div>
                <div className="loginRight">
                    <div className="loginBox">
                        <div >
                            <input autoFocus value={userName} onChange={e => setUsername(e.target.value)} id='userName' type="text" className="input" placeholder="User name" />
                            {errors.userName && <p className="loginErrorMsg">{errors.userName}</p>}

                        </div>
                        <div >
                            <input value={password} onChange={e => setPassword(e.target.value)} id='password' type="password" className="input" placeholder="Password" />
                            {errors.password && <p className="loginErrorMsg">{errors.password}</p>}
                        </div>
                        <div>
                        {errors.notValid && <p className="loginErrorMsg">{errors.notValid}</p>}

                        </div>
                        <button className="loginSub" onClick={handleSubmit}>Login</button>
                        <button className="registerSub" onClick={() => { props.history.push('/register') }}>Register</button>
                    </div>
                </div>

            </div>
        </div>
    )
}
export default Login