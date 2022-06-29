<template>
  <van-icon v-if="value !== 1"
            color="#777"
            name="good-job-o"
            @click="onCollect" />
  <van-icon v-else
            color="#ecc849"
            name="good-job-o"
            @click="onCollect" />
</template>

<script>
import { unlikeArticle, likeArticle } from '@/api/articles'

export default {
  name: 'LikeArticle',
  components: {},
  // model: {
  //   prop: 'collected',
  //   event: 'change'
  // },
  props: {
    value: {
      type: Number,
      required: true
    },
    articleId: [Number, String, Object]
  },
  data () {
    return {
    }
  },
  watch: {},
  computed: {},
  methods: {
    async onCollect () {
      if (this.value === 1) {
        try {
          // 事件的回调函数是异步操作
          await unlikeArticle(this.articleId)
          this.$emit('input', 0)
          // this.$toast.success(this.value === 1 ? '取消点赞' : '点赞成功')
        } catch (err) {
          this.$toast.fail('操作失败，请重试')
        }
      } else {
        try {
          await likeArticle(this.articleId)
          this.$emit('input', 1)
          // this.$toast.success(this.value === 1 ? '取消点赞' : '点赞成功')
        } catch (err) {
          this.$toast.fail('操作失败，请重试')
        }
      }
    }
  },
  created () {
    // console.log(this.collected)
  },
  mounted () { }
}
</script>
<style lang="less" scoped>
</style>
