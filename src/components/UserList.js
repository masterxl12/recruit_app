// 显示指定用户列表的ui组件
import React, { Component } from 'react';
import { WhiteSpace, WingBlank, Card } from 'antd-mobile'
import PropTypes from 'prop-types'
import QueueAnim from 'rc-queue-anim';
import { withRouter } from 'react-router-dom'
const Header = Card.Header
const Body = Card.Body

class UserList extends Component {
    static propTypes = {
        userList: PropTypes.array.isRequired
    }
    state = {}
    render() {
        const { userList } = this.props
        return (
            <WingBlank style={{ marginBottom: 50, height: 'inherit', marginTop: 45, }}>
                <QueueAnim type="scaleX">
                    {
                        userList.map(user => (
                            <div key={user._id}>
                                <WhiteSpace />
                                <Card onClick={() => this.props.history.replace(`/chat/${user._id}`)}>
                                    <Header
                                        extra={<span>{user.username}</span>}
                                        thumb={<img src={require(`../assets/images/${user.header}.png`)} alt='header' />}
                                    />
                                    <Body>
                                        {user.company ? <div>公司:<span>{user.company}</span></div> : null}
                                        <div>职位:<span>{user.job}</span></div>
                                        <div>描述:<span>{user.info}</span></div>
                                        {user.salary ? <div>薪资:<span>{user.salary}</span></div> : null}
                                    </Body>
                                </Card>
                            </div>
                        ))
                    }
                </QueueAnim>

            </WingBlank>)
    }
}

export default withRouter(UserList);