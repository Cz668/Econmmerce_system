<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="" >
      </div>
      <!-- 登录表单区域 -->
      <el-form  ref="loginFormRef" class="login_form" :model="loginFrom" :rules="loginFromRules">
          <!-- 用户账号 -->
          <el-form-item prop="username">
              <el-input  prefix-icon="el-icon-user"  v-model="loginFrom.username"></el-input>
            </el-form-item>
            <!-- 用户密码 -->
            <el-form-item prop="password">
                <el-input type="password" prefix-icon="el-icon-lock" v-model="loginFrom.password"></el-input>
            </el-form-item>
            <el-form-item class="btns"> 
                <el-button type="primary" @click="login()">登录</el-button>
                <el-button type="info" @click="ressetLoginForm">重置</el-button>
            </el-form-item>
      </el-form> 
    </div>
  </div>
</template>

<script>
export default {
    name:'LoginTemplate',
    data(){
      return{
        //这是表单绑定的数据对象
        loginFrom:{
          username:'admin',
          password:'123456',
          loginToken:''
        },
        //这是表单的验证规则
        loginFromRules: {
        //验证用户名是否正确
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        //验证密码是否正确
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }
        ]
  }
      }
    },
    methods:{
      // 重置登录表单的信息
      ressetLoginForm(){
       this.$refs.loginFormRef.resetFields()
      // console.log(this.$refs)
      },
      login(){
        this.$refs.loginFormRef.validate( async valid => {
          //对用户输入的账号和密码进行判断验证是否输入正确
          // if(!valid || !this.loginFrom.username.trim() || !this.loginFrom.password.trim() || this.loginFrom.username.indexOf(' ')) return console.log('登录失败1')     
          if(!valid || !this.loginFrom.username.trim() || !this.loginFrom.password.trim() ) return console.log('登录失败1')     
          const rus = await this.$http.post("login",this.loginFrom)
          if(rus.data.meta.status!= 200) return this.$message.error('登录失败')
          // console.log('登录成功')
          this.$message.success('登录成功')
          //1.将登录成功之后的token，保存到客户端的sessionStorage中
          //  1.1 项目中除了登录之外的其他API接口，必须在登录之后才能访问
          //  1.2 token只因在当前网站打开期间生效，所以将token保存在sessionStorage中
          //2. 通过编程式导航跳转到后台主页，路由地址是/home
          window.sessionStorage.setItem('token',rus.data.data.token)
          this.$router.push('/home')
        })
      },
    },

}
</script>

<style lang="less" scoped>

.login_container{
  height: 100%;
  background-color: #2b4b6b;
}
.login_box{
  width: 450px;
  height: 300px;
  border-radius: 10px;
  background-color: #fff;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
}
.avatar_box{
  height: 130px;
  width: 130px;
  border-radius: 50%;
  padding: 10px;
  border: 1px solid #eee;
  position: absolute;
  left: 50%;
  top: -50%;
  transform: translate(-50%,50%);
  box-shadow: 0 0 10px #ddd;
  img{
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eee;
  }
}

.btns{
  display: flex;
  justify-content: flex-end;
}

.login_form{
  position:absolute;
  width: 100%;
  bottom: 0;
  padding: 0 10px;
  box-sizing: border-box;
}
</style>