<template>
  <div class="channel-edit">
    <van-cell :border="false">
      <div slot="title"
           class="title-text">我的频道</div>
      <van-button class="edit-btn"
                  type="danger"
                  plain
                  round
                  size="mini"
                  @click="isEdit = !isEdit">{{isEdit ? "完成": "编辑"}}</van-button>
    </van-cell>
    <van-grid class="my-grid"
              :column-num="4"
              :gutter="10">
      <van-grid-item class="grid-item"
                     v-for="(item, idx) in my_channels"
                     :key="idx"
                     @click="onMyChannelClick(item, idx)">
        <van-icon v-show="isEdit && !fixedChannels.includes(item.id)"
                  slot="icon"
                  name="close"></van-icon>
        <span class="text"
              :class="{height: idx === active}"
              slot="text">{{item.name}}</span>
      </van-grid-item>
    </van-grid>
    <van-cell :border="false">
      <div slot="title"
           class="title-text">频道推荐</div>

    </van-cell>
    <van-grid class="recommend-grid"
              :column-num="4"
              :gutter="10">
      <van-grid-item class="grid-item"
                     v-for="(channel, idx) in recommendChannels"
                     :key="idx"
                     icon="plus"
                     :text="channel.name"
                     @click="onAddChannel(channel)" />
    </van-grid>
  </div>
</template>

<script>
import { getAllChannels, addUserChannel, deletUserChannel } from '@/api/channel'
import { mapState } from 'vuex'
import { setItem } from '@/utils/storage'

export default {
  name: 'ChannelEdit',
  components: {},
  props: {
    my_channels: {
      type: Array,
      required: true
    },
    active: {
      required: true,
      type: Number
    }
  },
  data () {
    return {
      allChannels: [],
      isEdit: false, // 控制“我的频道”是否可编辑
      fixedChannels: [0] // 固定频道，不允许删除
    }
  },
  watch: {},
  computed: {
    recommendChannels () {
      // 将返回的新数组赋值给计算属性
      return this.allChannels.filter(item => {
        return !this.my_channels.find(myitem => {
          return myitem.id === item.id
        })
      })
    },
    ...mapState(['user'])
  },

  methods: {
    async loadAllChannels () {
      try {
        const { data } = await getAllChannels()
        console.log(data)
        this.allChannels = data.data.channels
      } catch (err) {
        this.$toast('数据获取失败')
      }
    },
    async onAddChannel (channel) {
      // console.log(val)
      this.my_channels.push(channel)
      // 已登录
      if (this.user) {
        try {
          await addUserChannel({
            id: channel.id,
            seq: this.my_channels.length
          })
        } catch (err) {
          console.log(err)
          this.$toast('保存失败，请稍后重试')
        }
      } else {
        // 未登录
        setItem('localChannels', this.my_channels)
      }
    },

    async onMyChannelClick (channel, idx) {
      if (!this.fixedChannels.includes(channel.id)) {
        // 如果是编辑状态 -- 删除
        if (this.isEdit) {
          this.my_channels.splice(idx, 1)
          // 已登录
          if (this.user) {
            try {
              await deletUserChannel(channel.id)
            } catch (err) {
              this.$toast('保存失败，请稍后重试')
            }
          } else {
            // 未登录
            setItem('localChannels', this.my_channels)
          }
          if (this.active >= idx) {
            this.$emit('update-active', this.active - 1, true)
          }
        } else {
          // 非编辑状态 -- 选择
          this.$emit('update-active', idx, false)
        }
      }
    }
  },
  created () {
    this.loadAllChannels()
  },
  mounted () { }
}
</script>
<style lang="less" scoped>
.channel-edit {
  padding: 85px 0;
  .title-text {
    font-size: 32px;
    color: #333;
  }
  .edit-btn {
    width: 104px;
    height: 48px;
    font-size: 26px;
    color: #f85959;
    border: 2px solid #f85959;
  }
  /deep/.my-grid {
    .grid-item {
      width: 160px;
      height: 86px;
      .van-grid-item__content {
        background-color: #f4f5f6;
        .van-grid-item__icon-wrapper {
          font-size: 14px;
          position: absolute;
          right: -12px;
          top: -16px;
        }
        .van-grid-item__text,
        .text {
          font-size: 28px;
          color: #222;
          margin-top: unset;
        }
        .height {
          color: #f85959;
        }
      }
    }
  }
  /deep/ .recommend-grid {
    .grid-item {
      .van-grid-item__content {
        background-color: #f4f5f6;
        flex-direction: row;
        white-space: nowrap;
        .van-grid-item__icon {
          font-size: 28px;
          margin-right: 6px;
        }
        .van-grid-item__text {
          margin-top: unset;
        }
      }
    }
  }
}
</style>
