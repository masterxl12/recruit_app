module.exports = function (server) {
    const io = require('socket.io')(server)
    // 监视客户端与服务器端的连接
    io.on('connection', (socket) => {
        // console.log('有一个客户端连接上服务器')
        // 绑定监听，接收客户端发送的消息
        socket.on('sendMsg', (data) => {
            console.log('服务器接收到客户端发送的消息:', data)
            // 处理接收到的数据
            data.name = data.name.toUpperCase()
            // 服务器向客户端发送消息
            io.emit("receiveMsg", data)
            // io.emit('receiveMsg', data.name + '_' + data.date)    // 发送所有连接上服务器的客户端
            // socket.emit('receiveMsg',data.name + '_' + data.date) // 发送给当前socket对应的客户端
            console.log('服务器向客户端发送的消息:',data)
        })
    })
}
