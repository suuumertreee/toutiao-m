<template>
  <div class="article-list">
    <!-- {{channel.name}} -->
    <van-pull-refresh v-model="isRefreshLoading"
                      :success-text="refreshSuccessText"
                      success-duration="2500"
                      @refresh="onRefresh">
      <van-list v-model="loading"
                :finished="finished"
                finished-text="没有更多了"
                :error.sync="error"
                error-text="数据加载失败，可点击重新加载"
                @load="onLoad">
        <ArticleItem v-for="(article, index) in list"
                     :key="index"
                     :article="article"
                     @back="$emit('back', channel.id)" />
        <!-- <van-cell v-for="(article, index) in list"
                  :key="index"
                  :title="article.title" /> -->
      </van-list>
    </van-pull-refresh>

  </div>
</template>

<script>
import { getArticles } from '@/api/articles'
import ArticleItem from '@/components/article-item'

export default {
  name: 'ArticleList',
  components: {
    ArticleItem
  },
  props: {
    channel: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      timestamp: null,
      error: false,
      isRefreshLoading: false,
      refreshSuccessText: '刷新成功'
    }
  },
  watch: {},
  computed: {},
  methods: {
    async onLoad () {
      // console.log(this.channel)
      // 异步更新数据
      try {
        const { data } = await getArticles(
          {
            channel_id: this.channel.id,
            timestamp: this.timestamp || Date.now(),
            with_top: 1
          }
        )
        const { results } = data.data
        this.list.push(...results)
        this.loading = false
        if (results.length) {
          this.timestamp = data.data.pre_timestamp
        } else {
          this.finished = true
        }
        // console.log(results)
      } catch (err) {
        // console.log(err)
        this.loading = false
        this.error = true
      }
    },
    async onRefresh () {
      try {
        const data = await getArticles(
          {
            channel_id: this.channel.id,
            timestamp: Date.now(),
            with_top: 1
          }
        )
        const { results } = data.data
        this.list.unshift(...results)
        // 关闭下拉刷新的 loading 状态
        this.isRefreshLoading = false
        this.refreshSuccessText = `刷新成功，共更新${results.length}条数据`
      } catch (err) {
        this.isRefreshLoading = false
        this.refreshSuccessText = '刷新失败'
      }
    }
  },
  created () { },
  mounted () { }
}
</script>
<style lang="less" scoped>
.article-list {
  height: 79vh;
  overflow-y: auto;
}
</style>
