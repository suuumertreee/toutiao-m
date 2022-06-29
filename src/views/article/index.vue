<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar"
                 left-arrow
                 title="黑马头条"
                 @click-left="$router.back()"></van-nav-bar>
    <!-- /导航栏 -->

    <div class="main-wrap">
      <!-- 加载中 -->
      <div v-if="loading"
           class="loading-wrap">
        <van-loading color="#3296fa"
                     vertical>加载中</van-loading>
      </div>
      <!-- /加载中 -->

      <!-- 加载完成-文章内容详情 -->
      <div class="article-detail markdown-body"
           v-else-if="article.title"
           ref="article-content">
        <!-- 文章标题 -->
        <h1 class="article-title">{{article.title}}</h1>
        <!-- /文章标题 -->

        <!-- 用户信息 -->
        <van-cell class="user-info"
                  center
                  :border="false">
          <van-image class="avatar"
                     slot="icon"
                     round
                     fit="cover"
                     :src="article.aut_photo" />
          <div slot="title"
               class="user-name">{{article.aut_name}}</div>
          <div slot="label"
               class="publish-date">{{article.pubdate | relativeTime}}</div>

          <UserFollow :aut_id="article.aut_id"
                      v-model="this.article.is_followed" />
          <!-- <van-button class="follow-btn"
                      v-if="article.is_followed"
                      round
                      size="small"
                      :loading="followLoading"
                      @click="onFollow(article.aut_id)">已关注</van-button>
          <van-button class="follow-btn"
                      v-else
                      type="info"
                      color="#3296fa"
                      round
                      size="small"
                      icon="plus"
                      :loading="followLoading"
                      @click="onFollow(article.aut_id)">关注</van-button> -->

        </van-cell>
        <!-- /用户信息 -->

        <!-- 文章内容 -->
        <div class="article-content"
             v-html="article.content"></div>
        <van-divider>正文结束</van-divider>
        <!-- 评论区域 -->
        <CommentList :sourceId="article.art_id"
                     :list="commentList"
                     @countComments="totalComments = $event.total_count"
                     @reply-click="onReplyShow" />
        <!-- 底部区域 -->
        <div class="article-bottom">
          <van-button class="comment-btn"
                      type="default"
                      round
                      size="small"
                      @click="isPopupShow = true">写评论</van-button>
          <van-icon name="comment-o"
                    :badge="totalComments"
                    color="#777" />
          <CollectArticle v-model="article.is_collected"
                          :articleId="article.art_id" />
          <!-- <van-icon color="#777"
                name="star-o" /> -->
          <LikeArticle :articleId="article.art_id"
                       v-model="article.attitude" />
          <!-- <van-icon color="#777"
                    name="good-job-o" /> -->
          <van-icon name="share"
                    color="#777777"></van-icon>
        </div>
        <!-- /底部区域 -->
        <!-- 发布评论弹出层 -->
        <van-popup v-model="isPopupShow"
                   position="bottom">
          <CommentPost @post-success="onPostSuccess"
                       :targetId="article.art_id" />
        </van-popup>
      </div>

      <!-- /加载完成-文章详情 -->

      <!-- 加载失败：404 -->
      <div v-else-if="errorStatus === 404"
           class="error-wrap">
        <van-icon name="failure" />
        <p class="text">该资源不存在或已删除！</p>
      </div>
      <!-- /加载失败：404 -->

      <!-- 加载失败：其它未知错误（例如网络原因或服务端异常） -->
      <div v-else
           class="error-wrap">
        <van-icon name="failure" />
        <p class="text">内容加载失败！</p>
        <van-button class="retry-btn"
                    @click="loadArticle">点击重试</van-button>
      </div>
      <!-- /加载失败：其它未知错误（例如网络原因或服务端异常） -->
    </div>
    <!-- 由于文章主要内容 .main-wrap 设置里padding-top，
    此二级评论 popup 将放置在整个页面上层，因此不放置在任意的子节点，而放置在根节点上 -->
    <!-- popup 组件时懒加载机制，只有第一次加载时才会更新渲染数据和dom 元素，
      后续的展示和隐藏都不触发数据和其中数据和dom元素的刷新，其展示和隐藏(v-show)不是销毁和创建
       要想其中的内容跟着刷新，只有通过将内容销毁创建来实现--v-if/v-else
       -->
    <van-popup v-model="isReplyShow"
               position="bottom"
               style="height: 100%;">
      <!-- 给组件增加一个条件来决定创建与销毁，从而实现重新创建时获取对应数据 -->
      <CommentReply v-if="isReplyShow"
                    :comment="currentComment"
                    @close-popup="isReplyShow = false" />

    </van-popup>
  </div>

</template>

<script>
import { getArticleById } from '@/api/articles'
import { ImagePreview } from 'vant'
import UserFollow from '../../components/userfollow'
import CollectArticle from '@/components/collect-article'
import LikeArticle from '@/components/like-article'
import CommentList from './comment-list'
import CommentPost from './comment-list/comment_post.vue'
import CommentReply from './comment-list/comment_reply'

