/*
    入口js
*/
import Vue from 'vue'
import { Button } from 'mint-ui'
import App from './App'
import router from './router/index'
import store from './vuex/index'
import VueLazyLoad from 'vue-lazyload'
import './mock/MockServer'

import loading from './common/imgs/loading.gif'

Vue.use(VueLazyLoad, {
  loading
})

Vue.component(Button.name, Button)

Reflect.construct(Vue, [
  {
    el: '#app',
    render: h => h(App),
    router,
    store
  }
])
