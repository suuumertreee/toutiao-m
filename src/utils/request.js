import axios from 'axios'
import store from '@/store'
import JSONBig from 'json-bigint'

const req = axios.create({
  baseURL: 'http://toutiao.itheima.net',
  // `transformResponse` allows changes to the response data to be made before
  // it is passed to then/catch
  transformResponse: [function (data) {
    // data 为请求返回的数据，此步骤是在 .then/.catch()之前将数据进行处理
    // Do whatever you want to transform the data
    try {
      // console.log(JSONBig.parse(data))
      return JSONBig.parse(data)
    } catch (err) {
      return data
    }
  }]
})
// Add a request interceptor
req.interceptors.request.use(function (config) {
  // Do something before request is sent
  const { user } = store.state
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

export default req
