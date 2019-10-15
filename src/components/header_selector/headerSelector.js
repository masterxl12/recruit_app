import React, { Component } from 'react';
import { List, Grid } from 'antd-mobile'
import PropTypes from 'prop-types'
class HeaderSelector extends Component {
    constructor(props) {
        super(props);
        this.headerList = [];
        for (let i = 0; i < 20; i++) {
            this.headerList.push({
                text: `头像${i + 1}`,
                icon: require(`../../assets/images/头像${i + 1}.png`)
            })
        }
    }
    static propTypes = {
        setHeader: PropTypes.func.isRequired
    }
    state = {
        icon: null // 图片对象，默认没有值
    }
    handleClick = ({text,icon}) => {//点击每个网格的回调函数，参数(el: Object, index: number)，在此处为{text,icon}
        // 更新当前组件状态
        this.setState({icon})
        // 调用函数更新父组件状态==子组件不能操作父组件数据，所以需要借助一个父组件的方法，来修改父组件的内容
        this.props.setHeader(text)
    }
    render() {
        // 头部界面
        const { icon } = this.state
        const listHeader = !icon ? '请选择头像' : (<div>
            已选择图像:<img src={icon} alt="header" />
        </div>)
        return (
            <List renderHeader={() => listHeader} >
                <Grid
                    onClick={this.handleClick}
                    data={this.headerList}
                    columnNum={5}
                />
            </List>
        );
    }
}

export default HeaderSelector;