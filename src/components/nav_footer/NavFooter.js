import React, { Component } from 'react';
import { TabBar } from 'antd-mobile'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

const Item = TabBar.Item
class NavFooter extends Component {
    static propTypes = {
        navList: PropTypes.array.isRequired,
        unReadCount:PropTypes.number.isRequired
    }
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        let { navList,unReadCount } = this.props
        // 过滤掉hide为true的item
        navList = navList.filter(item => !item.hide)  // !item.hide为过滤条件
        const path = this.props.location.pathname
        return (
            <TabBar>
                {navList.map((item, index) => (
                    <Item
                        key={index + item.path}
                        title={item.text}
                        icon={{ uri: require(`./images/${item.icon}.png`) }}
                        selectedIcon={{ uri: require(`./images/${item.icon}-selected.png`) }}
                        selected={path === item.path}
                        onPress={() => this.props.history.replace(item.path)}
                        badge={item.path === '/message' ? unReadCount : 0}
                    />
                ))}
            </TabBar>
        );
    }
}

// 向外暴露withRouter()包装产生的组件
// 内部会向组件中传入一些路由组件特有的属性:history/location/match
export default withRouter(NavFooter);