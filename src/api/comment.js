//
import request from '@/utils/request'

// 获取文章评论
export const getComments = params => {
  return request({
    url: '/v1_0/comments',
    method: 'GET',
    params
  })
}

// 对文章评论/回复 点赞
export const likeComment = target => {
  return request({
    url: '/v1_0/comment/likings',
    method: 'POST',
    data: { target }
  })
}

// 取消对文章评论/回复 点赞
export const unlikeComment = target => {
  return request({
    url: `/v1_0/comment/likings/${target}`,
    method: 'DELETE'
  })
}

// 对文章/评论给 进行回复
export const addComment = data => {
  return request({
    url: '/v1_0/comments',
    method: 'POST',
    data
  })
}
