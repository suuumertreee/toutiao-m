<template>
  <div class="update_name">
    <van-nav-bar title="昵称"
                 left-text="取消"
                 right-text="完成"
                 @click-left="$emit('update', false)"
                 @click-right="onClickRight">
      <!-- <van-button slot="left"
                  round
                  size="small"
                  @click="onCancel">取消</van-button>
      <van-button slot="right"
                  round
                  size="small"
                  @click="onComplete">完成</van-button> -->
    </van-nav-bar>
    <div class="field">
      <van-field v-model.trim="message"
                 rows="2"
                 autosize
                 type="textarea"
                 maxlength="10"
                 placeholder="昵称设置"
                 show-word-limit />
    </div>
  </div>
</template>

<script>
import { setUserProfile } from '@/api/user'

export default {
  name: 'UpdateName',
  components: {},
  props: {
    value: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      // 将从父组件中获取到的用户名称 user.name 作为 message 变量的初始值
      message: this.value
    }
  },
  watch: {},
  computed: {},
  methods: {
    async onClickRight () {
      this.$toast.loading({
        message: '更新中...',
        duration: 0,
        forbidClick: true
      })
      if (this.message.length > 0) {
        try {
          const { data } = await setUserProfile({
            name: this.message.toString()
          })
          console.log(data)
          this.$toast.success('更新成功')
          this.$emit('update')
          this.$emit('input', data.name)
        } catch (err) {
          // console.log(err)
          this.$toast.fail('更新失败')
        }
      } else {
        this.$toast.fail('输入内容不能为空')
      }
    }
  },
  created () { },
  mounted () { }
}
</script>
<style lang="less" scoped>
.update_name {
  .field {
    padding: 20px;
  }
}
</style>
