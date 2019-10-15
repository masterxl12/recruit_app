import axios from 'axios'
const ajax = (url, data = {}, type = "GET") => {
    if (type === "GET") {
        // {username:'abc',password:'123'}
        // url?username=abc&password=123
        let paramStr = '';
        Object.keys(data).forEach((key) => {
            paramStr += key + "=" + data[key] + "&"
        })
        if (paramStr) {
            paramStr = paramStr.substring(0, paramStr.length - 1)
        }
        // 拼接包含请求参数的字符串
        return axios.get(url + "?" + paramStr)
    } else {
        return axios.post(url, data)
    }
}
export default ajax