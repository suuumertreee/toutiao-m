<template>
  <div class="update_birth">
    <van-datetime-picker v-model="currentDate"
                         type="date"
                         title="选择年月日"
                         :min-date="minDate"
                         :max-date="maxDate"
                         @cancel="$emit('update')"
                         @confirm="onConfirm" />
  </div>
</template>

<script>
import { setUserProfile } from '@/api/user'
import dayjs from 'dayjs'

export default {
  name: 'UpdateBirth',
  components: {},
  props: {
    value: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      // picker 时间选择器组件的以下3个 props 参数，都是接收的时间对象，
      // 1月 ~ 12月 的数字索引是 0 ~ 11
      minDate: new Date(1970, 0, 1), // 对应2000年1月1日的时间对象
      maxDate: new Date(),
      // new Date(字符串 时间格式) 自动转换为 对应的时间对象
      currentDate: new Date(this.value) // 将已经存在的日期作为默认的当前日期
      // currentDate: new Date()
    }
  },
  computed: {},
  created () { },
  methods: {
    async onConfirm () {
      const curDate = dayjs(this.currentDate).format('YYYY-MM-DD')
      try {
        await setUserProfile({
          // 由于currentDate 是日期对象，toString（）无法直接转换为对应的字符串，
          // 而请求参数需要 String 类型，此处使用第三方包 dayjs 辅助进行转换
          birthday: curDate // 转换为时间格式
        })
        this.$emit('update') // 关闭popup
        // 由于 user.birthday 属性是字符串，不能直接将 currentDate 传过去，而是需要传
        // 已经转换为字符串的 日期
        this.$emit('input', curDate)
        this.$toast.success('更新成功')
      } catch (err) {
        console.log(err)
        this.$toast.fail('更新失败')
      }
    }
    // onChange (picker) {
    //   console.log(picker)
    // }
  },
  mounted () { },
  watch: {}
}
</script>
<style lang="less" scoped>
@media screen and (min-width: 200px) and (max-width: 1600px) {
}
@media screen and (min-width: 1601px) {
}
</style>
