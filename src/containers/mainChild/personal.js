import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Button, List, WhiteSpace, Result, Modal } from 'antd-mobile'
import Cookies from 'js-cookie'
import { resetUser  } from '../../redux/actionCreators'
const Item = List.Item
const Brief = Item.Brief
class Personal extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        // console.log(this.props.user)
        const { header, username, company, info, job, salary } = this.props.user
        return (
            <div style={{marginTop: 45,marginBottom: 50}}>
                <Result
                    img={<img
                        src={require(`../../assets/images/${header}.png`)}
                        style={{ width: 50 }} alt="header" />}
                    title={username}
                    message={company}
                />
                <List renderHeader={() => '相关信息'}>
                    <Item multipleLine>
                        <Brief>职位:{job}</Brief>
                        <Brief>简介:{info}</Brief>
                        {salary ? <Brief>薪资:{salary}</Brief> : null}

                    </Item>
                    <WhiteSpace size='lg' />
                </List>
                <List>
                    <Button
                        type='warning'
                        onClick={this.logOut}
                    >退&nbsp;出&nbsp;登&nbsp;录</Button>
                </List>
            </div>);
    }
    logOut = () => {
        // console.log('---------')
        Modal.alert('退出', '确定退出登录吗?', [
            { text: '取消' },
            {
                text: '确认', onPress: () => {
                    // 退出登录  1. 清除cookie中的userid 2. redux管理的user
                    Cookies.remove('userid');
                    this.props.resetUser()
                }
            }
        ])
    }
}

export default connect(state => ({ user: state.user }),{resetUser})(Personal);