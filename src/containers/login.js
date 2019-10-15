import React, { Component } from 'react';
import {
    Button,
    List,
    InputItem,
    WingBlank,
    WhiteSpace,
    NavBar
} from 'antd-mobile'
import Logo from '../components/logo/logo'
import { connect } from 'react-redux'
import { login } from '../redux/actionCreators'
import { Redirect } from 'react-router-dom'
class Login extends Component {
    state = {
        username: '',
        password: ''
    }
    render() {
        const { msg, redirectTo } = this.props.user
        if (redirectTo) {
            return <Redirect to={redirectTo} />
        }
        return (
            <div>
                <NavBar>招&nbsp;聘&nbsp;平&nbsp;台&nbsp;登&nbsp;录</NavBar>
                <Logo />
                <WingBlank>
                    <List>
                        {msg ? <div className='error-msg'>{msg}</div> : null}
                        <WhiteSpace size='xl' />
                        <InputItem
                            placeholder="请输入您的用户名"
                            onChange={val => this.handleChange('username', val)}
                        >用户名:</InputItem>
                        <WhiteSpace size='xl' />
                        <InputItem
                            type='password'
                            placeholder="请输入您的密码"
                            onChange={val => this.handleChange('password', val)}
                        >密&nbsp;&nbsp;&nbsp;码:</InputItem>
                        <WhiteSpace size='xl' />
                        <Button
                            type='primary'
                            onClick={this.login}
                        >登陆</Button>
                        <WhiteSpace size='xl' />
                        <Button
                            onClick={this.toRegister}
                            type='ghost'>没有账号？请您注册</Button>
                    </List>
                </WingBlank>
            </div>
        );
    }
    handleChange = (name, val) => {
        this.setState({
            [name]: val
        })
    }
    login = () => {
        // console.log(this.state)
        this.props.login(this.state)
    }
    toRegister = () => {
        this.props.history.push('/register')
    }
}

export default connect(state => ({ user: state.user }), { login })(Login);