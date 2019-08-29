<template>
  <div>
    <ShopHeader/>
    <div class="tab">
      <div class="tab-item" @click="switchTab('/shop/goods')">
        <a :class="{'router-link-active': showActive('/shop/goods')}">点餐</a>
      </div>
      <div class="tab-item" @click="switchTab('/shop/ratings')">
        <a :class="{'router-link-active': showActive('/shop/ratings')}">评价</a>
      </div>
      <div class="tab-item" @click="switchTab('/shop/info')">
        <a :class="{'router-link-active': showActive('/shop/info')}">商家</a>
      </div>
    </div>
    <keep-alive>
      <router-view/>
    </keep-alive>
  </div>
</template>

<script>
import ShopHeader from '../../components/ShopHeader/ShopHeader'
import ShopGoods from '../Shop/ShopGoods/ShopGoods'
import ShopRatings from '../Shop/ShopRatings/ShopRatings'
import ShopInfo from '../Shop/ShopInfo/ShopInfo'

export default {
  mounted () {
    this.$store.dispatch('getShopInfo')
  },
  components: {
    ShopHeader,
    ShopGoods,
    ShopRatings,
    ShopInfo
  },
  methods: {
    switchTab (path) {
      this.$router.replace(path)
    },
    showActive (path) {
      return this.$route.path === path ? 1 : 0
    }
  }
}

</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/mixin.styl"
.tab
  height 40px
  line-height 40px
  background #fff
  bottom-border-1px(rgba(7, 17, 27, 0.1))
  .tab-item
    float left
    width: 33.33333%
    text-align center
    font-size 14px
    color rgb(77, 85, 93)
    a
      display block
      position relative
      &.router-link-active
        color #02a774
        &::after
          content ''
          position absolute
          left 50%
          bottom 1px
          width 35px
          height 2px
          transform translateX(-50%)
          background #02a774
</style>
