import Vue from 'vue'
import Vuex from 'vuex'
import home from './home'
import users from './users'

Vue.use(Vuex)





export default new Vuex.Store({
    // count,
    // person,
    //模块化
    modules:{
        homeAbout:home,
        usersAbout:users
    }
})