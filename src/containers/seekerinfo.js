import React, { Component } from 'react';
import { connect } from 'react-redux'
import HeaderSelector from '../components/header_selector/headerSelector'
import { Redirect } from 'react-router-dom'
import { updateUser } from '../redux/actionCreators'
import { NavBar, InputItem, Button, WhiteSpace, TextareaItem } from 'antd-mobile'
class EmployeeInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            header: '',
            job: '',
            info: ''
        }
    }
    handleChange = (name, val) => {
        this.setState({ [name]: val })
    }
    setHeader = (text) =>
        this.setState({
            header: text
        })
    save = () => {
        console.log(this.state)
        this.props.updateUser(this.state)
    }
    render() {
        const { header,roletype} = this.props.user
        if(header){
            const path = roletype === 'employee' ? '/seeker' : '/boss'
            return <Redirect to={path} />
            
        }
        return (
            <div>
                <NavBar>Employee信息完善</NavBar>
                <HeaderSelector setHeader={this.setHeader} />
                <WhiteSpace size="lg" />
                <InputItem
                    placeholder="请描述您的意向岗位"
                    onChange={val => this.handleChange('job', val)}
                >求职岗位:</InputItem>
                <WhiteSpace size="lg" />
                <TextareaItem
                    title='个人介绍:'
                    rows={3}
                    onChange={val => this.handleChange('info', val)}
                />
                <WhiteSpace size="lg" />
                <Button
                    type="primary"
                    onClick={this.save}
                >保&nbsp;&nbsp;&nbsp;存</Button>
            </div>);
    }
}

export default connect(state => ({ user: state.user }), { updateUser })(EmployeeInfo);
// export default EmployeeInfo;
