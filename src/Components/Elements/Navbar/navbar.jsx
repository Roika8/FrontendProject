import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import PropTypes from 'prop-types';
import UsersService from '../../../Services/UsersService';
const Navbar = (props) => {
    const { user } = props;
    const handleLogout = () => {
        localStorage.removeItem('userToken');
        UsersService.logout(user)
        alert('user logged out')
        window.location = '/login';
    }
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <Link className="navbar-brand" to="/">Navbar</Link>
            <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                <div className="navbar-nav">
                    <NavLink className="nav-item nav-link active" to="/">
                        Home
                        <span className="sr-only">(current)</span>
                    </NavLink>

                    {
                        user ?
                            <a className="nav-item nav-link" onClick={handleLogout}>
                                Logout
                            </a>
                            :
                            <span></span>
                    }

                    {
                        user ?
                            <span className="nav-item nav-link"> Welcome {user.firstName}  {user.lastName}</span>
                            :
                            <span></span>
                    }
                </div>

            </div>
        </nav>
    )
}
Navbar.prototype = {
    user: PropTypes.object.isRequired
}
export default Navbar