import React, { useState, useEffect } from 'react'
import UsersService from '../../../Services/UsersService';
import Joi from 'joi';
import './register.css'
import { Dropdown } from 'semantic-ui-react';
import validInfo from './registerValidations';
const Register = (props) => {
    const [userName, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");

    const [email, setEmail] = useState("");
    const [firstName, setfirstName] = useState("");
    const [lastName, setlastName] = useState("");
    const [gender, setgender] = useState(-1);
    const [errors, setErrors] = useState({})



    const validate = () => {
        const userObj = { userName: userName, password: password, password2: password2, email: email, firstName: firstName, lastName: lastName, gender: gender }
        const errors = validInfo(userObj)
        return errors;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        let errorsList;
        try {
            errorsList = validate();
            console.log(errorsList);
            if (Object.keys(errorsList).length !== 0)
                setErrors(errorsList)
            else {
                const userObj = { userName: userName, password: password, email: email, firstName: firstName, lastName: lastName, gender: gender }
                console.log(userObj);
                const res = await UsersService.register(userObj);
                localStorage.setItem('userToken', res.data);
                window.location = '/';
            }
        }
        catch (e) {
            if (e.message === 'username is already taken') {
                console.log({ userNameTaken: e.message });
                setErrors({ userNameTaken: e.message })
            }
            else {
                console.log({ emailTaken: e.message });
                setErrors({ emailTaken: e.message })
            }
            console.log(errors);
        }
    }
    const genderOptions =
        [
            { key: -1, text: 'Selected Gender', value: -1 },
            { key: 0, text: 'Male', value: 0 },
            { key: 1, text: 'Female', value: 1 },
            { key: 2, text: 'Both', value: 2 }
        ]

    return (
        <div className="register">
            <div className="registerWrapper">
                <div className="registerLeft">
                    <h4 className="registerLogo">Start now!</h4>
                    <span className='registerDescription'>Already registers? </span>
                    <button className="loginRedirect" onClick={() => { props.history.push('/login') }}>Back to sign in</button>

                </div>
                <div className="registerRight">
                    <div className="registerBox" onSubmit={handleSubmit}>
                        <div >
                            <input placeholder="*User name" autoFocus value={userName} onChange={e => setUsername(e.target.value)} type="text" className="input" required />
                            {errors.userName && <p className="errorMsg">{errors.userName}</p>}
                            {errors.userNameTaken && <p className="errorMsg">{errors.userNameTaken}</p>}


                        </div>
                        <div >
                            <input placeholder="*Password" value={password} onChange={e => setPassword(e.target.value)} type="password" className="input" required />
                            {errors.password && <p className="errorMsg">{errors.password}</p>}

                        </div>
                        <div >
                            {/* //Repassword */}
                            <input placeholder="*Re-password" value={password2} onChange={e => setPassword2(e.target.value)} type="password" className="input" required />
                            {errors.password2 && <p className="errorMsg">{errors.password2}</p>}

                        </div>
                        <div >
                            <input placeholder="*First name" value={firstName} onChange={e => setfirstName(e.target.value)} type="text" className="input" required />
                            {errors.firstName && <p className="errorMsg">{errors.firstName}</p>}
                        </div>
                        <div >
                            <input placeholder="*Last name" value={lastName} onChange={e => setlastName(e.target.value)} type="text" className="input" required />
                            {errors.lastName && <p className="errorMsg">{errors.lastName}</p>}
                        </div>
                        <div >
                            <input placeholder="*Email" value={email} onChange={e => setEmail(e.target.value)} type="Email" className="input" required />
                            {errors.email && <p className="errorMsg">{errors.email}</p>}
                            {errors.emailTaken && <p className="errorMsg">{errors.emailTaken}</p>}


                        </div>
                        <div className="*genderSelect">
                            <Dropdown inline options={genderOptions} selection defaultValue={genderOptions[0].value} onChange={(e, data) => { e.preventDefault(); setgender(data.value) }} required />
                            {errors.gender && <p className="errorMsg">{errors.gender}</p>}

                        </div>
                        <button className="registerButton" type="button" onClick={handleSubmit}>Register</button>
                    </div>
                </div>

            </div>
        </div>

    )
}
export default Register