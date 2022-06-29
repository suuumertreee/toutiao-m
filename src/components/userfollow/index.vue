<template>
  <van-button class="follow-btn"
              v-if="followed"
              round
              size="small"
              :loading="loading"
              @click="onFollow(aut_id)">已关注</van-button>
  <van-button class="follow-btn"
              v-else
              type="info"
              color="#3296fa"
              round
              size="small"
              icon="plus"
              :loading="loading"
              @click="onFollow(aut_id)">关注</van-button>
</template>

<script>
import { addFollow, deleteFollow } from '@/api/user'

export default {
  name: 'UserFollow',
  components: {},
  model: {
    prop: 'followed',
    event: 'change'
  },
  props: {
    followed: {
      type: Boolean,
      required: true
    },
    aut_id: {
      type: [Number, String, Object],
      required: true
    }
  },
  data () {
    return {
      loading: false
    }
  },
  watch: {},
  computed: {},
  methods: {
    async onFollow (id) {
      this.loading = true
      if (this.followed) {
        try {
          await deleteFollow(id)
          this.$emit('change', !this.followed)
          // this.followed = !this.followed
        } catch (err) {
          this.$toast('操作失败，请重试')
        }
        // this.loading = false
      } else {
        try {
          await addFollow(id)
          this.$emit('change', !this.followed)
          // this.article.is_followed = !this.article.is_followed
        } catch (err) {
          if (err.response && err.response.status === 400) {
            console.log('不能关注自己')
            this.$toast('不能关注自己')
          } else {
            this.$toast('操作失败，请重试')
          }
        }
        // this.loading = false
      }
      this.loading = false
    }
  },
  created () { },
  mounted () { }
}
</script>
<style lang="less" scoped>
@media screen and (min-width: 200px) and (max-width: 1600px) {
}
@media screen and (min-width: 1601px) {
}
</style>
