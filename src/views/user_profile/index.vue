<template>
  <div class="user_profile">
    <van-nav-bar class="page-nav-bar"
                 title="个人信息"
                 left-arrow
                 @click-left="$router.back()" />
    <!-- 导航栏 -->

    <!-- input 表单，类型type 设置为 “file”，点击即可上传文件 -->
    <!-- hidden 属性，定义input标签是否可见，作用类似于 display: none -->
    <input type="file"
           hidden
           ref="file"
           @change="onFileChange">
    <van-cell title="头像"
              value="内容"
              is-link
              @click="$refs.file.click()">
      <!-- 通过点击“头像”区域，来触发 file 表单的点击事件 -->
      <van-image class="avator"
                 fit="cover"
                 round
                 :src="user.photo" />
    </van-cell>
    <!-- 头像更改popup -->
    <van-popup v-model="isUpdatePhotoShow"
               position="bottom"
               :style="{ height: '100%' }">
      <Updatephoto v-if="isUpdatePhotoShow"
                   :img="img"
                   @confirmClick="user.photo = $event"
                   @update="isUpdatePhotoShow = false" />
    </van-popup>
    <van-cell title="昵称"
              :value="user.name"
              is-link
              @click="isUpdateNameShow = true" />
    <!-- 昵称更改popup -->
    <van-popup v-model="isUpdateNameShow"
               overlay
               position="bottom"
               :style="{ height: '100%' }">
      <UpdateName v-model="user.name"
                  @update="isUpdateNameShow = false" />
    </van-popup>
    <van-cell title="性别"
              :value="user.gender === 0 ? '男' : '女'"
              is-link
              @click="isUpdateGenderShow = true" />
    <!-- 性别选择 popup -->
    <van-popup v-model="isUpdateGenderShow"
               overlay
               position="bottom">
      <UpdateGender v-model="user.gender"
                    @update="isUpdateGenderShow = false" />
    </van-popup>
    <van-cell title="生日"
              :value="user.birthday"
              is-link
              @click="isUpdateBirthShow = true" />
    <!-- 生日选择 popup -->
    <van-popup v-model="isUpdateBirthShow"
               overlay
               position="bottom">
      <UpdateBirth v-model="user.birthday"
                   @update="isUpdateBirthShow = false" />
    </van-popup>
  </div>
</template>

<script>
import { getUserProfile } from '@/api/user'
import UpdateName from './components/update_name'
import UpdateGender from './components/update_gender.vue'
import UpdateBirth from './components/update_birth.vue'
import Updatephoto from './components/update_photo'

export default {
  name: 'UserProfile',
  components: {
    UpdateName,
    UpdateGender,
    UpdateBirth,
    Updatephoto
  },
  props: {},
  data () {
    return {
      user: {}, // 用于接收用户信息
      isUpdateNameShow: false, // 用户昵称弹出层显示
      isUpdateGenderShow: false, // 性别更改弹出层
      isUpdateBirthShow: false, // 生日
      isUpdatePhotoShow: false, // 头像
      img: null, // 默认值为null,无数据
      birthday: '2000-01-04'

    }
  },
  watch: {},
  computed: {},
  methods: {
    async onLoadUserProfile () {
      try {
        // if (Math.random() > 0.2) JSON.parse('xafadf')
        const { data } = await getUserProfile()
        // console.log(data)
        this.user = data.data
      } catch (err) {
        this.$toast.fail('获取数据失败，请稍后重试')
      }
    },
    // 当赋值给表单的内容与之前的内容相同时，不会触发 change 事件
    // 即 当选择的头像地址与当前已经存在的头像是同一个，不会触发change事件
    // 因此，弹出层将无法打开，解决办法是，每次获取到图片过后将input 原来的值清空
    onFileChange () {
      // 触发 file 类型的input 表单单击事件，并选择图片以后，触发 input 的change 事件
      // 选择的图片存储于 input 对象的 files 数组对象的第一个元素
      const file = this.$refs.file.files[0]
      // 基于文章对象获取 blob 数据，用于获取并设置图片 src 属性
      // 创建图片地址
      this.img = window.URL.createObjectURL(file)
      // console.log(this.img)
      // 获取到文件以后，显示弹出层popup
      this.isUpdatePhotoShow = true
      // 清空input value属性值，以便在选取同一个图片时还能触发change事件，从而打开popup
      this.$refs.file.value = ''
    }
  },
  created () {
    this.onLoadUserProfile()
  },
  mounted () { }
}
</script>
<style lang="less" scoped>
.user_profile {
  .avator {
    height: 60px;
    width: 60px;
  }
  .van-popup {
    background-color: #f5f7f9;
  }
}
</style>
