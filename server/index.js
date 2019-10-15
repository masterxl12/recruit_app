const express = require('express')
// 创建一个路由器对象
const md5 = require('blueimp-md5')
const { UserModel, ChatModel } = require('./db/models')
const router = express.Router()
const filter = { password: 0, __v: 0 }

// 注册路由
router.post('/register', async (req, res) => {
    //console.log(req.body)  req.body = { username: 'xyc', password: '222', roletype: 'boss' }
    const { username, password, roletype } = req.body;
    UserModel.findOne({ username }, (error, user) => {
        if (user) {
            // 如果用户存在，提示存在信息
            res.send({ code: 1, msg: '此用户已存在，请重新输入用户名' })
        } else {
            // 如果用户不存在，需保存用户数据到数据库
            new UserModel({ username, roletype, password: md5(password) }).save((error, user) => {
                // 生成一个持久化cookie(userid:user_id)，并交给浏览器保存
                res.cookie('userid', user._id, { maxAge: 1000 * 60 * 60 * 7 })
                // 返回包含user的json数据
                const data = { username, roletype, _id: user._id } // 响应数据中不要携带pwd
                res.send({ code: 0, data })
            })
        }
    })
})

// 登陆路由
router.post('/login', async (req, res) => {
    const { username, password } = req.body
    UserModel.findOne({ username, password: md5(password) }, filter, (error, user) => {
        if (user) {
            res.cookie('userid', user._id, { maxAge: 1000 * 60 * 60 * 7 })
            // 返回成功登陆信息
            res.send({ code: 0, data: user })
        } else {
            res.send({ code: 1, msg: '用户名或密码错误' })
        }
    })
})

// 更新用户信息的路由 
// 注册界面的信息 {username,_id,roletype} ,更新添加:{header,salary,info,job,company}
router.post('/update', (req, res) => {
    // ---> 更新用户需要知道用户的_id,从请求的cookie得到userid
    const userid = req.cookies.userid;
    // 如果不存在，直接返回一个提示信息
    if (!userid) {
        return res.send({ code: 1, msg: '请先登录' })
    }
    // 存在，根据userid更新对应的user文档数据
    // 得到提交后的数据 
    const user = req.body;
    UserModel.findByIdAndUpdate({ _id: userid }, user, (error, oldUser) => {
        if (!oldUser) {
            // 通知浏览器删除userid cookie
            res.clearCookie('userid')
            // 返回提示信息
            res.send({ code: 1, msg: '请先登录' })
        } else {
            // 准备返回更新的user数据
            const { username, _id, roletype } = oldUser
            const data = Object.assign(user, { username, _id, roletype })
            res.send({ code: 0, data })
        }
    })
})

// 获取用户信息的路由
router.get('/user', (req, res) => {
    const userid = req.cookies.userid;
    if (!userid) {
        return res.send({ code: 1, msg: "请先登录" })
    }

    UserModel.findOne({ _id: userid }, filter, (error, user) => {
        res.send({ code: 0, data: user })
    })
})

// 根据用户类型获取用户列表
router.get('/userlist', (req, res) => {
    // console.log(req.query)
    const { roletype } = req.query;
    UserModel.find({ roletype }, filter, (error, users) => {
        res.send({ code: 0, data: users })
    })
})

// 获取当前用户所有相关聊天信息列表
router.get('/msglist', (req, res) => {
    // 获取cookie 中的userid
    const userid = req.cookies.userid
    // 查询得到所有user 文档数组
    UserModel.find(function (err, userDocs) {
        // 用对象存储所有user 信息: key 为user 的_id, val 为name 和header 组成的user 对象
        const users = userDocs.reduce((users, user) => {  // 对象容器
            users[user._id] = { username: user.username, header: user.header }
            return users
        }, {})
        /*
        查询userid 相关的所有聊天信息
        参数1: 查询条件
        参数2: 过滤条件
        参数3: 回调函数
        */
        ChatModel.find({ '$or': [{ from: userid }, { to: userid }] }, filter, (err,
            chatMsgs) => {
            // 返回包含所有用户和当前用户相关的所有聊天消息的数据
            res.send({ code: 0, data: { users, chatMsgs } })  // users->对象  chatMsgs->数组
        })
    })
})

/*
修改指定消息为已读
*/
router.post('/readmsg', (req, res) => {
    // 得到请求中的from 和to
    const from = req.body.from
    const to = req.cookies.userid
    /*
        更新数据库中的chat 数据
        参数1: 查询条件
        参数2: 更新为指定的数据对象
        参数3: 是否1 次更新多条, 默认只更新一条
        参数4: 更新完成的回调函数
    */
    ChatModel.update({ from, to, read: false }, { read: true }, { multi: true }, (err,doc) => {
        console.log('/readmsg', doc)
        res.send({ code: 0, data: doc.nModified }) // 更新的数量
    })
})
module.exports = router;

