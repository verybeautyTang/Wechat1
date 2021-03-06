<template>
  <section class="loginContainer">
    <div class="loginInner">
      <div class="login_header">
        <h2 class="login_logo">硅谷外卖</h2>
        <div class="login_header_title">
          <a href="javascript:;" :class="{on: loginWay}" @click="loginWay = true">短信登录</a>
          <a href="javascript:;" :class="{on: !loginWay}" @click="loginWay = false">密码登录</a>
        </div>
      </div>
      <div class="login_content">
        <form @submit.prevent="login">
          <div :class="{on: loginWay}">
            <section class="login_message">
              <input type="tel" maxlength="11" placeholder="手机号" v-model="phone">
              <button :disabled="!rightPhone" class="get_verification" :class="{right_phone: rightPhone && !computeTime}" @click.prevent="getVerifyCode">
                {{computeTime > 0 ? `已发送(${computeTime})` : '获取验证码'}}
              </button>
            </section>
            <section class="login_verification">
              <input type="tel" maxlength="8" placeholder="验证码" v-model="code">
            </section>
            <section class="login_hint">
              温馨提示：未注册硅谷外卖帐号的手机号，登录时将自动注册，且代表已同意
              <a href="javascript:;">《用户服务协议》</a>
            </section>
          </div>
          <div :class="{on: !loginWay}">
            <section>
              <section class="login_message">
                <input type="tel" maxlength="11" placeholder="手机/邮箱/用户名" v-model="name">
              </section>
              <section class="login_verification">
                <input type="text" maxlength="8" placeholder="密码" v-if="showPassword" v-model="pwd">
                <input type="password" maxlength="8" placeholder="密码" v-else v-model="pwd">
                <div class="switch_button" @click="showPassword=!showPassword" :class="showPassword ? 'on' : 'off'">
                  <div class="switch_circle" :class="{right: showPassword}"></div>
                  <span class="switch_text">{{showPassword ? 'abc' : ''}}</span>
                </div>
              </section>
              <section class="login_message">
                <input type="text" maxlength="11" placeholder="验证码" v-model="captcha">
                <img class="get_verification" src="http://localhost:3000/captcha" @click="getPictureCode" ref="captcha" alt="captcha">
              </section>
            </section>
          </div>
          <button class="login_submit" >登录</button>
        </form>
        <a href="javascript:;" class="about_us">关于我们</a>
      </div>
      <a href="javascript:" class="go_back" @click="$router.back()">
        <i class="iconfont icon-jiantou2"></i>
      </a>
    </div>
    <AlertTip v-show="showAlert" :alertText="alertText" @closeTip="closeTip"></AlertTip>
  </section>
</template>

<script>
import AlertTip from '../../components/AlertTip/AlertTip'
import {reqSendcode, reqPwdLogin, reqLoginSms} from '../../api/index'

