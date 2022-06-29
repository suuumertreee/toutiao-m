import Vue from 'vue'
import dayjs from 'dayjs'
// 导入中文语言包
import 'dayjs/locale/zh-cn'
// 导入相对时间插件
import relativeTime from 'dayjs/plugin/relativeTime'
// 全局应用中文语言包
dayjs.locale('zh-cn')

// 配置相对时间插件
dayjs.extend(relativeTime)

// 全局定义过滤器，供 html 标签元素使用、
Vue.filter('relativeTime', val => {
  // console.log(dayjs().to(dayjs('2019-03-11 09:00:00')))
  return dayjs().to(dayjs(val))
}
)
