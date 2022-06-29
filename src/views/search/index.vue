<template>
  <div class="search-container">
    <!-- 搜过页面 -->
    <form action="/"
          class="search-form">
      <van-search v-model="searchText"
                  show-action
                  placeholder="请输入搜索关键词"
                  background="#3296fa"
                  autofocus
                  @search="onSearch"
                  @cancel="onCancel"
                  @focus="isResultShow = false" />
    </form>
    <SearchResult v-if="isResultShow"
                  :search_text="searchText">
    </SearchResult>

    <SearchSuggestion v-else-if="searchText"
                      :search_text="searchText"
                      @search="onSearch"></SearchSuggestion>

    <search-history v-else
                    :search_histories="searchHistories"
                    @deleteAllHistories="searchHistories = []"
                    @searchClick="onSearch">
    </search-history>

  </div>
</template>

<script>
import SearchSuggestion from './components/search-suggestion.vue'
import SearchHistory from './components/search-history.vue'
import SearchResult from './components/search-result.vue'
import { setItem, getItem } from '@/utils/storage'

export default {
  name: 'SearchIndex',
  components: {
    SearchHistory,
    SearchResult,
    SearchSuggestion
  },
  props: {},
  data () {
    return {
      searchText: '',
      isResultShow: false,
      searchHistories: getItem('searchHistories') || []
    }
  },
  watch: {
    searchHistories: {
      handler (val) {
        setItem('searchHistories', val)
        console.log(val)
      },
      deep: true
    }
  },
  computed: {},
  methods: {
    onSearch (val) {
      // console.log(val)
      this.searchText = val
      // 存储搜索记录
      const index = this.searchHistories.indexOf(val)
      if (index !== -1) {
        this.searchHistories.splice(index, 1)
      }
      this.searchHistories.unshift(val)
      // 渲染搜索结果
      this.isResultShow = true
    },
    onCancel () {
      this.$router.back()
      // console.log('取消')
    }
  },
  created () {
  },
  mounted () { }
}
</script>
<style lang="less" scoped>
.search-container {
  padding-top: 116px;
  .van-search__action {
    color: #fff;
  }
  .search-form {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    z-index: 1;
  }
}
</style>
