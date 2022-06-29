<template>
  <van-list v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            :error.sync="error"
            error-text="请求失败，点击重新加载"
            :immediate-check="false"
            @load="onLoad">
    <div v-if="list.length !== 0">
      <van-cell v-for="(item, idx) in list"
                :key="idx"
                :title="item.content">
        <CommentItem :comment="item"
                     @reply-click="$emit('reply-click', $event)" />
      </van-cell>
    </div>

  </van-list>
</template>

<script>
import { getComments } from '@/api/comment'
import CommentItem from './comment_item'

export default {
  name: 'CommentList',
  components: {
    CommentItem
  },
  props: {
    sourceId: { // 文章的id 或者 评论的id
      type: [Number, String, Object],
      require: true
    },
    list: {
      type: Array,
      // 数组 或者 js 对象 默认值的设置，需要通过函数来定义，不能直接赋值
      default: () => []
    },
    type: { // 是请求 a 文章的评论数据 还是 c 评论的回复数据
      type: String,
      default: 'a', // 当父组件不传数据时，type的默认值为 'a'
      validator (val) { // 自定义校验规则，防止输入 a, c 之外的其他type值而请求失败
        return ['a', 'c'].includes(val)
      }
    }
  },
  data () {
    return {
      // list: [],
      loading: false, // 表示 list组件 是否处于加载状态
      finished: false, // 是否已数据已全部加载完成，true 则禁用load 事件
      error: false, // 加载失败，设置为 true 即可将 error-text 内容显示出来
      limit: 10, // 设置每次加载获取的评论数
      offset: null

    }
  },
  watch: {},
  computed: {},
  methods: {
    async onLoad () {
      // 异步更新数据
      // console.log('articleId', this.articleId)
      try {
        const { data } = await getComments(
          // 一下对象 即 api方法调用axios 请求时，get 方法的 params 参数对象
          // 此处的source 为Number类型，当axios 发送请求时，会预处理将 params 中的键值对
          // 以 ?key=value&key=value 的格式拼接到url中去, 对于数值类型的 value, 会自动转换为 String类型
          // 对于String 类型的数据不会进行预处理。
          // 当 number 类型的value 值大小，在javascript的处理范围之内，则不会出现格式转换问题
          // 由于 在axios 配置文件中使用量第三方包 json-bigint ，对于获取到的数据进行与处理了(jsonbigint.parse)，
          // 因此对于其中超出json.parse()--(axios获取数据后的默认处理方式）, 也能够精确地获取到真实数据，
          // 但是这些获取到的超大值精确数据被用作另外 axios 的请求参数时，
          // 如当 key=value 中 value 超出 javascript 处理范围时，如下面的 source 参数 中，id可能出现这种情况,就会出现
          // 在url 上拼接 key=value键值对时，给value值带上引号，导致最终的请求参数不正确而无法获取数据
          // 因此，可以手动进行预处理 .toString()，将参数转换为 String 类型，axios在拼接时就不会进行格式转换，
          // 也就不会出现因为数值过大无法正确处理而出现给 value带上引号而出现请求出错的情况
          {
            type: this.type,
            source: this.sourceId.toString(),

            offset: this.offset,
            limit: this.limit
          })
        // console.log(data)
        const { results } = data.data
        this.list.push(...results)
        this.loading = false
        if (results.length) {
          this.offset = data.data.last_id
        } else {
          this.finished = true
        }
        this.$emit('countComments', data.data)
      } catch (err) {
        // console.log('请求失败', err)
        this.loading = false
        this.error = true
      }
    }
  },
  created () {
    // 由于 van-list 组件的 onload 事件是需要屏幕滚动到van-list 的位置时才会第一次执行
    // 因此，跳转到文章详情页面是，van-list 并不处于屏幕当中，不会立即执行onload,
    // 也就无法及时获取到数据，articleindex 页面的评论数显示为0，
    // 此时可以在 created钩子函数中主动调用 onload ，以便于页面第一次之处就能获取到数据
    // this.loading = true
    this.onLoad()
  },
  mounted () { }
}
</script>
<style lang="less" scoped>
@media screen and (min-width: 200px) and (max-width: 1600px) {
}
@media screen and (min-width: 1601px) {
}
</style>
