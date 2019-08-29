/*
    ajax请求函数模块
    返回值：promise对象
*/

import axios from 'axios'

export default function ajax (url, data = {}, type = 'GET') {
  return new Promise((resolve, reject) => {
    let promise = null
    if (type === 'GET') {
      let params = ''
      // 将参数拼接为query风格
      Object.keys(data).forEach((key) => {
        params += `${key}=${data[key]}&`
      })
      // 去除拼接query参数最后的‘&’符号
      if (params !== '') {
        params = params.substring(0, params.lastIndexOf('&'))
        url = url + '?' + params
      }
      // 发送get请求
      promise = axios.get(url)
    } else {
      // 发送post请求
      promise = axios.post(url, data)
    }
    promise.then((response) => {
      resolve(response.data)
    }).catch((error) => {
      reject(error)
    })
  })
}
