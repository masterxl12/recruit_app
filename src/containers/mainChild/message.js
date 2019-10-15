import React, { Component } from 'react';
import { connect } from 'react-redux'
import { List, Badge } from 'antd-mobile'
const Item = List.Item
const Brief = Item.Brief
class Message extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    getLastMsgs = (chatMsgs, userid) => {
        // 对chatMsgs按chat_id进行分组，并得到每个组的lastMsg组成的数组
        /**
         * 1. 找出每个聊天的lastMsg，并用一个容器对象来保存{chat_id:lastMsg}
         * 2. 得到所有lastMsg的数组
         * 3. 对数组进行排序（按create_time降序）
         */
        // 1. 找出每个聊天的lastMsg，并用一个容器对象来保存{chat_id:lastMsg}
        const lastMsgObjs = {};
        chatMsgs.forEach(msg => {
            // 对msg进行个体的统计  
            if (msg.to === userid && !msg.read) {
                msg.unReadCount = 1
            } else {
                msg.unReadCount = 0
            }
            // 可以理解为:当前有无对话过程，如果当前没有对话，上一次对话msg即为最后，反之，当前聊天内容不断更新放在最后
            // 得到msg的聊天标识id
            const chatId = msg.chat_id;
            // 获取已保存的当前组件的lastMsg
            let lastMsg = lastMsgObjs[chatId];
            if (!lastMsg) { // 当前msg就是所在组的lastMsg
                lastMsgObjs[chatId] = msg
            } else {
                // 累加unReadCount=已经统计的 + 当前msg的 
                const unReadCount = lastMsg.unReadCount + msg.unReadCount
                // 如果msg比lastMsg晚，就将msg保存为LastMsg
                if (msg.create_time > lastMsg.create_time) {
                    lastMsgObjs[chatId] = msg
                }
                // 将unReadCount保存在最新的lastMsg上
                lastMsgObjs[chatId].unReadCount = unReadCount
            }
        })
        // 2. 得到所有lastMsg的数组
        const lastMsgs = Object.values(lastMsgObjs)
        // 3. 对数组进行排序（按create_time降序）
        lastMsgs.sort((m1, m2) => m2.create_time - m1.create_time)
        // console.log(lastMsgs)
        return lastMsgs
    }
    render() {
        const { user } = this.props
        const { users, chatMsgs } = this.props.chat

        // 对chatMsgs按chat_id进行分组
        const lastMsgs = this.getLastMsgs(chatMsgs, user._id)
        // 

        return (
            <List style={{ marginTop: 45, marginBottom: 50, }}>
                {
                    lastMsgs.map(msg => {
                        // 得到目标用户的id
                        const targetUserId = msg.to === user._id ? msg.from : msg.to
                        // 得到目标用户的信息
                        const targetUser = users[targetUserId]
                        return (
                            <Item
                                key={msg._id}
                                extra={<Badge text={msg.unReadCount} />}
                                thumb={targetUser.header ? require(`../../assets/images/${targetUser.header}.png`) : null}
                                onClick={() => this.props.history.push(`/chat/${targetUserId}`)}
                                arrow='horizontal'
                            >
                                {msg.content}
                                {/* 判断最后一条消息是来自对方还是来自自己 */}
                                <Brief>{targetUser.username}</Brief>
                            </Item>
                        )
                    })
                }
            </List>
        )
    }
}

export default connect(state => ({ user: state.user, chat: state.chat }))(Message);