export default {
  mounted () {
    this.getPictureCode()
  },
  data () {
    return {
      loginWay: true, // 登录方式,true:短信登陆；false:密码登陆
      computeTime: 0, // 发送验证码倒计时
      phone: '', // 手机号码登录
      showPassword: false, // 是否显示密码
      pwd: '', // 登录密码
      showAlert: false, // 验证窗口是否显示
      name: '', // 用户名
      captcha: '', // 图片验证码
      code: '', // 验证码
      alertText: '' // 错误提示内容
    }
  },
  computed: {
    rightPhone () {
      return /^1\d{10}$/.test(this.phone)
    }
  },
  methods: {
    getPictureCode () {
      this.$refs.captcha.src = 'http://localhost:3000/captcha?time=' + Date.now()
    },
    async getVerifyCode () {
      if (!this.computeTime) {
        this.computeTime = 30
        this.timer = setInterval(() => {
          this.computeTime--
          if (this.computeTime <= 0) {
            clearInterval(this.timer)
          }
        }, 1000)
      }

      const result = await reqSendcode(this.phone)
      if (result.code === 1) {
        this.alertShow(result.msg)
        if (this.computeTime) {
          this.computeTime = 0
          clearInterval(this.timer)
        }
      }
    },
    closeTip () {
      this.showAlert = false
    },
    alertShow (alertText) {
      this.showAlert = true
      this.alertText = alertText
    },
    async login () {
      let result = null // 暂存登录结果
      if (this.loginWay) {
        // 短信登陆
        if (!this.rightPhone) {
          // 手机号码不合法
          this.alertShow('手机号码不合法')
          return
        } else if (!/^\d{6}$/.test(this.code)) {
          // 验证码必须为6位数字
          this.alertShow('验证码必须为6位数字')
          return
        }
        result = await reqLoginSms(this.phone, this.code)
      } else {
        const {name, pwd, captcha, alertShow} = this
        // 用户密码登陆
        if (!name) {
          // 必须输入用户名
          alertShow('必须输入用户名')
          return
        } else if (!pwd) {
          // 必须输入密码
          alertShow('必须输入密码')
          return
        } else if (!captcha) {
          // 必须输入图片验证码
          alertShow('必须输入图片验证码')
          return
        }
        result = await reqPwdLogin({name, pwd, captcha})
      }

      if (result.code === 0) {
        // 登录成功
        // 存储用户信息
        const user = result.data
        this.$store.dispatch('saveUser', user)
        // 跳转页面
        this.$router.replace('/profile')
      } else {
        // 更新一次性图片验证码
        this.getPictureCode()
        // 显示错误提示
        this.alertShow(result.msg)
        // 清空输入输入框
        this.captcha = ''
      }
    }
  },
  components: {
    AlertTip
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../common/stylus/mixin.styl'
.loginContainer
      width 100%
      height 100%
      background #fff
      .loginInner
        padding-top 60px
        width 80%
        margin 0 auto
        .login_header
          .login_logo
            font-size 40px
            font-weight bold
            color #02a774
            text-align center
          .login_header_title
            padding-top 40px
            text-align center
            >a
              color #333
              font-size 14px
              padding-bottom 4px
              &:first-child
                margin-right 40px
              &.on
                color #02a774
                font-weight 700
                border-bottom 2px solid #02a774
        .login_content
          >form
            >div
              display none
              &.on
                display block
              input
                width 100%
                height 100%
                padding-left 10px
                box-sizing border-box
                border 1px solid #ddd
                border-radius 4px
                outline 0
                font 400 14px Arial
                &:focus
                  border 1px solid #02a774
              .login_message
                position relative
                margin-top 16px
                height 48px
                font-size 14px
                background #fff
                .get_verification
                  position absolute
                  top 50%
                  right 10px
                  transform translateY(-50%)
                  border 0
                  color #ccc
                  font-size 14px
                  background transparent
                  &.right_phone
                    color black
              .login_verification
                position relative
                margin-top 16px
                height 48px
                font-size 14px
                background #fff
                .switch_button
                  font-size 12px
                  border 1px solid #ddd
                  border-radius 8px
                  transition background-color .3s,border-color .3s
                  padding 0 6px
                  width 30px
                  height 16px
                  line-height 16px
                  color #fff
                  position absolute
                  top 50%
                  right 10px
                  transform translateY(-50%)
                  &.off
                    background #fff
                    .switch_text
                      float right
                      color #ddd
                  &.on
                    background #02a774
                  >.switch_circle
                    position absolute
                    top -1px
                    left -1px
                    width 16px
                    height 16px
                    border 1px solid #ddd
                    border-radius 50%
                    background #fff
                    box-shadow 0 2px 4px 0 rgba(0,0,0,.1)
                    transition transform .3s
                    &.right
                      transform translateX(26px)
              .login_hint
                margin-top 12px
                color #999
                font-size 14px
                line-height 20px
                >a
                  color #02a774
            .login_submit
              display block
              width 100%
              height 42px
              margin-top 30px
              border-radius 4px
              background #4cd96f
              color #fff
              text-align center
              font-size 16px
              line-height 42px
              border 0
          .about_us
            display block
            font-size 12px
            margin-top 20px
            text-align center
            color #999
        .go_back
          position absolute
          top 5px
          left 5px
          width 30px
          height 30px
          >.iconfont
            font-size 20px
            color #999
</style>
