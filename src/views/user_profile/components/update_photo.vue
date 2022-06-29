<template>
  <div class="update_photo">
    <img class="img"
         src="img"
         ref="img">
    <div class="toolbar">
      <div class="cancel"
           @click="$emit('update')">取消</div>
      <div class="confirm"
           @click="onConfirm">完成</div>
    </div>
  </div>
</template>

<script>
import 'cropperjs/dist/cropper.css' // 加载 css 脚本
import Cropper from 'cropperjs'
import { updateUserPhoto } from '@/api/user'

export default {
  name: 'UpdatePhoto',
  components: {},
  props: {
    img: {
      type: [String, Object],
      required: true
    }
  },
  data () {
    return {
      cropper: {
        type: String,
        default: null
      }
    }
  },
  computed: {},
  created () {
  },
  methods: {
    onConfirm () {
      this.$toast.loading({
        message: '更新中...',
        duration: 0,
        forbidClick: true
      })
      this.cropper.getCroppedCanvas().toBlob((blob) => {
        // console.log(blob)
        // 由于接口要求的传参格式为 multipart/form-data 对象，以下为普通的 js 对象，
        // 为错误传参方式：
        //   updateUserPhoto({
        //     photo: blob
        //     })
        // })
        this.updateUserPhoto(blob)
        // // 先构造出一个 formdata 对象，单独封装成组件
        // const formData = new FormData()
        // formData.append('photo', blob)
        // // 注意 async 修饰符的位置，实在 await 所在的直接函数前面
        // const { data } = await updateUserPhoto(formData)
        // // 关闭弹出层，更新视图
        // this.$emit('update')
        // this.$emit('confirmClick', data.data.photo)
      })
    },
    async updateUserPhoto (blob) {
      try {
        // 先构造出一个 formdata 对象
        const formData = new FormData()
        formData.append('photo', blob)
        // 注意 async 修饰符的位置，实在 await 所在的直接函数前面
        const { data } = await updateUserPhoto(formData)
        // 关闭弹出层，更新视图
        this.$emit('update')
        this.$emit('confirmClick', data.data.photo)
        this.$toast.success('更新成功')
      } catch (err) {
        this.$toast.fail('更新失败')
      }
    }
  },
  mounted () {
    const image = this.$refs.img
    // 生成 cropper  实例对象
    this.cropper = new Cropper(image, {
      // cropper 使用说明文档：https://github.com/fengyuanchen/cropperjs
      // aspectRatio: 16 / 9,
      viewMode: 1,
      dragMode: 'move',
      aspectRatio: 1,
      autoCropArea: 1,
      cropBoxMovable: false,
      cropBoxResizable: false,
      background: false,
      movable: true
    })
    // 裁剪图片的保存更新：
    // 1、(将参数传给后端进行处理，常用于 PC 端处理图片的方式)如果是基于服务端的裁切，
    //    则使用：getData 方法，该方法得到裁切的区域参数。
    // 2、(前端处理，不同PC端浏览器有兼容性问题；移动端无兼容性问题)如果是纯客户端的图片裁切，
    //    则使用：getCroppedCanvas 方法，
    //    该方法得到裁切之后的图片对象（类似于URL.createObjectURL 方法得到的文件对象）。
  },
  watch: {}
}
</script>
<style lang="less" scoped>
.update_photo {
  // position: relative; 子元素固定定位是相对于可视窗口，父元素不必设置relative/absolute
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  .img {
    // 最大宽度设置100%, 防止图片过大溢出屏幕范围
    max-width: 100%;
    display: block;
  }
  .toolbar {
    position: fixed;
    bottom: 20px;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    padding: 0 50px;
    .cancel,
    .confirm {
      width: 110px;
      height: 80px;
      font-size: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
    }
  }
}
</style>
