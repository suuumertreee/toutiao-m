import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 引入 html 基准字体大小自动调整包
import 'amfe-flexible'

// 字体图标 、标签样式
import './style/index.less'

// 引入时间格式化第三方包 dayjs
import '@/utils/dayjs'

// 加载 Vant 核心组件库
import Vant from 'vant'
// 引入 vant 组件全局样式
import 'vant/lib/index.css'
// 全局注册 Vant 组件
Vue.use(Vant)

// 开发环境还是生产环境
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