// ImagePreview({
//   images: [
//     'https://img01.yzcdn.cn/vant/apple-1.jpg',
//     'https://img01.yzcdn.cn/vant/apple-2.jpg'
//   ],
//   startPosition: 0, // 起始位置为 0
//   closeable: true
// })

export default {
  name: 'ArticleIndex',
  components: {
    UserFollow,
    CollectArticle,
    LikeArticle, //
    CommentList, // 文章评论区域组件
    CommentPost, // 评论弹出层popup中嵌套组件
    CommentReply // 二级回复（评论回复）

  },
  props: {
    articleId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data () {
    return {
      article: {}, // 请求到的文章内容
      loading: true, // 控制加载图标
      errorStatus: 0, // 判断报错类型
      totalComments: 0, // 文章评论总数
      isPopupShow: false, // 文章评论层
      isReplyShow: false, // 评论回复层
      commentList: [], // 用于评论组件
      currentComment: {} // 当前获取到的评论对象
    }
  },
  // 向所有后代组件（包括非直系后代）共享组件(一般为外层父组件)的属性变量
  // 所在后代子组件中，需要通过声明 inject: {xxx: {type: ...}} 或 inject: ['xxx'] 才能接收到
  // 父组件共享出来的 变量属性 xxx,而不用非常麻烦的子组件之间一级一级传递变量
  // 子组件中，inject 的声明方式 与 props 的声明方式相同。
  provide: function () {
    return {
      articleId: this.articleId
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadArticle()
  },
  mounted () { },
  methods: {
    async loadArticle () {
      // 在加载未成功，且点击按钮重新加载时，需要先显示加载图标，加载成功以后再去掉
      this.loading = true
      try {
        // if (Math.random() > 0.2) JSON.parse('dafaddf')
        const { data } = await getArticleById(this.articleId)
        this.article = data.data
        // this.$nextTick(() => {
        //   // 页面更新是异步任务，更新以后给每张图片绑定点击预览事件
        //   console.log('aa')
        //   this.previewImage()
        // })
        setTimeout(() => {
          this.previewImage()
        }, 0)
      } catch (err) {
        // this.$toast('加载失败，请稍后重试')
        console.log(err)
        // console.log('aa')
        if (err.response && err.response === 404) {
          this.errorStatus = 404
        }
      }
      // 无论加载成功还是加载失败，都要将 loading 设置为 false
      this.loading = false
    },
    previewImage () {
      // const img = []
      const mainContent = this.$refs['article-content']
      // const mainContent = this.$refs.article-content
      // console.log(mainContent)
      const imgList = mainContent.querySelectorAll('img')
      const imgsrc = []
      imgList.forEach((item, index) => {
        // 传入图片地址
        imgsrc.push(item.src)
        item.onclick = () => {
          ImagePreview({
            images: imgsrc,
            startPosition: index, // 起始位置为 0
            closeable: true
          })
        }
      })
    },
    // 发布评论成功
    onPostSuccess (commentVal) {
      this.isPopupShow = false
      this.commentList.unshift(commentVal.new_obj)
    },
    // 二级评论回复
    onReplyShow (commentObj) {
      this.currentComment = commentObj
      this.isReplyShow = true
      // console.log(obj)
    }

  }
}
</script>

<style scoped lang="less">
@import './github-markdown.css';
// 引入下载的 css 文件 github-markdown-css 文件
.article-container {
  .main-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 92px;
    bottom: 88px;
    overflow-y: scroll;
    background-color: #fff;
  }
  .article-detail {
    .article-title {
      font-size: 40px;
      padding: 50px 32px;
      margin: 0;
      color: #3a3a3a;
    }

    .user-info {
      padding: 0 32px;
      .avatar {
        width: 70px;
        height: 70px;
        margin-right: 17px;
      }
      .van-cell__label {
        margin-top: 0;
      }
      .user-name {
        font-size: 24px;
        color: #3a3a3a;
      }
      .publish-date {
        font-size: 23px;
        color: #b7b7b7;
      }
      .follow-btn {
        width: 170px;
        height: 58px;
      }
    }

    .article-content {
      padding: 55px 32px;
      /deep/ p {
        text-align: justify;
      }
    }
  }

  .loading-wrap {
    padding: 200px 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  }

  .error-wrap {
    padding: 200px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    .van-icon {
      font-size: 122px;
      color: #b4b4b4;
    }
    .text {
      font-size: 30px;
      color: #666666;
      margin: 33px 0 46px;
    }
    .retry-btn {
      width: 280px;
      height: 70px;
      line-height: 70px;
      border: 1px solid #c3c3c3;
      font-size: 30px;
      color: #666666;
    }
  }

  .article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 88px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .comment-btn {
      width: 282px;
      height: 46px;
      border: 2px solid #eeeeee;
      font-size: 30px;
      line-height: 46px;
      color: #a7a7a7;
    }
    .van-icon {
      font-size: 40px;
      .van-info {
        font-size: 16px;
        background-color: #e22829;
      }
    }
  }
}
</style>
