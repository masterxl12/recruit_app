const express = require('express');
const indexRouter = require('./index');
const cookieParser = require('cookie-parser')
const http = require('http')
const app = express()
app.use(express.json()) 
// "proxy": "http://localhost:4000"
// 用来解析application/x-www-form-urlencoded"编码类型的数据
app.use(express.urlencoded({ extended: false }));
// var cookieParser = require('cookie-parser');
// 设置，获取和删除 cookie
app.use(cookieParser());
app.use('/', indexRouter);

//
const server = http.createServer(app)
require('./socketIO/socketIO_Server')(server)  
app.set('port',4000);
server.listen(4000);
// 用于展示数据
app.get('/', async (req, res) => {
    res.send('index')
})

// app.listen(4000, () => {
//     console.log('http://localhost:4000')
// })
module.exports = app;
