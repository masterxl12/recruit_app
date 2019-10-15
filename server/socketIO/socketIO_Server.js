const { ChatModel } = require('../db/models')
module.exports = function (server) {
    const io = require('socket.io')(server)
    // 监视客户端与服务器端的连接
    io.on('connection', (socket) => {
        // console.log('有一个客户端连接上服务器')
        // 绑定监听，接收客户端发送的消息
        socket.on('sendMsg', ({ from, to, content }) => {
            console.log('服务器接收到客户端发送的消息:', { from, to, content })
            // 处理接收到的数据(保存消息)
            // 准备chatMsg消息对象的相关数据
            const chat_id = [from, to].sort().join('_')
            const create_time = Date.now()
            // const date = new Date(Date.now())
            // const create_time = parseInt(date.getFullYear().toString() + (date.getMonth() + 1) + date.getDate() + date.getHours() + date.getMinutes() + date.getSeconds())
            new ChatModel({ from, to, content, chat_id, create_time }).save((error, chatMsg) => {
                if (error) {
                    console.log(err)
                } else {
                    //  向所有连接上的客户端发送数据
                    io.emit('receiveMsg', chatMsg)
                    console.log('向客户端发送的消息:', chatMsg)
                }
            })
        })
    })
}
