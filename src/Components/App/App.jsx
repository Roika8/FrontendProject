import React, { useEffect, useState } from 'react';
import { Route, Switch, Redirect, useHistory } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

//Components
import notFound from '../Pages/Notfound/notFound';
import Login from '../Pages/Login/login';
import Register from '../Pages/Register/regiester';
import Chat from '../Pages/Chat/Chat';
import About from '../Pages/About/about';
const App = () => {
    const history = useHistory();
    let LoggedInUser = "";

    useEffect(() => {
        try {
            const userToken = localStorage.getItem('userToken');
            const user = jwtDecode(userToken);
            LoggedInUser = user;
            history.push('/Main')
        }
        catch (e) {
            history.push('/login')
        }
    })
    return (
        <React.Fragment>
            <main className="Container">
                <Switch>
                    <Route path='/Main' component={(props) => <Chat {...props} user={LoggedInUser} />} />
                    <Route path='/login' component={Login} />
                    <Route path='/register' component={Register} />
                    <Route path='/about' component={About} />
                    <Route path='/not-found' component={notFound} />
                    <Redirect to='/not-found' />
                </Switch>
            </main>
        </React.Fragment>
    )
}

export default App;