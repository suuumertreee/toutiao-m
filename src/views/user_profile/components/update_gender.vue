<template>
  <div class="update_gender">
    <van-picker title="标题"
                show-toolbar
                :columns="columns"
                :default-index="value"
                @confirm="onConfirm"
                @cancel="$emit('update', false)"
                @change="onChange" />
  </div>
</template>

<script>
import { setUserProfile } from '@/api/user'

export default {
  name: 'UpdateGender',
  components: {},
  props: {
    value: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      columns: ['男', '女'],
      genderNum: this.value
    }
  },
  computed: {},
  created () { },
  methods: {
    async onConfirm () {
      try {
        const { data } = await setUserProfile({
          gender: this.genderNum.toString()
        })
        console.log(data)
        this.$emit('update')
        this.$emit('input', this.genderNum)
        this.$toast.success('更新成功')
      } catch (err) {
        // console.log(err)
        this.$toast.fail('更新失败')
      }
    },
    // 通过 change 事件来得到picker选择器所选中的值
    onChange (picker, value, index) {
      // console.log(picker, value, index)
      this.genderNum = index
    }
  },
  mounted () { },
  watch: {}
}
</script>
<style lang="less" scoped>
</style>
