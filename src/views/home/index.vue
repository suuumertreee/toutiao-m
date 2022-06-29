<template>
  <div class="home-container">
    <van-nav-bar class="page-nav-bar"
                 fixed>
      <van-button class="search-btn"
                  slot="title"
                  size="small"
                  round
                  icon="search"
                  type="info"
                  to="/search">搜索</van-button>
    </van-nav-bar>
    <van-tabs class="channel-tabs"
              v-model="active"
              animated
              swipeable>
      <van-tab v-for="channel in channels"
               :key="channel.id"
               :title="channel.name">
        <ArticleList :channel="channel"
        @back="active = $event" />
      </van-tab>
      <div slot="nav-right"
           class="placeholder"></div>
      <div class="hamburger-btn"
           slot="nav-right"
           @click="isChennelEditShow = true">
        <i class="toutiao toutiao-gengduo"></i>
      </div>
    </van-tabs>
    <van-popup v-model="isChennelEditShow"
               closeable
               position="bottom"
               close-icon-position="top-left"
               :style="{ height: '100%' }">
      <ChannelEdit :my_channels="channels"
                   :active="active"
                   @update-active="onUpdateActive" />
    </van-popup>
  </div>
</template>

<script>
import { getUserChannels } from '../../api/user'
import ArticleList from './components/article-list.vue'
import ChannelEdit from './components/channel-edit.vue'
import { getItem } from '@/utils/storage'
import { mapState } from 'vuex'

export default {
  name: 'HomeIndex',
  components: {
    ArticleList,
    ChannelEdit
  },
  props: {},
  data () {
    return {
      active: 0,
      channels: [],
      isChennelEditShow: false
    }
  },
  watch: {},
  computed: {
    ...mapState(['user'])
  },
  methods: {
    async loadChannels () {
      try {
        let channels = []
        if (this.user) {
          const { data } = await getUserChannels()
          // console.log(data.data.channels)
          channels = data.data.channels
        } else {
          if (getItem('localChannels')) {
            channels = getItem('localChannels')
          } else {
            const { data } = await getUserChannels()
            channels = data.data.channels
          }
        }
        this.channels = channels
      } catch (err) {
        this.$toast('获取数据失败')
      }
    },
    onUpdateActive (val, isShow) {
      this.active = val
      this.isChennelEditShow = isShow
    }

  },
  created () {
    this.loadChannels()
  },
  mounted () { }
}
</script>
<style lang="less" scoped>
.home-container {
  padding-bottom: 100px;
  .van-nav-bar__title {
    max-width: unset;
    .search-btn {
      width: 555px;
      height: 64px;
      background-color: #5babfb;
      border: none;
      font-size: 28px;
      .van-icon {
        font-size: 32px;
      }
    }
  }
  ::v-deep.channel-tabs {
    position: fixed;
    top: 92px;
    left: 0;
    right: 0;

    .van-tabs__nav--line {
      padding-bottom: 0;
      .van-tab {
        font-size: 30px;
        color: #777;
        border-right: 1px solid #edeff3;
        min-width: 200px;
      }
      .van-tab--active {
        color: #333333;
      }
      .van-tabs__line {
        bottom: 8px;
        width: 31px !important;
        height: 6px;
        background-color: #3296fa;
      }
      .hamburger-btn {
        position: fixed;
        right: 0;
        width: 66px;
        height: 82px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #fff;
        opacity: 0.902;
        .toutiao {
          font-size: 33px;
        }
        &:before {
          content: '';
          position: absolute;
          left: 0;
          width: 1px;
          height: 58px;
          background-image: url(~@/assets/gradient-gray-line.png);
          background-size: contain;
        }
      }
      .placeholder {
        // min-width: 66px;
        width: 66px;
        flex-shrink: 0;
      }
    }
  }
}
</style>
