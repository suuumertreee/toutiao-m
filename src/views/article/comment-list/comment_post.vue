<template>
  <div class="post-comment">
    <van-field class="post-field"
               v-model="message"
               rows="2"
               autosize
               type="textarea"
               maxlength="50"
               placeholder="优质评论将会被优先展示"
               show-word-limit />
    <van-button type="primary"
                size="small"
                :disabled="message.trim().length === 0"
                @click="onPostComment">发布</van-button>
    <!-- 对于去除 文本框的前后空格，可以对message.trim()，
                也可以 v-modle.trim="message" 双向去除两端空格（推荐此种方式）-->
  </div>
</template>

<script>
import { addComment } from '@/api/comment'

export default {
  name: 'CommentPost',
  components: {},
  inject: {
    articleId: {
      type: [Number, String, Object],
      default: null
      //   required: true 非必须项
      // }
    }
  },
  props: {
    targetId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data () {
    return {
      message: ''
    }
  },
  computed: {},
  watch: {},
  created () { },
  mounted () { },
  methods: {
    async onPostComment () {
      this.$toast.loading({
        message: '发布中...',
        duration: 0,
        borbidClick: true
      })
      try {
        const { data } = await addComment({
          target: this.targetId.toString(), // 评论对象的id(文章的id 或 评论的id)
          content: this.message, // 评论的内容
          art_id: this.articleId ? this.articleId.toString() : this.articleId
          // 对于 文章评论，不需要传art_id。因此需要判断有没有传递实际值，null.toString()会报错
        })
        // console.log(data.data)
        // 将评论内容发布到评论区顶部

        // 清空 filed 区域内容
        this.message = ''
        // 隐匿弹出层
        this.$emit('post-success', data.data)
        this.$toast.success('发布成功')
      } catch (err) {
        this.$toast.success('发布失败')
      }
    }
  }
}

</script>

<style scoped lang="less">
.post-comment {
  display: flex;
  padding: 15px;
  align-items: flex-end;
  .post-field {
    background: #f5f7f9;
    margin-right: 15px;
  }
}
</style>
