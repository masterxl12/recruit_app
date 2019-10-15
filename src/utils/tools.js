/*
包含多个个工具函数的模块
*/

/* 
用户主界面路由，两种类型用户,
    boss:   /boss
    employee:/seeker
用户完善信息界面路由:
    boss:   /bossinfo
    employee:/seekerinfo
判断是否完善信息: user.header
判断用户类型:    user.roletype
*/

// 返回对应的路由路径
export function getRedirectTo(roletype, header) {
    let path
    // type
    if (roletype === 'boss') {
        path = '/boss'
    } else {
        path = '/seeker'
    }
    // header
    if (!header) {  // 没有值，返回信息完善界面的path
        path += 'info'
    }
    return path
}