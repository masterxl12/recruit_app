import React from 'react';
import figure from './logo.png'
import figures from './recruit.jpeg'
import './logo.less'
// 使用无状态组件
const logo = () =>{
    return (
       <div className='logo-container'>
           <img src={figures} alt="logo" className='logo-img' />
       </div>
    )
}
export default logo;