<template>
<div>
  <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom: 15px;">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>{{usersM}}</el-breadcrumb-item>
    <el-breadcrumb-item >{{usersL}}</el-breadcrumb-item>
  </el-breadcrumb>

  <!-- 卡片视图区 -->
  <el-card>
    <!-- 搜索与添加区 -->
    <el-row :gutter="20" style="margin-bottom: 15px;">
      <el-col :span="8">
        <el-input 
        placeholder="请输入内容" 
        v-model="queryInfo.query"
        clearable
        @clear="getUsersList">
          <el-button 
          slot="append" 
          icon="el-icon-search"
          @click="getUsersList">
          </el-button>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button  
        type="primary" 
        @click="addDialogVisible = true">
        添加按钮
        </el-button>
      </el-col>
    </el-row>
    <!-- 用户列表区 -->
    <el-table
      border
      stripe
      :data="usersList"
      style="width: 100%">
      <el-table-column type="index">
      </el-table-column>
      <el-table-column
        prop="username"
        label="姓名">
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="电话">
      </el-table-column>
      <el-table-column
        prop="role_name"
        label="角色">
      </el-table-column>
      <el-table-column
        label="状态">
        <template slot-scope="scope">
        <el-switch
          v-model="scope.row.mg_state"
          active-color="#13ce66"
          inactive-color="#ff4949"
          @change="userStateChange(scope.row)">
        </el-switch>
        </template>
      </el-table-column>
      <!-- 用户编辑，删除，更改角色按钮区 -->
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top" :enterable="false" :open-delay="500">
            <el-button 
            @click="showEditDialog(scope.row.id)"
            size="mini" type="primary" icon="el-icon-edit"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable="false" :open-delay="500">
            <el-button 
            @click="removeUserById(scope.row.id)"
            size="mini" type="danger" icon="el-icon-delete"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false" :open-delay="500">
            <el-button
            @click="setRole(scope.row)" 
            size="mini" type="warning" icon="el-icon-setting"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 页码区 -->
      <div class="block" style="margin-top: 15px;">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[1,2,3,4]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
    </div>
  </el-card>
  <!-- 添加用户的对话框 -->
  <el-dialog
    title="添加用户"
    :visible.sync="addDialogVisible"
    width="40%"
    @close="addDialogClosed">
    <!-- 内容主体区 -->
    <el-form 
    :model="addFrom" 
    :rules="addFromRules" 
    ref="addFromRef" 
    label-width="70px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="addFrom.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="addFrom.password"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="addFrom.email"></el-input>
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="addFrom.mobile"></el-input>
      </el-form-item>
    </el-form>
    <!-- 底部区域 -->
    <span slot="footer" class="dialog-footer">
      <el-button 
      @click="addDialogVisible = false"
      >
      取 消
      </el-button>
      <el-button 
      type="primary" 
      @click="addUser">
      确 定
      </el-button>
    </span>
  </el-dialog>
  <!-- 编辑用户对话框 -->
  <el-dialog
  title="修改用户信息"
  :visible.sync="editDialogVisible"
  width="50%">
  <el-form 
    :model="editFrom" 
    :rules="addFromRules" 
    ref="editFromRef" 
    label-width="100px">
      <el-form-item label="用户名" prop="username" >
        <el-input v-model="editFrom.username" disabled></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="editFrom.email"></el-input>
      </el-form-item>
      <el-form-item label="电话" prop="mobile">
        <el-input v-model="editFrom.mobile"></el-input>
      </el-form-item>
    </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editUserInfo(editFrom.id)">确 定</el-button>
  </span>
</el-dialog>

<!-- 分配角色对话框 -->
  <el-dialog
  title="分配角色"
  :visible.sync="setRoleDialogVisible"
  width="50%">
      <div>
        <p>用户名：{{userInfo.username}}</p>
        <p>当前角色：{{userInfo.role_name}}</p>
        <p>分配新角色
          <el-select v-model="selectedRoldId" placeholder="请选择">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>
        </p>
      </div>
  <span slot="footer" class="dialog-footer">
    <el-button @click="setRoleDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="changeRole(userInfo)">确 定</el-button>
  </span>
</el-dialog>
</div>
</template>

