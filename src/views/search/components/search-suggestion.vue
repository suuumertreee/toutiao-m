<template>
  <div class="search-suggestion">
    <van-cell v-for="(val, idx) in suggestions"
              :key=idx
              icon="search"
              @click="$emit('search', val)">
      <div slot="title"
           v-html="highlight(val, search_text)"></div>
    </van-cell>
  </div>
</template>

<script>
import { getSearchSuggestion } from '../../../api/search'

import { debounce } from 'lodash'

export default {
  name: 'SearchSuggestion',
  components: {},
  props: {
    search_text: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      suggestions: [] // 联想建议
    }
  },
  watch: {
    search_text: {
      handler: debounce(function (newVal) {
        this.loadSearchSuggestions(newVal)
      }, 200),
      // handler (newVal) {
      //   this.loadSearchSuggestions(newVal)
      // },
      immediate: true
    }
  },
  computed: {},
  methods: {
    async loadSearchSuggestions (val) {
      try {
        const { data } = await getSearchSuggestion(val)
        this.suggestions = data.data.options
      } catch (err) {
        console.log('请求出错，稍后重试')
      }
    },
    highlight (source, keywords) {
      if (this.suggestions.length !== 0) {
        const reg = new RegExp(keywords, 'gi')
        return source.replace(reg, `<span class="highlight">${keywords}</span>`)
      }
    }
  },
  created () { },
  mounted () { }
}
</script>
<style lang="less" scoped>
.search-suggestion {
  /deep/.highlight {
    color: #3296fa;
  }
  // .highlight {
  //   color: #3296fa;
  // }
}
</style>
