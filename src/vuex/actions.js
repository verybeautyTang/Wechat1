import {
  RECEIVE_ADDRESS,
  RECEIVE_FOODTYPES,
  RECEIVE_SHOPS,
  RECEIVE_USER,
  RESET_USER,
  RECEIVE_GOODS,
  RECEIVE_INFO,
  RECEIVE_RATINGS,
  INCREMENT_FOOD_COUNT,
  DECREMENT_FOOD_COUNT,
  EMPTY_CART,
  RECEIVE_SEARCH_SHOP
} from './mutation-types'
import {
  reqAddress,
  reqFoodTypes,
  reqShops,
  reqUserInfo,
  reqLogout,
  reqShopGoods,
  reqShopInfo,
  reqShopRatings,
  reqSearchShops
} from '../api/index'

export default {
  // 异步获取设备位置信息
  async getAddress ({commit, state}) {
    let geohash = state.latitude + ',' + state.longitude
    const result = await reqAddress(geohash)
    if (result.code === 0) {
      commit(RECEIVE_ADDRESS, { address: result })
    }
  },
  // 异步获取食物种类信息
  async getFoodTypes ({commit}) {
    const result = await reqFoodTypes()
    if (result.code === 0) {
      commit(RECEIVE_FOODTYPES, {foodtypes: result})
    }
  },
  // 异步获取商家列表信息
  async getShops ({commit, state}) {
    const {longitude, latitude} = state
    const result = await reqShops(latitude, longitude)
    if (result.code === 0) {
      commit(RECEIVE_SHOPS, {shops: result})
    }
  },
  // 登录成功后保存用户信息
  saveUser ({commit}, user) {
    commit(RECEIVE_USER, {user})
  },
  // 自动登录
  async getUserInfo ({commit}) {
    const result = await reqUserInfo()

    if (result.code === 0) {
      commit(RECEIVE_USER, {user: result.data})
    }
  },
  // 退出登录
  async logout ({commit}) {
    const result = await reqLogout()
    if (result.code === 0) {
      commit(RESET_USER)
    }
  },

  // 异步获取商家信息
  async getShopInfo ({commit}) {
    const result = await reqShopInfo()
    if (result.code === 0) {
      const info = result.data
      commit(RECEIVE_INFO, {info})
    }
  },
  // 异步获取商家评价列表
  async getShopRatings ({commit}, callback) {
    const result = await reqShopRatings()
    if (result.code === 0) {
      const ratings = result.data
      commit(RECEIVE_RATINGS, {ratings})
      callback && callback()
    }
  },
  // 异步获取商家商品列表
  async getShopGoods ({commit}, callback) {
    const result = await reqShopGoods()
    if (result.code === 0) {
      const goods = result.data
      commit(RECEIVE_GOODS, {goods})
      callback && callback()
    }
  },
  // 更新食物的购买数量
  updateFoodCount ({commit}, {isAddition, food}) {
    isAddition ? commit(INCREMENT_FOOD_COUNT, {food}) : commit(DECREMENT_FOOD_COUNT, {food})
  },
  // 清空购物车
  emptyCart ({commit}) {
    commit(EMPTY_CART)
  },
  // 搜索商家
  async searchShop ({commit, state}, keyword) {
    let geohash = state.latitude + ',' + state.longitude
    let result = await reqSearchShops(geohash, keyword)
    if (result.code === 0) {
      const searchShops = result.data
      commit(RECEIVE_SEARCH_SHOP, {searchShops})
    }
  }
}
