import httpService from "./httpService";
import config from '../config.json';
import jwtDecode from 'jwt-decode';



const register = async (user) => {
    try {
        const res = await httpService.post(`${config.apiEndPoint}/users/register`, {
            userName: user.userName,
            firstName: user.firstName,
            lastName: user.lastName,
            password: user.password,
            email: user.email,
            gender: user.gender
            //status is set to true on the server
        })
        return res
    }
    catch (e) {
        if (e.response.status === 404) {
            // alert('Unexcpected error connecting to server')
            throw new Error('Unexcpected error connecting to server');
        }
        if (e.response.status === 400 || e.response.status === 500) {
            throw new Error(e.response.data);
        }

    }

}
const login = async (user) => {
    try {
        const res = await httpService.post(`${config.apiEndPoint}/users/login`, {
            userName: user.userName,
            password: user.password
        })
        return res;
    }
    catch (e) {
        if (e.response.status === 404) {
            // alert('Unexcpected error connecting to server')
            throw new Error('Unexcpected error connecting to server');
        }
        if (e.response.status === 400 || e.response.status === 500) {
            throw new Error(e.response.data);
        }
    }
}
const logout = async (user) => {
    try {
        console.log(user);
        const res = await httpService.post(`${config.apiEndPoint}/users/logout`, {
            _id: user
        });
        return res;

    }
    catch (e) {
        if (e.response.status === 404) {
            // alert('Unexcpected error connecting to server')
            throw new Error('Unexcpected error connecting to server');
        }
        if (e.response.status === 400 || e.response.status === 500) {
            throw new Error(e.response.data);
        }
    }
}
const getAllUsers = async () => {
    try {
        const users = await httpService.get(`${config.apiEndPoint}/users`);
        const usersArray = [];
        Object.entries(users).forEach(entry => {
            const [key, value] = entry;
            usersArray.push(value);
        })
        return usersArray[0]
    }
    catch (e) {
        if (e.response.status === 404) {
            // alert('Unexcpected error connecting to server')
            throw new Error('Unexcpected error connecting to server');
        }
        if (e.response.status === 400 || e.response.status === 500) {
            throw new Error(e.response.data);
        }
    }
}
//Get muliple users by ids 
const getUsersByID = (usersIDS) => {
    let users = []
    usersIDS.forEach(async (userID) => {
        const user = await httpService.get(`${config.apiEndPoint}/users/${userID}`)
        users.push(user.data);
    });
    return users;
}
//get user by id 
const getUserByID = async (userID) => {
    try {
        const user = await httpService.get(`${config.apiEndPoint}/users/${userID}`)
        return user;
    }
    catch (e) {
        console.log(e);
    }
}

//get user from the token in local storage
const getUserIDfromToken = () => {
    try {
        const userToken = localStorage.getItem('userToken');
        const user = jwtDecode(userToken);
        return user._id;
    }
    catch (e) {
        return -1
    }
}

export default { getUsersByID, getAllUsers, register, login, logout, getUserIDfromToken ,getUserByID}