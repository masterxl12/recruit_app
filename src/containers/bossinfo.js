import React, { Component } from 'react';
import { connect } from 'react-redux'
import HeaderSelector from '../components/header_selector/headerSelector'
import { Redirect } from 'react-router-dom'
import {
    Button,
    NavBar,
    InputItem,
    TextareaItem
} from 'antd-mobile'
import { updateUser } from '../redux/actionCreators'
class BossInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            header: '',
            job: '',
            info: '',
            company: '',
            salary: ''
        }
    }
    // 更新header状态
    setHeader = (text) =>
        this.setState({
            header: text
        })
    handleChange = (name, value) => (this.setState({ [name]: value }))
    save = () => {
        this.props.updateUser(this.state)
        // console.log(this.state)
        // console.log(this.props.user)
    }
    render() {
        const { header, roletype } = this.props.user;
        if (header) {
            const path = roletype === 'boss' ? '/boss' : '/seeker'
            return <Redirect to={path} />
        }
        return (
            <div>
                <NavBar>Boss信息完善</NavBar>
                <HeaderSelector setHeader={this.setHeader} />
                <InputItem
                    placeholder='请输入招聘职位'
                    onChange={val => this.handleChange('job', val)}
                >招聘职位:</InputItem>
                <InputItem
                    placeholder='请输入公司名称'
                    onChange={val => this.handleChange('company', val)}
                >公司名称:</InputItem>
                <InputItem
                    placeholder='请输入职位薪资'
                    onChange={val => this.handleChange('salary', val)}
                >职位薪资:</InputItem>
                <TextareaItem
                    title='职位要求:'
                    rows={3}
                    onChange={val => this.handleChange('info', val)}
                />
                <Button type='primary' onClick={this.save} >保&nbsp;&nbsp;&nbsp;存</Button>
            </div>);
    }
}
export default connect(state => ({ user: state.user }), { updateUser })(BossInfo);