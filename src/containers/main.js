import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import Employee from './seekerinfo'
import BossInfo from './bossinfo'
import Cookies from 'js-cookie'  // 操作前端cookie的对象
import { getRedirectTo } from '../utils/tools'
import { getUser } from '../redux/actionCreators'
import Boss from './mainChild/boss'
import Seeker from './mainChild/seeker'
import Message from './mainChild/message'
import Personal from './mainChild/personal'
import NotFound from '../components/NotFound'
import NavFooter from '../components/nav_footer/NavFooter'
import { NavBar } from 'antd-mobile'
import Chat from './chat'
class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    // 组件类和组件对象
    // 给组件对象添加属性
    navList = [
        {
            path: '/boss', // 路由路径
            component: Boss,
            title: '雇员列表',
            icon: 'dashen',
            text: '雇员',
        },
        {
            path: '/seeker', // 路由路径
            component: Seeker,
            title: '雇主列表',
            icon: 'laoban',
            text: '雇主',
        },
        {
            path: '/message', // 路由路径
            component: Message,
            title: '消息列表',
            icon: 'message',
            text: '消息',
        },
        {
            path: '/personal', // 路由路径
            component: Personal,
            title: '用户中心',
            icon: 'personal',
            text: '个人',
        }
    ]

    componentDidMount() {
        const userid = Cookies.get('userid')
        const { _id } = this.props.user
        if (userid && !_id) {  // 登录过但此时没有登录，可能cookie过期，或者登录关闭网页再打开
            // 发送异步请求，获取user
            // console.log('发送ajax请求，获取user')
            this.props.getUser()
        }
    }
    render() {
        /**
         * 1.实现自动登录
         *  1.1 componentDidMount()
         *  登录过（cookie中有userid），但没有登录如cookie过期（redux管理的user中没有_id）发请求获取对应的user
         *  1.2 render()
         *      1)  如果cookie中没有userid，直接重定向到login
         *      2)  判断redux中的user是否有_id,如果没有，暂时不做任何处理
         *      3)  如果有_id,说明当前已经登录，显示对应的界面
         *      4)  如果请求根路径，根据user的roletype和header来就算一个重定向的路由路径，并自动重定向 
         * 2.如果user没有_id，返回null（不做任何显示）
         
         **/

        // 读取cookie中的userid
        const userid = Cookies.get('userid');
        // 如果没有userid，自动重定向到登录界面
        // debugger
        if (!userid) {
            return <Redirect to="/login" />
        }
        // 如果有userid，读取redux中的user状态
        const { user,unReadCount } = this.props
        // // user没有_id，返回null（不做任何显示)
        if (!user._id) {
            return null
            // 如果有_id,显示对应的界面
            // 根据user的roletype和header来就算一个重定向的路由路径，并自动重定向 
        } else {
            let path = this.props.location.pathname
            if (path === '/') {
                path = getRedirectTo(user.roletype, user.header)
                return <Redirect to={path} />
            }
        }
        // 得到当前请求的path
        const path = this.props.location.pathname
        const { navList } = this
        const currentNav = navList.find(item => item.path === path)  // 得到当前的nav，可能没有

        // 根据用户类型判断需要隐藏的路由组件，具体通过添加hide属性，然后在子组件中根据属性进行过滤处理
        if (currentNav) {
            // 决定哪个路由需要隐藏
            /*if (user.roletype === "boss") {  // boss路由应该隐藏雇员路由组件===>隐藏数组第二个
                navList[1].hide = true
            } else {                        //  employee应该隐藏老板路由组件==>隐藏数组第一个
                navList[0].hide = true
            }*/
            user.roletype === 'boss' ? navList[1].hide = true : navList[0].hide = true
        }
        return (
            <div>
                {currentNav ? <NavBar className='nav-header'>{currentNav.title}</NavBar> : null}
                <Switch>
                    {navList.map((item, index) => (< Route key={index + item.title} path={item.path} component={item.component} />))}
                    <Route path='/bossinfo' component={BossInfo} />
                    <Route path='/seekerinfo' component={Employee} />
                    <Route path='/chat/:userid' component={Chat} />
                    <Route component={NotFound} />
                </Switch>
                {currentNav ? <NavFooter navList={navList} unReadCount={unReadCount} /> : null}
            </div>
        );
    }
}

export default connect(state => ({ user: state.user,unReadCount:state.chat.unReadCount }), { getUser })(Main);