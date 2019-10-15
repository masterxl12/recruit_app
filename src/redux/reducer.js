import { combineReducers } from 'redux'
import {
    AUTH_SUCCESS,
    ERROR_MSG,
    RECEIVE_USER,
    RESET_USER,
    RECEIVE_USER_LIST,
    RECEIVE_MSG_LIST,
    RECEIVE_MSG,
    MSG_READ
} from './actionType'
import { getRedirectTo } from '../utils/tools'
const defautState = {
    username: '',  // 用户名
    msg: '',       // 错误提示信息
    roletype: '', // 用户类型,employee/boss
    redirectTo: ''  // 需要自动重定向的路由路径
}
function user(state = defautState, action) {
    switch (action.type) {
        case AUTH_SUCCESS:  // data:user
            const { roletype, header } = action.data
            // { type: AUTH_SUCCESS, data: {username: "c", roletype: "boss", _id: "5d9f08321715665b389b4a42"} }
            /*此时返回的
            { ...state, ...action.data } = 
                {msg:'',username: "c", roletype: "boss", _id:"5d9f08321715665b389b4a42"}
             */
            // 先把原先的state中数据解构，然后使用action.data把以前的数据覆盖,授权成功后，跳转到主界面
            return { ...action.data, redirectTo: getRedirectTo(roletype, header) }
        case ERROR_MSG:     // data:msg
            return { ...state, msg: action.data } // {username: '',msg: '',roletype: ''}
        case RECEIVE_USER:  // data:user
            // action.data -> { "header":"头像20","job":"web","info":"vue/react/node","username":"xl","_id":"5da06f7469bd626a3dc5d541","roletype":"employee"}
            return action.data
        case RESET_USER:    // data:msg
            return { ...defautState, msg: action.data }
        default:
            return state;
    }
}

const initUserList = []

function userList(state = initUserList, action) {
    switch (action.type) {
        case RECEIVE_USER_LIST:  // data值为userlist
            return action.data
        default:
            return state
    }
}

const initChat = {
    users: {},      //所有用户信息的对象,结构--->users: {userid:{username:,header}}
    chatMsgs: [],   //当前用户所有相关msg的数组
    unReadCount: 0  //总的未读数量 
}
// 产生聊天转态的reducer
const chat = (state = initChat, action) => {
    switch (action.type) {
        case RECEIVE_MSG_LIST:
            // console.log(action.data)
            const { users, chatMsgs, userid } = action.data
            return {
                users,
                chatMsgs,
                unReadCount: chatMsgs.reduce((preTotal, msg) => preTotal + (!msg.read && msg.to === userid ? 1 : 0), 0)
            }
        case RECEIVE_MSG:
            const { chatMsg } = action.data
            return {
                users: state.users,
                chatMsgs: [...state.chatMsgs, chatMsg],
                unReadCount: state.unReadCount + (!chatMsg.read && chatMsg.to === action.data.userid ? 1 : 0)
            }
        case MSG_READ:
            const { from, to, count } = action.data
            return {
                users: state.users,
                chatMsgs: state.chatMsgs.map(msg => {
                    if (msg.from === from && msg.to === to && !msg.read) { //需要更新
                        return { ...msg, read: true }
                    } else {  // 不需要更新
                        return msg
                    }
                }),
                unReadCount: state.unReadCount - count
            }
        default:
            return state
    }
}
// 向外暴露的状态结构:{user:{},userList:[],chat:{}}
export default combineReducers({
    user, userList, chat
})