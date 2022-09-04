import Vue from 'vue'
import App from './App.vue'
import store from './store'
//引入全局样式
import './assets/css/global.css'
//引入vueRouter
import VueRouter from 'vue-router'
//引入路由器
import router from './router'
// 引入ElementUI
// import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'
// 引入Element
// import './plugins/element.js'

//按需引入
import './plugins/element'

// 引入vue-table-with-tree-grid -S运行依赖插件实现树形结构
import TreeTable from 'vue-table-with-tree-grid'

// 引入vue-quill-editor -S运行依赖插件
import VueQuillEditor from 'vue-quill-editor'
// 导入父文本编辑样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme


//引入axios
import axios from 'axios'
// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// axios请求拦截
axios.interceptors.request.use(config => {
  //为请求头对象，添加Toke验证的Authorization字段、
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // console.log('这是config',config)
  return config
})

Vue.prototype.$http = axios

// 全局注册vue-table-tree-grid插件
Vue.component('tree-table',TreeTable)

//关闭Vue生产提示
Vue.config.productionTip = false

//使用路由插件
Vue.use(VueRouter)

// 全局注册vue-quill-editor插件
Vue.use(VueQuillEditor)


// 设置全局过滤（时间戳）
Vue.filter('dateFormat',function(originVal){
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2,'0')
  const d = (dt.getDate() + '').padStart(2,'0')
  const hh = (dt.getHours() + '').padStart(2,'0')
  const mm = (dt.getMinutes() + '').padStart(2,'0')
  const ss = (dt.getSeconds() + '').padStart(2,'0')

  return `${y}-${m}-${d}-${hh}-${mm}-${ss}`

})


new Vue({
  el:'#app',
  render: h => h(App),
  router:router,
  store,
  beforeCreate(){
    Vue.prototype.$bus = this
  }
})
