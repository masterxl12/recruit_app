// 引入客户端
import io from 'socket.io-client'
// 连接服务器, 得到与服务器连接的socket 对象
const socket = io('ws://localhost:4000')

// 发送消息给服务器
socket.emit('sendMsg', { name: 'xl', date: Date.now() })
console.log('客户端向服务器发送消息:',{ name: 'xl', date: Date.now() })

// 绑定监听，接收服务器发送过来的数据
socket.on('receiveMsg',(data) =>{
    console.log('客户端接收服务器的数据:',data)
})