<script>
// import {  mapState } from 'vuex'
export default {
    name:'UserS',
    data(){
      // 验证邮箱
      var checkEmail = (rule,value,callback) => {
        // 正则表达式
        // const regEmail = /^([a-zA-Z0-9_-]) +@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
        const regEmail = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+/ 
        // const regEmail = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$+/
        if(regEmail.test(value)) return callback()
          callback(new Error('请输入合法的邮箱'))   
      }
      // 验证手机号
      var checkMobile = (rule,value,callback) => {
        // 正则表达式
        const regMobile = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[679]|18[0-9]|14[57])[0-9]{8}$/
        if(regMobile.test(value)){
          return callback()
        }
          callback(new Error('请输入合法的手机号'))
        
      }
      return{ 
        queryInfo:{
          query:'',
          //当前的页数
          pagenum:1,
          //当前每页显示多少条
          pagesize:4
        },
        //用户列表
        usersList:[],
        //用户总数
        total: 0,
        // 添加用户的表单数据
        addFrom:{
          username:'',
          password:'',
          email:'',
          mobile:'',
        },
        // 当前编辑用户的信息
        editFrom:{},
        // 需要被分配角色的用户信息
        userInfo:{},
        // 所有角色列表信息
        rolesList:[],
        // 已选中的Id值
        selectedRoldId:'',
        // 添加表单的验证规则对象
        addFromRules:{
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 6, message: '请输入正确的用户名', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 3, max: 6, message: '请输入正确的密码', trigger: 'blur' }
          ],
          email: [
            { required: true, message: '请输入邮箱', trigger: 'blur' },
            { validator: checkEmail, trigger: 'blur' }
          ],
          mobile: [
            { required: true, message: '请输入手机号', trigger: 'blur' },
            { validator: checkMobile, trigger: 'blur' }
          ],
        },
        // 控制添加用户对话框的显示和隐藏
        addDialogVisible: false,
        // 控制编辑用户对话框的显示和隐藏
        editDialogVisible:false,
        // 控制删除用户对话框的显示和隐藏
        deleteDialogVisible:false,
        // 控制分配角色对话框的显示和隐藏
        setRoleDialogVisible:false,
      }
    },
    created(){
      this.getUsersList()
    },
    methods:{
      //监听页面显示条数的变化
      handleSizeChange(newSize){
          console.log('newSize',newSize)
          this.queryInfo.pagesize = newSize
          this.getUsersList()
      },
      //监听当前页面的变化
      handleCurrentChange(newPage){
        this.queryInfo.pagenum = newPage
        this.getUsersList()
        // console.log('newPage',newPage)
      },  
      // 发起get请求获取用户列表
      async getUsersList(){
        const {data:res} = await this.$http.get('users',{ params : this.queryInfo })
        // const {data:res} = await this.$http.get('users',this.queryInfo)
        if(res.meta.status !== 200)  return this.$message.error('获取用户列表失败')
        this.usersList = res.data.users
        this.total = res.data.total
      }, 
      // 发起put请求修改用户状态
      async userStateChange(userInfo){
        const {data:res} =await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
        // console.log('res',res)
        if(res.meta.status !== 200)  return this.$message.error('修改用户状态失败')
        this.$message.success('修改成功')
      },
      // 监听添加用户对话框关闭事件(可要可不要)
      addDialogClosed(){
        // 重置用户对话框的信息
        this.$refs.addFromRef.resetFields()
      },
      // 添加用户发起post请求添加用户
      addUser(){
        // 判断所有输入的内容是否合法
        this.$refs.addFromRef.validate( async valid => {
          if(!valid) return this.$message.error('添加失败')
          const {data:res} = await this.$http.post('users',this.addFrom)
          // console.log('res',res)
          if(res.meta.status !== 201) return this.$message.error('添加用户失败')
          this.$message.success('添加用户成功')
          // 隐藏添加用户对话框
          this.addDialogVisible = false
          this.getUsersList()
        })
      },
      // 展示编辑用户对话框
      async showEditDialog(id){
        this.editDialogVisible = true
        const {data : res} = await this.$http.get('users/'+id)
        // console.log('res',res)
        if(res.meta.status !== 200) return this.message.error('查询用户失败')
        this.editFrom = res.data
        // console.log('id',id)
        
      },
      // 发送put请求修改用户信息并提交
      async editUserInfo(id){
        this.$refs.editFromRef.validate( async valid => {
          if(!valid) return this.$message.error('格式有误')
          const {data:res} = await this.$http.put('users/'+id,{email:this.editFrom.email,mobile:this.editFrom.mobile})
          // console.log('valid',valid)
          if(res.meta.status !== 200) return this.$message.error('修改用户失败')
          this.$message.success('修改用户成功')
          // 隐藏编辑用户对话框
          this.editDialogVisible = false
          this.getUsersList()
          })
      },

      // 发起delete请求删除单个用户
      async removeUserById(id){
        // console.log('id',id)
          const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        // console.log('err',err)
        if(confirmResult === 'confirm'){
          const {data : res} = await this.$http.delete('users/'+ id)
          if(res.meta.status !== 200) return this.$message.error('删除失败')
            this.$message.success('删除用户成功')   
            this.getUsersList()  
            return    
        }
        this.$message.error('已取消删除')
      },
      // 展示分配角色对话框
      async setRole(userInfo){
        this.userInfo = userInfo
        const {data : res} = await this.$http.get('roles')
        if(res.meta.status !== 200) return this.$message.error('获取角色失败')
        this.rolesList = res.data
        // console.log('rolesList',this.rolesList)
        // console.log('userInfo',userInfo)
        this.setRoleDialogVisible = true
      },
      async changeRole(userInfo){
        if(!this.selectedRoldId) return this.$message.error('选项不能为空')
        const {data : res} = await this.$http.put(`users/${userInfo.id}/role`,{rid:this.selectedRoldId})
        // console.log('res',res)
        // console.log('userInfo.id',userInfo.id)
        // console.log('this.selectedRoldId',this.selectedRoldId)
        if(res.meta.status !== 200) return this.$message.error('获取角色失败')
        this.$message.success('分配角色成功')
        this.getUsersList()
        this.setRoleDialogVisible = false
        this.selectedRoldId = ''
        // console.log('this.selectedRoldId',this.selectedRoldId)
      }
    },
    computed:{
      // 简写
      //  ...mapState('homeAbout',['usersL']),
      //  ...mapState('homeAbout',['usersM']),
      
      // 原始写法
      //获取用户管理
      usersL(){
        return this.$store.state.homeAbout.usersL 
      },
      //获取用户列表
      usersM(){
        return this.$store.state.homeAbout.usersM 
      }
    },

}
</script>

<style>
.el-card{
  box-shadow: 0 1px 1px rgb(0, 0, 0,0.15) !important;
}

.item {
margin: 4px;
}
</style>