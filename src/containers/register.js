import React, { Component } from 'react';
import {
    NavBar,
    Button,
    List,
    InputItem,
    WingBlank,
    WhiteSpace,
    Radio
} from 'antd-mobile'
import Logo from '../components/logo/logo'
import { register } from '../redux/actionCreators'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
const ListItem = List.Item
class Register extends Component {
    state = {
        username: '',
        password: '',
        password2: '',
        roletype: 'boss'
    }
    render() {
        const { roletype } = this.state;
        const { msg, redirectTo } = this.props.user;
        // redirectTo如果有值，就需要重定向指定的路由
        if (redirectTo) {
           return <Redirect to={redirectTo} />
        }
        return (
            <div>
                <NavBar>招&nbsp;聘&nbsp;平&nbsp;台</NavBar>
                <Logo />
                <WingBlank>
                    <List>
                        {msg ? <div className="error-msg">{msg}</div> : null}
                        <WhiteSpace />
                        <InputItem
                            placeholder="请输入您的用户名"
                            onChange={val => { this.handle('username', val) }}
                        >用&nbsp;户&nbsp;&nbsp;名:</InputItem>
                        <WhiteSpace size='lg' />
                        <InputItem
                            type="password"
                            placeholder="请输入您的密码"
                            onChange={val => { this.handle('password', val) }}
                        >密&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;码:</InputItem>
                        <WhiteSpace size='lg' />
                        <InputItem
                            type="password"
                            placeholder="请您再次确认密码"
                            onChange={val => { this.handle('password2', val) }}
                        >确认密码:</InputItem>
                        <WhiteSpace size='lg' />
                        <ListItem>
                            <span>雇员/雇主:</span>&nbsp;&nbsp;&nbsp;
                            <Radio
                                checked={roletype === 'employee'}
                                onChange={() => { this.handle('roletype', 'employee') }}
                            >Employee</Radio>&nbsp;&nbsp;&nbsp;
                            <Radio
                                checked={roletype === 'boss'}
                                onChange={() => { this.handle('roletype', 'boss') }}
                            >Boss</Radio>
                        </ListItem>
                        <WhiteSpace />
                        <Button type='primary' onClick={this.register}>注册</Button>
                        <WhiteSpace />
                        <Button
                            type='ghost'
                            onClick={this.toLogin}
                        >已有账户</Button>
                    </List>
                </WingBlank>
            </div>);
    }
    handle(name, val) {
        this.setState({
            [name]: val  //属性名不是name，而是name的值
        })
    }
    register = () => {
        // console.log(this.state)  
        this.props.register(this.state)
    }
    toLogin = () => {
        this.props.history.push('/login')
    }
}

// const mapStateToProps = (state) => {

// }

// const mapDispatchToProps = (dispatch) => {

// }

// 从redux的store中读状态,reducer.js中暴露出的有user，使用state.user读数据
export default connect(state => ({ user: state.user }), { register })(Register);