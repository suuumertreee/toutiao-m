import request from '@/utils/request.js'

export const getAllChannels = () => {
  return request({
    url: '/v1_0/channels',
    method: 'GET'
  })
}

// 增加用户频道（部分覆盖）
export const addUserChannel = (channel) => {
  return request({
    url: '/v1_0/user/channels',
    method: 'PATCH',
    data: {
      channels: [channel]
    }
  })
}

// 删除指定用户频道
export const deleteUserChannel = (channelId) => {
  return request({
    url: `/v1_0/user/channels/${channelId}`,
    method: 'DELETE'
    // headers:{
    //   Content-Type: 'application/x-www-form-urlencoded'
    // }
  })
}
