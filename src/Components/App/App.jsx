import React, { useEffect, useState } from 'react';
import { Route, Switch, Redirect, useHistory } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import notFound from '../Pages/Notfound/notFound';
import Login from '../Pages/Login/login';
import Register from '../Pages/Register/regiester';
import Chat from '../Pages/Chat/Chat';


const App = (props) => {



    const history = useHistory();


    //Mount first time
    useEffect(() => {
        try {
            const userToken = localStorage.getItem('userToken');
            const user = jwtDecode(userToken);
            // setUser(user);
            history.push('/Main')

            // socket.current = io(ENDPOINT);
        }
        catch (e) {
            history.push('/login')
        }
    })
    return (
        <div>
            <main className="Container">
                <Switch>
                    {/* <Route path='/' render={props => <Chat socketConnection={socket} {...props} />} /> */}
                    <Route path='/Main' component={Chat} />
                    <Route path='/login' component={Login} />
                    <Route path='/register' component={Register} />
                    <Route path='/not-found' component={notFound} />
                    {/* <Route path='/' exact component={Users} /> */}
                    <Redirect to='/not-found' />
                </Switch>
            </main>
        </div>

    )
}

export default App;