import Vue from 'vue'
import Vuex from 'vuex'
import { setItem, getItem } from '@/utils/storage.js'

Vue.use(Vuex)

const TOKEN_KEY = 'TOUTIAO_USER'
export default new Vuex.Store({
  // namespaced: true
  state: {
    // 在登录以后，调取本地存储到的user 数据相关信息，避免刷新页面后，vuex 状态信息丢失。
    user: getItem(TOKEN_KEY)
  },
  mutations: {
    // 首次登陆以后，将返回的数据中的 登陆相关的数据存储到本地
    setUser (state, data) {
      state.user = data
      // 获取到数据以后，将数据存储到本地
      setItem(TOKEN_KEY, data)
    }
  },
  actions: {},
  modules: {}
})
