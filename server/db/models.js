/**包含多个操作数据库集合数据的model */
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/recurit-test2',
    {
        useCreateIndex: true,
        useFindAndModify: true,
        useNewUrlParser: true
    })
const conn = mongoose.connection;
conn.on('connected', () => { console.log('db is connected successfully') })

// 定义数据字段的约束(描述文档结构)
const userSchema = mongoose.Schema({
    username: { type: String, required: true }, // 用户名
    password: { type: String, required: true }, // 密码
    roletype: { type: String, required: true }, // 用户类型: dashen/laoban
    header: { type: String }, // 头像名称
    job: { type: String }, // 职位
    info: { type: String }, // 个人或职位简介
    company: { type: String }, // 公司名称
    salary: { type: String } // 工资
})
// 定义数据集合
const UserModel = mongoose.model('user', userSchema)  // 数据集合为:users
// 向外暴露Model，不确定暴露的数据集合，分别暴露
exports.UserModel = UserModel
// 定义chats 集合的文档结构
const chatSchema = mongoose.Schema({
    from: { type: String, required: true }, // 发送用户的id
    to: { type: String, required: true }, // 接收用户的id
    chat_id: { type: String, required: true }, // from 和to 组成的字符串
    content: { type: String, required: true }, // 内容
    read: { type: Boolean, default: false }, // 标识是否已读
    create_time: { type: Number,required: true } // 创建时间
})
// 定义能操作chats 集合数据的Model
const ChatModel = mongoose.model('chat', chatSchema) // 数据集合为:chats
// 向外暴露Model
exports.ChatModel = ChatModel
