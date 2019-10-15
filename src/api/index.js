// 包含多个接口请求的函数的模块
import ajax from './ajax'
// 注册接口
export const reqRegister    = (user) => ajax('/register', user, "POST")
// 登陆接口
export const reqLogin       = ({ username, password }) => ajax('/login', { username, password }, "POST")
// 更新接口
export const reqUpdateUser  = (user) => ajax('/update', user, "POST")
// 获取用户信息
export const reqUser        = () => ajax('/user')
// 获取用户信息列表
export const reqUserList    = (userType) => ajax('/userlist', { roletype: userType }) // {roletype} -> {roletype:roletype}
// 获取当前用户的聊天消息列表
export const reqChatMsgList = () => ajax('/msglist')
// 修改指定消息为已读
export const reqReadMsg     = (from) => ajax('/readmsg', { from }, "POST")

