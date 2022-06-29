<template>
  <div class="search-result">
    <van-list v-model="loading"
              :finished="finished"
              finished-text="没有更多了"
              :error.sync="error"
              error-text="请求失败，点击重新加载"
              @load="onLoad">
      <van-cell v-for="(article, idx) in list"
                :key="idx">
        <div slot="title"
             v-html="hightlight(article.title, search_text)"></div>
      </van-cell>
    </van-list>
  </div>
</template>

<script>
import { getSearchResult } from '@/api/search'

export default {
  name: 'SearchResult',
  components: {},
  props: {
    search_text: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      error: false,
      page: 1,
      perpage: 20
    }
  },
  watch: {},
  computed: {},
  methods: {
    async onLoad () {
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      try {
        const { data } = await getSearchResult({
          page: this.page,
          per_page: this.perpage,
          q: this.search_text
        })
        const { results } = data.data
        this.list.push(...results)
        // console.log(results)
        this.loading = false
        if (results.length) {
          this.page++
        } else {
          this.finished = true
        }
      } catch (err) {
        console.log('数据请求失败')
        this.loading = false
        this.error = true
      }
    },
    hightlight (str, keywords) {
      const req = new RegExp(keywords, 'gi')
      const html = `<span style='color: #2992ff'>${keywords}</span>`
      return str.replace(req, html)
    }
  },
  created () { },
  mounted () { }
}
</script>
<style lang="less" scoped>
.search-result {
  height: 92vh;
  overflow-y: auto;
}
</style>
