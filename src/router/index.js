//引入路由插件
import VueRouter from 'vue-router'

//引入路由组件
import login from '../pages/login'
import home from '../pages/home'
import Welcome from '../pages/Welcome'
import users from '../pages/users'
import roles from '../pages/roles'
import rights from '../pages/rights'
import goods from '../pages/goods'
import categories from '../pages/categories'
import params from '../pages/params'
import add from '../pages/add'
import edit from '../pages/edit'
import orders from '../pages/orders'
import reports from '../pages/reports'
const router = new VueRouter({
    routes:[
        {
            path:'/',
            redirect:'/login'
        },
        {
            path:'/login',
            component:login
        },
        {
            path:'/home',
            component:home,
            // 当访问/home时重定向为/Welcome
            redirect:'/Welcome',
            // redirect:'/users',
            children: [
                {
                    path:'/Welcome',
                    component:Welcome,

                },
                {
                    path:'/users',
                    component:users
                },
                {
                    name:'roles',
                    path:'/roles',
                    component:roles
                },
                {
                    name:'rights',
                    path:'/rights',
                    component:rights
                },
                {
                    path:'/goods',
                    component:goods
                },
                {
                    path:'/categories',
                    component:categories
                },
                {
                    path:'/params',
                    component:params
                },
                {
                    path:'/goods/add',
                    component:add
                },
                {
                    path:'/goods/edit',
                    component:edit
                },
                {
                    path:'/orders',
                    component:orders
                },
                {
                    path:'/reports',
                    component:reports
                }
            ]
        }
    ]
})

//为路由对象添加 beforeEach 导航守卫
router.beforeEach((to,from,next) => {
    //如果用户访问的是登录页面时直接放行
    if(to.path === '/login') return next()
    //从 sessionStorage 中获取到保存的 token 值
    const tokenStr = window.sessionStorage.getItem('token')
    //若没有 token 值则强制跳转到登录页面
    if(!tokenStr) return next('/login')
    next()
})

export default router