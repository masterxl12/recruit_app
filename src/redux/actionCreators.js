import {
    reqRegister,
    reqLogin,
    reqUpdateUser,
    reqUser,
    reqUserList,
    reqChatMsgList,
    reqReadMsg
} from '../api/index'
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
import io from 'socket.io-client'

/*
    单例对象
        1. 创建对象之前：判断对象是否创建，不存在需要创建
        2. 创建对象之后：保存对象
*/
function initIO(dispatch, userid) {
    if (!io.socket) {
        io.socket = io('ws://localhost:4000')
        io.socket.on('receiveMsg', (chatMsg) => {
            console.log('客户端接收服务器的数据:', chatMsg)
            // 只有当chatMsg是与当前用户相关的消息，才去分发同步action保存消息
            if (userid === chatMsg.from || userid === chatMsg.to) {
                dispatch(receiveMsg(chatMsg,userid))
            }
        })
    }
}

// 发送消息的异步action
export const sendMsg = ({ from, to, content }) => {
    return dispatch => {
        console.log('客户端向服务器发送的消息:', { from, to, content })
        // 客户端发消息
        io.socket.emit('sendMsg', { from, to, content })
    }
}
// 读取消息的异步action
export const readMsg = (from,to) => {
    return async dispatch => {
        const res = await reqReadMsg(from)
        const result = res.data;
        if(result.code === 0){
            const count = result.data
            dispatch(msgRead({count,from,to}))
        }
    }
}
// 异步获取消息列表数据
async function getMsgList(dispatch,userid) {
    initIO(dispatch,userid)  //用户登录后初始化io
    const res = await reqChatMsgList();
    const result = res.data
    if (result.code === 0) {
        const { chatMsgs, users } = result.data
        // 分发同步action
        dispatch(receiveMsgList({ chatMsgs, users,userid }))
    }
    console.log(res.data)
}
// 授权成功的同步action
const authSuccess = (user) => ({ type: AUTH_SUCCESS, data: user })
// 错误提示信息的同步action
const errorMsg = (msg) => ({ type: ERROR_MSG, data: msg })
// 接收用户信息的同步action
const receiveUser = (user) => ({ type: RECEIVE_USER, data: user })
// 重置用户信息的同步action
export const resetUser = (msg) => ({ type: RESET_USER, data: msg })
// 接收用户信息列表的同步action
const receiveUserList = (userlist) => ({ type: RECEIVE_USER_LIST, data: userlist })
// 接收消息列表的同步action
export const receiveMsgList = ({ chatMsgs, users,userid }) => ({ type: RECEIVE_MSG_LIST, data: { chatMsgs, users,userid } })
// 接收一个消息的同步action
const receiveMsg = (chatMsg,userid) => ({ type: RECEIVE_MSG, data: {chatMsg,userid }})
// 读取消息的同步action
const msgRead = ({count,from,to}) => ({type:MSG_READ,data:{count,from,to}})
export const register = (user) => {
    const { username, password, password2, roletype } = user;
    // 注册用户的表单前台验证，如果不通过，返回一个errorMsg的同步action
    if (password !== password2) {
        return errorMsg('前后输入密码要一致')
    } else if (!username) {
        return errorMsg('用户名需要指定')
    }
    // 表单数据合法，返回一个ajax的异步action函数
    return async (dispatch) => {
        // 发送注册的异步ajax请求
        // res = {code:0,data:user,msg:''}
        const res = await reqRegister({ username, password, roletype })
        //result -> data: {username: "c", roletype: "boss", _id: "5d9f08321715665b389b4a42"}
        const result = res.data;
        // console.log(result)
        if (result.code === 0) {  // 成功
            getMsgList(dispatch,result.data._id)
            // 分发授权成功的同步action
            // { type: AUTH_SUCCESS, data: {username: "c", roletype: "boss", _id: "5d9f08321715665b389b4a42"} }
            dispatch(authSuccess(result.data))
        } else {  // 失败
            // 分发错误提示信息的同步action
            // result = {code: 1, msg: "此用户已存在，请重新输入用户名"}
            dispatch(errorMsg(result.msg))
            // errorMsg(result.msg) -> { type: ERROR_MSG, data: "此用户已存在，请重新输入用户名" }
        }
    }
}
export const login = (user) => {
    const { username, password } = user;
    // 注册用户的表单前台验证，如果不通过，返回一个errorMsg的同步action
    if (!password) {
        return errorMsg('密码需要输入')
    } else if (!username) {
        return errorMsg('用户名需要指定')
    }
    // 表单数据合法，返回一个ajax的异步action函数
    return async (dispatch) => {
        // 发送注册的异步ajax请求
        const res = await reqLogin(user)  // res = {code:0,data:user,msg:''}
        const result = res.data;
        if (result.code === 0) {  // 成功
            getMsgList(dispatch,result.data._id)
            // 授权成功的同步action
            dispatch(authSuccess(result.data))
        } else {  // 失败
            // 错误提示信息的同步action
            dispatch(errorMsg(result.msg))
        }
    }
}

// 更新用户异步action
export const updateUser = (user) => {
    return async dispatch => {
        const res = await reqUpdateUser(user)
        const result = res.data
        // console.log(result)
        if (result.code === 0) {
            dispatch(receiveUser(result.data))
        } else {
            dispatch(resetUser(result.msg))  // -> {type: RESET_USER, data: msg}
        }
    }
}

// 获取用户信息异步action
export const getUser = () => {
    return async dispatch => {
        const res = await reqUser()
        const result = res.data
        // console.log(result)
        if (result.code === 0) {
            // getMsgList(dispatch)
            getMsgList(dispatch,result.data._id)
            dispatch(receiveUser(result.data))
        } else {
            dispatch(resetUser(result.msg))
        }
    }
}

// 获取用户信息列表的异步action
export const getUserList = (roletype) => {
    return async dispatch => {
        const res = await reqUserList(roletype)
        const result = res.data
        console.log(result)
        if (result.code === 0) {
            dispatch(receiveUserList(result.data))
        }
    }
}

