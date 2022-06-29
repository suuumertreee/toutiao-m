<template>
  <van-icon v-if="collected === false"
            color="#777"
            name="star-o"
            @click="onCollect" />
  <van-icon v-else
            color="#ecc849"
            name="star-o"
            @click="onCollect" />
</template>

<script>
import { uncollectArticle, collectArticle } from '@/api/articles'

export default {
  name: 'CollectArticle',
  components: {},
  model: {
    prop: 'collected',
    event: 'change'
  },
  props: {
    collected: {
      type: Boolean,
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
      if (this.collected) {
        try {
          // 事件的回调函数是异步操作
          await uncollectArticle(this.articleId)
          this.$emit('change', !this.collected)
          this.$toast.success(this.collected ? '取消收藏' : '收藏成功')
        } catch (err) {
          this.$toast.fail('操作失败，请重试')
        }
      } else {
        try {
          await collectArticle(this.articleId)
          this.$emit('change', !this.collected)
          this.$toast.success(this.collected ? '取消收藏' : '收藏成功')
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
