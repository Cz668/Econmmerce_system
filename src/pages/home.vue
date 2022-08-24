<template>
  <!-- <div class="home_container"> -->
    <el-container class="home_container">
        <el-header>
          <div>
            <img src="../assets/logo.png" alt="" class="header_avatar">
            <span>电商管理系统</span>
          </div>
          <el-button class="login_out" type="info" @click="loginOut">退出</el-button>
        </el-header>
      <el-container>
        <!-- 侧边栏 -->
        <el-aside :width="isCollapse ? '65px' : '200px'">
          <!-- 折叠路由 -->
          <div class="toggle-button" @click="toggleCollapse">|||</div>
          <el-menu
            :default-active="$route.path"
            background-color="#333744"
            text-color="#fff"
            active-text-color="#409EFF"
            unique-opened
            :collapse="isCollapse" 
            :collapse-transition="false"
            router
           >
            <!-- 一级路由 -->
            <el-submenu :index="item.id +''" v-for="item in menulist " :key="item.id">
              <template slot="title">
                <i :class="navIcon[item.id]"></i>
                <span>{{item.authName}}</span>
              </template>
              <!-- 二级路由 -->
                <el-menu-item  
                  :index="'/' + subItem.path + ''" 
                  v-for="subItem in item.children" 
                  :key="subItem.id"
                  >
                    <template slot="title">
                      <i class="el-icon-menu"></i>
                      <span>{{subItem.authName}}</span>
                    </template>
                </el-menu-item>
            </el-submenu>
          </el-menu>
          
        </el-aside>
        <!-- 主体部分 -->
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
    
  <!-- </div> -->
</template>

<script>

export default {
    name:'homeTemplate',
    data(){
      return {
        //用来存储路由信息
        menulist:[],
        //一级路由图标
        navIcon:
          {
          '125' : 'el-icon-user-solid',
          '103' : 'el-icon-unlock',
          '101' : 'el-icon-shopping-cart-1',
          '102' : 'el-icon-notebook-1',
          '145' : 'el-icon-toilet-paper'
          },
          // 判断是否折叠路由
          isCollapse: false,
      }
    },
    created(){
      this.getMenuent()
    },
    methods:{
      // 退出登录返回登录页面
      loginOut(){
        //清空token
        window.sessionStorage.clear()
        //跳转到登录页面
        this.$router.push('/login')
      },
      // 获取路由信息
      async getMenuent(){
        const {data:res} = await this.$http.get('menus')
        // console.log(res)
        if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.menulist = res.data
      },
      // 折叠路由
      toggleCollapse(){
        this.isCollapse = !this.isCollapse
      },
    },


}
</script>

<style lang="less" scoped>

.home_container{
  height: 100%;
}

  .el-header {
    background-color: #373d41;
    color: white;
    display: flex;
    justify-content: space-between;
    font-size: 20px;
    padding: 5px 10px 5px 0px;
     > div{
          display: flex;
          // width: 100%;
          align-items: center;
    }
    /* text-align: center;
    line-height: 60px; */
  }
  .el-main {
    background-color: #E9EEF3;
    // color: white;
    /* text-align: center;
    line-height: 160px; */
  }
  .el-aside {
    background-color: #333744;
    color: white;
    .el-menu {
      border-right: none;
    }
    /* text-align: center;
    line-height: 200px; */
  }
  /* 头部图片样式 */
  .header_avatar{
    height: 100%;
    width: 20%;
  }
//折叠样式
.toggle-button{
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>