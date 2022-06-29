<template>
  <div class="login-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar"
                 title="登录">
      <!-- <template #right>
        <van-icon name="cross"
                  size="18" />
      </template> -->
      <van-icon slot="left"
                name="cross"
                @click="$router.back()" />
    </van-nav-bar>

    <!-- 登录验证界面 -->
    <!-- 表单验证：
      0、校验规则：https://vant-contrib.gitee.io/vant/v2/#/zh-CN/form#rule-shu-ju-jie-gou
      1、给van-field 组件配置 rules 验证规则
      2、由于都是配套的 vant 组件，form 组件与field组件搭配使用，内置了如下功能：
          触发表单事件时，表单 van-form 提交事件执行之前，会自动触发 van-field 验证功能；
          若验证通过，会触发 submit 事件；
          验证不通过，不会触发 submit；
    -->
    <van-form ref="loginForm"
              @submit="onSubmit">
      <van-field v-model="user.mobile"
                 name="mobile"
                 placeholder="请输入手机号"
                 :rules="userFormRules.mobile"
                 type="number"
                 maxlength="11">
        <!-- 通过给自定义标签 添加 slot属性，属性值对应 VanField 组件中的某个props 属性，
          即可自定义替代相关的props 属性。以下为自定义 VanField组建的 left-icon 属性
        -->
        <i slot="left-icon"
           class="toutiao toutiao-shouji"></i>
      </van-field>
      <!-- 表单的验证规则可以单独拎出来 -->
      <van-field v-model="user.code"
                 name="code"
                 placeholder="请输入验证码"
                 :rules="userFormRules.code"
                 type="number"
                 maxlength="6">
        <i slot="left-icon"
           class="toutiao toutiao-yanzhengma"></i>
        <template #button>
          <van-count-down v-if="isCountDownShow"
                          :time="60 * 1000"
                          format="ss s"
                          @finish="isCountDownShow = false" />
          <van-button v-else
                      class="send-sms-btn"
                      @click="onSendSms"
                      native-type="button"
                      round
                      size="small"
                      type="default">发送验证码</van-button>
        </template>
      </van-field>
      <div class="login-btn-wrap">
        <van-button class="login-btn"
                    block
                    type="info"
                    native-type="submit">登录</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
// 导入数据请求接口-- 自定义函数 login
import {
  login, sendSms
} from '@/api/user'
export default {
  name: 'LoginIndex',
  components: {},
  props: {},
  data () {
    return {
      user: {
        mobile: '',
        code: ''
      },
      // 定义表单验证规则 -- 用一个 变量对象来接收：
      // 同一个表单对象的多条验证规则，验证顺序是依次从前往后，
      // 前面的验证规则不通过，就不会再执行后面的验证规则了
      // 表单验证规则属性是一个数组，其中的元素是一个对象，每个对象就是一个验证规则，
      // 验证不通过,则通过规则对象的 message 属性设置验证不通过时的提示内容
      userFormRules: {
        mobile: [{
          required: true,
          message: '手机号不能为空'
        }, {
          pattern: /^1[1|3|5|7|8]\d{9}$/,
          message: '手机号格式错误'
        }],
        code: [{
          required: true,
          message: '验证码不能为空'
        }, {
          pattern: /^[\d]{6}$/,
          message: '验证码格式错误'
        }]
      },
      isCountDownShow: false
    }
  },
  watch: {},
  computed: {},
  methods: {
    async onSubmit () {
      const user = this.user
      // console.log(user)
      this.$toast.loading({
        message: '登录中',
        forbidClick: true,
        loadingType: 'spinner',
        duration: 2000,
        position: 'bottom'
      })
      try {
        const { data } = await login(user)
        // 后面提示的 toast操作会将前面展示的任何 toast 提示关闭掉，而不用特别设置将前面的toast 关闭掉。
        this.$store.commit('setUser', data.data)
        // console.log(data)
        this.$toast.success({
          // 对于该方法，多参数设置，则需要使用 js对象 的形式。一个参数，默认为 message 参数值
          message: '登录成功',
          forbidClick: true,
          duration: 2000, // 持续时间默认 2s
          position: 'bottom'
        })
        this.$router.back() // 由于登录成功，vuex state.user已经有数据，返回的页面为已经登录的页面
      } catch (err) {
        console.log(err)
        if (err.response.status === 400) {
          this.$toast.fail('手机号或验证码错误')
          // console.log("手机号格式不正确或验证码错误");
        } else {
          this.$toast.fail('登录失败，请稍后重试')
          // console.log("登陆失败，请稍后重新登录", err);
        }
      }
    },
    async onSendSms () {
      try {
        const a = this.$refs.loginForm.validate('mobile')
        console.log(a)
        // console.log('验证通过')
      } catch (err) {
        // console.log('手机验证不通过', err)
        return
      }
      // 在校验手机号验证规则通过以后，再触发验证码倒计时
      this.isCountDownShow = true
      // 验证码通过以后，后端发送短信验证
      try {
        await sendSms(this.user.mobile)
        // console.log(res)
        this.$toast('验证码发送成功')
        // this.$store.commmit('setUser', data.data)
      } catch (err) {
        // 如果验证码发送失败，则关闭倒计时
        this.isCountDownShow = false
        if (err.response.status === 429) {
          this.$toast('短信发送过于频繁，请稍后再试')
        } else {
          this.$toast('发送失败，请稍后再试')
        }
      }
    }
  },
  created () {
  },
  mounted () { }
}
</script>
<style lang="less" scoped>
.login-container {
  .toutiao {
    font-size: 37px;
  }
  .send-sms-btn {
    width: 162px;
    height: 46px;
    line-height: 46px;
    font-size: 22px;
    color: #666;
    background-color: #ededed;
  }
  .login-btn-wrap {
    padding: 53px 33px;
    .login-btn {
      background-color: #67b0ff;
      border: none;
    }
  }
  .page-nav-bar {
    .cross {
      color: #fff;
    }
  }
}
</style>
