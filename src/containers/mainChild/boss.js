import React, { Component } from 'react';
import { getUserList } from '../../redux/actionCreators'
import { connect } from 'react-redux'
import UserList from '../../components/UserList'
class Boss extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    componentDidMount() {
        this.props.getUserList('employee')
    }
    render() {
        // const { userList } = this.props.userList
        return (<UserList userList = {this.props.userList} />);
    }
}

export default connect(state => ({ userList: state.userList }), { getUserList })(Boss);