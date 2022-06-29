<template>
  <div class="search-history">
    <van-cell title="搜索历史">
      <div v-if="isDeleteShow">
        <span @click="$emit('deleteAllHistories')">全部删除</span>
        &nbsp;&nbsp;
        <span @click="isDeleteShow = !isDeleteShow">完成</span>
      </div>
      <van-icon v-else
                name="delete"
                @click="isDeleteShow = !isDeleteShow" />
    </van-cell>
    <van-cell v-for="(content, idx) in search_histories"
              :key="idx"
              :title="content"
              @click="onSearchClick(content, idx)">
      <van-icon v-show="isDeleteShow"
                name="close" />
    </van-cell>
  </div>
</template>

<script>
export default {
  name: 'SearchHistory',
  components: {},
  props: {
    search_histories: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      isDeleteShow: false
    }
  },
  watch: {},
  computed: {},
  methods: {
    onSearchClick (value, idx) {
      if (this.isDeleteShow) {
        // 点击删除
        this.search_histories.splice(idx, 1)
      } else {
        // 点击搜索
        this.$emit('searchClick', value)
      }
    }
  },
  created () { },
  mounted () { }
}
</script>
<style lang="less" scoped>
@media screen and (min-width: 200px) and (max-width: 1600px) {
}
@media screen and (min-width: 1601px) {
}
</style>
