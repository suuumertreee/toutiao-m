<template>
  <div class="my-container">

    <div class="header user-info"
         v-if="user">
      <div class="base-info">
        <div class="left">
          <van-image class="avator"
                     fit="cover"
                     round
                     src="userInfo.photo" />
          <span class="name">{{userInfo.name}}</span>
        </div>
        <div class="right">
          <van-button size="mini"
                      round
                      to="/user/profile">编辑资料</van-button>
        </div>
      </div>
      <div class="data-stats">
        <div class="data-item">
          <span class="count">{{userInfo.art_count}}</span>
          <span class="text">头条</span>
        </div>
        <div class="data-item">
          <span class="count">{{userInfo.follow_count}}</span>
          <span class="text">关注</span>
        </div>
        <div class="data-item">
          <span class="count">{{userInfo.fans_count}}</span>
          <span class="text">粉丝</span>
        </div>
        <div class="data-item">
          <span class="count">{{userInfo.like_count}}</span>
          <span class="text">获赞</span>
        </div>
      </div>
    </div>
    <div class="header not-login"
         v-else>
      <div class="login-btn"
           @click="$router.push('/login')">
        <img class="mobile-img"
             src="~@/assets/mobile.png"
             alt="登录 / 注册">
        <span class="text">登录 / 注册</span>
      </div>
    </div>
    <!-- 导航 -->
    <van-grid :column-num="2"
              class="grid-nav mb-9"
              clickable>
      <van-grid-item class="grid-item">
        <i slot="icon"
           class="toutiao toutiao-shoucang"></i>
        <span slot="text"
              class="text">收藏</span>
      </van-grid-item>
      <van-grid-item class="grid-item">
        <i slot="icon"
           class="toutiao toutiao-lishi"></i>
        <span class="text"
              slot="text">历史</span>
      </van-grid-item>
    </van-grid>
    <van-cell title="消息通知"
              is-link />
    <van-cell class="mb-9"
              title="小智同学"
              is-link />
    <van-cell class="logout-cell"
              title="退出登录"
              v-if="user"
              clickable
              @click="onLogout" />

  </div>
</template>

<script>
import { mapState } from 'vuex'
import {
  getUserInfo
} from '@/api/user'

export default {
  name: 'MyIndex',
  components: {},
  props: {},
  data () {
    return {
      userInfo: {}
    }
  },
  watch: {},
  computed: {
    ...mapState(['user'])
  },
  methods: {
    onLogout () {
      this.$dialog.confirm({
        title: '确认退出登录吗'
        // message: '确认退出登录吗'
      })
        .then(() => {
          // on confirm
          this.$store.commit('setUser', null)
        })
        .catch(() => {
          // on cancel

        })
    },
    async loadUserInfo () {
      try {
        const { data } = await getUserInfo()
        this.userInfo = data.data
        console.log(data.data)
      } catch (err) {
        console.log(err)
        this.$toast('数据获取失败，请稍后重试')
      }
    }
  },
  created () {
    if (this.user) {
      this.loadUserInfo()
    }
  },
  mounted () { }
}
</script>
<style lang="less" scoped>
.my-container {
  .header {
    height: 361px;
    background: url('~@/assets/banner.png');
    background-size: cover;
  }
  .not-login {
    display: flex;
    justify-content: center;
    align-content: center;
    .login-btn {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-content: center;
      .mobile-img {
        width: 132px;
        height: 132px;
        margin-bottom: 15px;
      }
      .text {
        font-size: 28px;
        color: #fff;
      }
    }
  }
  .user-info {
    .base-info {
      padding: 76px 32px 23px;
      height: 231px;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .left {
        display: flex;
        align-items: center;
        .avator {
          height: 132px;
          width: 132px;
          margin-right: 23px;
          border: 3px solid #fff;
        }
        .name {
          font-size: 30px;
          color: #fff;
        }
      }
    }
    .data-stats {
      display: flex;
      .data-item {
        flex: 1;
        height: 130px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: #fff;
        .count {
          font-size: 36px;
        }
        .text {
          font-size: 23px;
        }
      }
    }
  }
  .grid-nav {
    .grid-item {
      height: 141px;
      i.toutiao {
        font-size: 45px;
      }
      .toutiao-shoucang {
        color: #eb5253;
      }
      .toutiao-lishi {
        color: #ff9d1d;
      }
      span.text {
        font-size: 28px;
      }
    }
  }
  .logout-cell {
    text-align: center;
    color: #d86262;
  }
  .mb-9 {
    margin-bottom: 9px;
  }
}
</style>
