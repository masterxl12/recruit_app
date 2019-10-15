import React, { Component } from 'react';
import { NavBar, List, InputItem, Grid, Icon } from 'antd-mobile'
import { connect } from 'react-redux'
import QueueAnim from 'rc-queue-anim';
import { sendMsg, readMsg } from '../redux/actionCreators'
// import { getUser } from '../redux/actionCreators'
const Item = List.Item
class Chat extends Component {
    // constructor(props) {
    //     super(props);
    //     this.state = {}
    // }
    state = {
        content: '',
        isShow: false // 是否显示表情
    }
    componentWillMount = () => {
        // 初始化表情列表数据
        const emojis = [
            '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃',
            '😉', '😊', '😇', '🍎', '🍏', '🍐', '🍑', '🍒', '🍓', '🥝',
            '🍅', '🥥', '🥑', '🍆', '🥔', '🥕', '🌽', '🌶', '🥞', '🧀',
            '🍗', '🥩', '🥓', '🍔', '🍟', '🍕', '🌭', '🥪', '🌮', '🌯',
            '🚣', '🚣', '🍖'];
        this.emojis = emojis.map(emoji => ({ text: emoji }))
    };
    componentDidMount = () => {
        window.scrollTo(0, document.body.scrollHeight)

    };
    componentDidUpdate = () => {
        // 显示更新列表
        window.scrollTo(0, document.body.scrollHeight)
    }
    componentWillUnmount() { // 在退出之前
        // 发请求更新消息的未读状态
        const from = this.props.match.params.userid;
        const to = this.props.user._id;
        this.props.readMsg(from, to)
    }

    handleSend = () => {
        // 收集数据
        //main.js中path='/chat/:userid' 动态的userid -> this.props.match.params.userid
        // console.log(this.props.match.params.userid, this.props.user._id)
        const from = this.props.user._id;
        const to = this.props.match.params.userid;
        const content = this.state.content
        // 发送请求(发消息)
        if (content) {
            this.props.sendMsg({ from, to, content })
        }
        // 发送消息后，输入框的数据清除
        this.setState({
            content: '',
            isShow: false
        })
    }
    toggleShow = () => {
        const isShow = !this.state.isShow;
        this.setState({ isShow });
        if (isShow) {
            // 异步手动派发resize事件，解决表情列表显示的bug
            setTimeout(() => {
                window.dispatchEvent(new Event('resize'))
            }, 0);
        }
    }
    render() {
        const { user } = this.props
        const { users, chatMsgs } = this.props.chat
        // 计算当前聊天的chatId
        const myId = user._id;
        if (!users[myId]) {   // 如果还没有获取数据，不做任何显示
            return null
        }
        const targetId = this.props.match.params.userid
        const chatId = [myId, targetId].sort().join('_')
        // chatMsgs进行过滤
        const msgs = chatMsgs.filter(msg => msg.chat_id === chatId)
        // 得到目标用户的header图片对象
        //users: {userid:{username:,header},userid:{username:,header}}
        const targetHeader = users[targetId].header;
        const targetIcon = targetHeader ? require(`../assets/images/${targetHeader}.png`) : null
        return (
            <div id='chat-page'>
                <NavBar
                    className='nav-header'
                    icon={<Icon type='left' />}
                    onLeftClick={() => this.props.history.goBack()}
                >
                    {users[targetId].username}
                </NavBar>
                <List style={{ marginBottom: 45, marginTop: 45 }}>
                    {/* alpha left right top bottom scale scaleBig scaleX scaleY */}
                    <QueueAnim type='left'>
                        {
                            msgs.map(msg => {
                                if (targetId === msg.from) {   // 对方发给我的信息显示在左边
                                    return (
                                        <Item
                                            key={msg._id}
                                            thumb={targetIcon}
                                        >
                                            {msg.content}
                                        </Item>
                                    )
                                } else {    //  我发给对方的信息显示在右边
                                    return (
                                        <Item
                                            key={msg._id}
                                            className='chat-me'
                                            // extra='我'
                                            extra={<img src={require(`../assets/images/${user.header}.png`)} alt='header' />}
                                        >
                                            {msg.content}
                                        </Item>
                                    )
                                }

                            })
                        }
                    </QueueAnim>

                </List>
                <div className='am-tab-bar'>
                    <InputItem
                        className='input-border'
                        placeholder="请输入"
                        value={this.state.content}
                        onChange={val => this.setState({ content: val })}
                        onFocus={() => this.setState({ isShow: false })}
                        extra={
                            <span>
                                <span
                                    onClick={this.toggleShow}
                                    style={{ marginRight: 5 }}
                                    role="img"
                                    aria-label="Description of the overall image"
                                >🙂</span>
                                <span onClick={this.handleSend} >发送</span>
                            </span>
                        }
                    />
                    {this.state.isShow ? (
                        <Grid
                            data={this.emojis}
                            columnNum={8}
                            carouselMaxRow={4}
                            isCarousel={true}
                            square={true}
                            onClick={item => this.setState({ content: this.state.content + item.text })}
                            itemStyle={{ height: 44, background: 'rgba(0,0,0,.1)' }}
                        />
                    ) : null}

                </div>
            </div>
        )
    }
}
export default connect(state => ({ user: state.user, chat: state.chat }), { sendMsg, readMsg })(Chat);