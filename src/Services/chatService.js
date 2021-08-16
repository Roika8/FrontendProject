import httpService from "./httpService";
import config from '../config.json';
import jwtDecode from 'jwt-decode';

const getChatRoomID = async (id1Param, id2Param) => {
    try {
        const chatRoom = await httpService.post(`${config.apiEndPoint}/chatRoom`, {
            id1: id1Param,
            id2: id2Param
        })
        console.log(chatRoom);
        return chatRoom.data
    }
    catch (e) {
        if (e.response.status === 404) {
            throw new Error('Unexcpected error connecting to server');
        }
        if (e.response.status === 400 || e.response.status === 500) {
            throw new Error(e.response.data);
        }

    }
}
const getChatRoomMessages = async (chatRoomID) => {
    try {
        const messages = await httpService.get(`${config.apiEndPoint}/message/${chatRoomID}`)
        console.log(messages);
        return messages;
    }
    catch (e) {
        if (e.response.status === 404) {
            throw new Error('Unexcpected error connecting to server');
        }
        if (e.response.status === 400 || e.response.status === 500) {
            throw new Error(e.response.data);
        }
    }
}
const sendMessage = async (msgParams) => {
    try {
        const res = await httpService.post(`${config.apiEndPoint}/message/new`, msgParams);
        const { data } = res;
        return data
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
export default { getChatRoomID, getChatRoomMessages, sendMessage }
