<template>
  <div class="comment_reply">
    <van-nav-bar class=""
                 :title="`${comment.reply_count}条回复`">
      <van-icon slot="left"
                name="cross"
                @click="$emit('close-popup')" />
    </van-nav-bar>
    <div class="scroll_wrap">
      <CommentItem :comment="comment" />
      <van-cell title="全部回复"></van-cell>
      <CommentList type="c"
                   :sourceId="comment.com_id"
                   :list="commentList"></CommentList>
    </div>
    <!-- 底部评论按钮 -->
    <div class="post_wrap">
      <van-button class="post_btn"
                  size="small"
                  round
                  @click="isPopupShow = true">写评论</van-button>
    </div>
    <!-- 评论书写框 -->
    <van-popup v-model="isPopupShow"
               position="bottom">
      <CommentPost @post-success="onPostSuccess"
                   :targetId="comment.com_id" />
    </van-popup>
  </div>
</template>

<script>
import CommentItem from './comment_item.vue'
import CommentList from './index.vue'
import CommentPost from './comment_post.vue'

export default {
  name: 'CommentReply',
  components: {
    CommentItem,
    CommentList,
    CommentPost
  },
  // inject: {
  //   articleId: {
  //     type: [Number, String, Object],
  //     default: null
  //   }
  // },
  props: {
    comment: { // 每一个文章评论对象
      type: Object,
      required: true
    }
  },
  data () {
    return {
      isPopupShow: false,
      commentList: []
    }
  },
  watch: {},
  computed: {},
  methods: {
    onPostSuccess (val) {
      // 关闭弹出层
      this.isPopupShow = false
      // 计算总回复数
      this.comment.reply_count++
      // 定义空数组，将PostComment子组件返回的数据传进去，并将最终数组传给 子组件CommentList
      // this.commentList.unshift(val.new_obj)
      this.commentList = [val.new_obj]
    }
  },
  created () { },
  mounted () { }
}
</script>
<style lang="less" scoped>
.comment_reply {
  .post_wrap {
    position: fixed;
    bottom: 0;
    right: 0;
    left: 0;
    height: 88px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-top: 1px solid #d8d8d8;
    .post_btn {
      width: 60%;
    }
  }
  .scroll_wrap {
    position: fixed;
    top: 88px;
    left: 0;
    right: 0;
    bottom: 88px;
    overflow-y: auto;
  }
}
</style>
