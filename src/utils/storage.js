// 封装本地数据增删改操作

// 存入本地
export const setItem = (key, data) => {
  if (typeof data === 'object') {
    window.localStorage.setItem(key, JSON.stringify(data))
  } else {
    window.localStorage.setItem(key, data)
  }
}

// 从本地获取数据
export const getItem = key => {
  try {
    const data = window.localStorage.getItem(key)
    return JSON.parse(data)
  } catch (err) {
    return window.localStorage.getItem(key)
  }
}

// 删除本地数据
export const removeItem = key => {
  window.localStorage.removeItem(key)
}
