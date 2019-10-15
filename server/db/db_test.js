// 0   引入md5-加密
const md5 = require('blueimp-md5')
// 1.  连接数据库
// 1.1 引入数据库mongoose
const mongoose = require('mongoose')
// 1.2 连接指定的数据库
mongoose.connect('mongodb://localhost:27017/recurit-test', {
    useCreateIndex: true,
    useFindAndModify: true,
    useNewUrlParser: true
})
// 1.3 获取连接对象
const conn = mongoose.connection
// 1.4 绑定连接完成的监听（用于提示连接成功）
conn.on('connected', () => { // 连接成功回调
    console.log('数据库连接成功')
})

// 2.  得到对应特定集合的Model
// 2.1 定义Scheme（描述文档结构）
const userSchema = mongoose.Schema({  // 指定文档结构
    username: { type: String, required: true },
    password: { type: String, required: true },
    roletype: { type: String, required: true },
    header: { type: String }
})
// 2.2 定义Model（与集合对应，可以操作集合）
const UserModel = mongoose.model('user', userSchema)  // 指定集合的名称为users

// 3.   通过Model 或其实例对集合数据进行CRUD 操作
// 3.1. 通过Model 实例的save()添加数据
const testSave = () => {
    const userModel = new UserModel({
        username: 'Boby',
        password: md5('123'),
        roletype: 'employee'
    })
    userModel.save((error, user) => {
        console.log('save()', error, user)
    })
}
// testSave()
// 3.2. 通过Model 的find()/findOne()查询多个或一个数据
const testFind = () => {
    // 查询多个........得到的是包含所有匹配文档对象的数组
    UserModel.find((error, users) => {
        console.log('find()', error, users)
    })
    // 查询一个........得到的是匹配的文档对象
    UserModel.findOne({ roletype: 'boss' }, (error, user) => {
        console.log('findOne()', error, user)
    })
}
// testFind()
// 3.3. 通过Model 的findByIdAndUpdate()更新某个数据
const testUpdate = () => {
    UserModel.findByIdAndUpdate(
        { _id: '5d9e899470bcfc4f49e90cec' },
        { username: 'Jack' },
        (error, user) => {  // 返回old的文档对象
            console.log(error, user)
        }
    )
}
// testUpdate()
// 3.4. 通过Model 的remove()删除匹配的数据
const testDelete = () => {
    UserModel.remove({ username: 'Boby' }, (error, docu) => {
        console.log(error, docu)
    })
}
testDelete()