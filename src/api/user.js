import request from '@/utils/request'
// import store from '@/store'

export const login = data => {
  return request({
    url: '/v1_0/authorizations',
    method: 'POST',
    data
  })
}
// 手机验证码
export const sendSms = mobile => {
  return request({
    url: `/v1_0/sms/codes/${mobile}`,
    method: 'GET'
  })
}

// 用户信息
export const getUserInfo = () => {
  // console.log(store.state.user)
  return request({
    url: '/v1_0/user',
    method: 'GET'
    // headers: {
    //   // 使用用户 token 信息 才能获取数据，token 过一段时间（如 2h)会过期
    //   Authorization: `Bearer ${store.state.user.token}`
    // }
  })
}

// 用户频道
export const getUserChannels = () => {
  // console.log(store.state.user)
  return request({
    url: '/v1_0/user/channels',
    method: 'GET'

  })
}

// 关注用户
export const addFollow = (id) => {
  return request({
    url: '/v1_0/user/followings',
    method: 'POST',
    data: { target: id }
  })
}

// 取消关注用户
export const deleteFollow = (authId) => {
  return request({
    url: `/v1_0/user/followings/${authId}`,
    method: 'DELETE'

  })
}

// 获取当前登录用户个人资料
export const getUserProfile = () => {
  return request({
    url: '/v1_0/user/profile',
    method: 'GET'

  })
}

// 编辑用户个人资料
export const setUserProfile = data => {
  return request({
    url: '/v1_0/user/profile',
    method: 'PATCH',
    data
  })
}

// 编辑用户头像资料
export const updateUserPhoto = data => {
  return request({
    url: '/v1_0/user/photo',
    method: 'PATCH',
    data
  })
}
