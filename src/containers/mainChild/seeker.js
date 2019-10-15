import React, { Component } from 'react';
import { connect } from 'react-redux'
import UserList from '../../components/UserList'
import { getUserList } from '../../redux/actionCreators'
class Seeker extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    componentDidMount() {
        this.props.getUserList('boss')
    }
    render() {
        return (<UserList userList={this.props.userList} />);
    }
}

export default connect(state => ({ userList: state.userList }), { getUserList })(Seeker);