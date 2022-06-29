// 文章数据请求方法定义
import request from '@/utils/request'

export const getArticles = params => {
  return request({
    url: '/v1_0/articles',
    method: 'GET',
    params
  })
}

export const getArticleById = articleId => {
  return request({
    url: `/v1_0/articles/${articleId}`,
    method: 'GET'
  })
}

// 收藏文章
export const collectArticle = artId => {
  return request({
    url: '/v1_0/article/collections',
    method: 'POST',
    data: {
      target: artId
    }
  })
}
// 取消收藏文章
export const uncollectArticle = articleId => {
  return request({
    url: `/v1_0/article/collections/${articleId}`,
    method: 'DELETE'
  })
}

// 点赞文章
export const likeArticle = target => {
  return request({
    url: '/v1_0/article/likings',
    method: 'POST',
    data: {
      target
    }
  })
}

// 取消点赞文章
export const unlikeArticle = articleId => {
  return request({
    url: `/v1_0/article/likings/${articleId}`,
    method: 'DELETE'
  })
}
