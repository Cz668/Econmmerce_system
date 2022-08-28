<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom: 15px;">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    <el-breadcrumb-item >角色列表</el-breadcrumb-item>
  </el-breadcrumb>

  <!-- 卡片试图 -->
  <el-card>
    <!-- 添加角色区 -->
    <el-row style="margin-bottom:15px;">
      <el-col>
        <el-button type="primary"
        @click="addDialogVisible = true">
        添加角色</el-button>
      </el-col>
    </el-row>
    <el-table
      border
      stripe
      :data="rolesList"
      style="width: 100%">
      <!-- 展开列 -->
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-row  v-for="(item1,i1) in scope.row.children" :key="item1.id" :class="['bdbottom', i1 === 0 ? 'bdtop' : '','vcenter']">
            <!-- 渲染一级权限 -->
            <el-col :span="5">
              <el-tag
              closable
              @close="removeRightById(scope.row,item1.id)">
                {{item1.authName}}
              </el-tag>
                <i class="el-icon-caret-right"></i>
            </el-col>
            <!-- 渲染二级和三级权限 -->
            <el-col :span="19" >
                <el-row v-for="(item2,i2) in item1.children" :key="item2.id" :class="[i2 === 0 ? '' : 'bdtop','vcenter']">
                  <el-col :span="6" >
                    <el-tag 
                    closable
                    @close="removeRightById(scope.row,item2.id)"
                    type="success">
                      {{item2.authName}}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="13" >
                    <el-tag 
                    v-for="item3 in item2.children" 
                    :key="item3.id" 
                    type="warning" 
                    closable
                    @close="removeRightById(scope.row,item3.id)">
                      {{item3.authName}}
                    </el-tag>
                  </el-col>
                </el-row>
            </el-col>
          </el-row>
          <!-- <pre>
            {{scope.row}}
          </pre> -->
        </template>
      </el-table-column>
      <!-- 索引列 -->
      <el-table-column type="index"></el-table-column>
      <el-table-column
        prop="roleName"
        label="角色名称">
      </el-table-column>
      <el-table-column
        prop="roleDesc"
        label="角色描述">
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
            <el-button 
             @click="showEditDialog(scope.row.id)"
            size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button 
            @click="removeRoleById(scope.row.id)"
            size="mini" type="danger" icon="el-icon-delete">删除</el-button>
            <el-button 
            @click="showSetRightDialogVisible(scope.row)"
            size="mini" type="warning" icon="el-icon-setting">分配角色</el-button>         
        </template>
      </el-table-column>
    </el-table> 
  </el-card>
  <!-- 编辑用户对话框 -->
  <el-dialog
  title="修改用户信息"
  :visible.sync="editDialogVisible"
  width="50%">
  <el-form 
    :model="editFrom" 
    :rules="editFromRules"
    ref="editFromRef" 
    label-width="100px">
      <el-form-item label="管理名称" prop="roleName" >
        <el-input v-model="editFrom.roleName"></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="roleDesc">
        <el-input v-model="editFrom.roleDesc"></el-input>
      </el-form-item>
    </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editRolseInfo(editFrom.roleId)">确 定</el-button>
  </span>
</el-dialog>
<!-- 添加用户的对话框 -->
  <el-dialog
    title="添加角色"
    :visible.sync="addDialogVisible"
    width="50%"
    @close="addDialogClosed">
    <!-- 内容主体区 -->
    <el-form 
    :model="addFrom" 
    :rules="editFromRules" 
    ref="addFromRef" 
    label-width="100px">
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="addFrom.roleName"></el-input>
      </el-form-item>
      <el-form-item label="角色描述" prop="roleDesc">
        <el-input v-model="addFrom.roleDesc"></el-input>
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
  <!-- 分配权限对话框 -->
  <el-dialog
  title="分配权限"
  :visible.sync="setRightDialogVisible"
  width="50%">
  <!-- <template slot-scope="scope"> -->
  <!-- 树形控件 -->
    <el-tree 
    :data="rightsList" 
    :props="treeProps"
    show-checkbox
    default-expand-all
    node-key="id"
    :default-checked-keys="fdkey" 
    ref="rolestree"
    >
    </el-tree>
    <span slot="footer" class="dialog-footer">
      <el-button @click="setRightDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="rolesSetRight">确 定</el-button>
    </span>
  <!-- </template> -->
</el-dialog>
  </div>
</template>

<script>
export default {
    name:'RoleS',
    data(){
      return {
        // 角色管理数据
        rolesList:[],
        // 权限管理数据
        rightsList:[],
        // 控制角色管理的删除对话框的显示
        editDialogVisible:false,
        // 控制分配权限对话框的显示
        setRightDialogVisible:false,
        // 树形控件的属性绑定对象
        treeProps:{
          label: 'authName',
          children: 'children'
        },
        // 控制添加用户对话框的显示和隐藏
        addDialogVisible:false,
        // 当前编辑用户的信息
        editFrom:{},
        // 添加用户的表单数据
        addFrom:{
          roleName:'',
          roleDesc:''
        },
        // 添加表单的验证规则对象
        editFromRules:{
          roleName: [
            { required: true, message: '请输入管理名称', trigger: 'blur' },
            { min: 2, max: 12, message: '请输入正确的管理名称', trigger: 'blur' }
          ],
          roleDesc: [
            { required: true, message: '请输入管理描述', trigger: 'blur' },
            { min: 2, max: 12, message: '请输入正确的管理描述', trigger: 'blur' }
          ],
        }, 
        // 默认勾选的节点的数组
          fdkey:[],
        // 用来保存角色ID（用来提供角色授权发起的post请求所需的角色Id）
         roleId:''
      }
    },
    created(){
      this.getRolesList()
      // console.log('vue',this)
    },
    methods:{
      async getRolesList(){
        const {data:res} = await this.$http.get('roles')
        if(res.meta.status !== 200) return this.$message.error('获取角色列表失败')
        this.rolesList = res.data
      },
      async showEditDialog(id){
        this.editDialogVisible = true
        const {data : res} = await this.$http.get('roles/'+id)
        if(res.meta.status !== 200) return this.message.error('查询用户失败')
        this.editFrom = res.data
        // console.log('editFrom',this.editFrom)
      },
      // 发送put请求修改用户信息并提交
      async editRolseInfo(id){
        this.$refs.editFromRef.validate( async valid => {
          if(!valid) return this.$message.error('格式有误')
          const {data:res} = await this.$http.put('roles/'+id,{roleName:this.editFrom.roleName,roleDesc:this.editFrom.roleDesc})
          if(res.meta.status !== 200) return this.$message.error('修改用户失败')
          this.$message.success('修改用户成功')
          // 隐藏编辑用户对话框
          this.editDialogVisible = false
          this.getRolesList()
          })
      },
      addUser(){
        // 判断所有输入的内容是否合法
        this.$refs.addFromRef.validate( async valid => {
          if(!valid) return this.$message.error('添加失败')
          const {data:res} = await this.$http.post('roles',this.addFrom)
          // console.log('res',res)
          if(res.meta.status !== 201) return this.$message.error('添加角色失败')
          this.$message.success('添加角色成功')
          // 隐藏添加用户对话框
          this.addDialogVisible = false
          this.getRolesList()
        })
      },
      // 监听添加用户对话框关闭事件
      addDialogClosed(){
        // 重置用户对话框的信息
        this.$refs.addFromRef.resetFields()
      },
      // 发起delete请求删除单个用户
      async removeRoleById(id){
        // console.log('id',id)
          const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        // console.log('confirmResult',confirmResult)
        if(confirmResult === 'confirm'){
          const {data : res} = await this.$http.delete('roles/'+ id)
          console.log('res',res)
          if(res.meta.status !== 200) return this.$message.error('删除失败')
            this.$message.success('删除用户成功')   
            this.getRolesList()
            return      
        }
        this.$message.error('已取消删除')
      },
      // 移除权限对话框
      async removeRightById(role,rightid){
          const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        // console.log('err',err)
        if(confirmResult === 'confirm'){
          const {data : res} = await this.$http.delete(`roles/${role.id}/rights/${rightid}`)
          if(res.meta.status !== 200) return this.$message.error('删除权限失败')
            this.$message.success('删除权限成功')  
            role.children = res.data  
            return    
        }
        this.$message.error('已取消删除权限操作')
      },
      // 通过递归的形式，获取角色下所有三级权限的id，并保存到fdkey
      getLeafKeys(node,arr){
        // 判断节点是否是三级节点，根据第三节点不包含children属性进行判断
        if(!node.children) {
          // console.log('node.id',node.id)
          return arr.push(node.id)
        }
        node.children.forEach(item => {
          this.getLeafKeys(item,arr)
        })
      },
      // 展示分配权限的对话框
      async showSetRightDialogVisible(scope){
        const {data : res} = await this.$http.get('rights/tree')
        if(res.meta.status !== 200) return this.$message.error('查询用户失败')
        this.rightsList = res.data
        this.fdkey = []
        this.getLeafKeys(scope,this.fdkey)
        this.roleId = scope.id
        this.setRightDialogVisible = true
        // console.log('res',res.data)
        // console.log('this.rightsList',this.rightsList)
      },
      // 获取选中节点的id
      async rolesSetRight() {
        const selectRights = [
          ...this.$refs.rolestree.getCheckedKeys(),
          // ...this.$refs.rolestree.getHalfCheckedNodes	(),
          ...this.$refs.rolestree.getHalfCheckedKeys()
          // ...this.$refs.rolestree.getHalfCheckedNodes()
        ]
        const selectRightsID = selectRights.join(',')
        const {data : res} = await this.$http.post(`roles/${this.roleId}/rights`,{rids:selectRightsID})
        console.log('res',res)
        console.log('this.roleId',this.roleId)
        console.log('selectRightsID', selectRightsID)
        if(res.meta.status !== 200) return this.$message.error('角色授权失败')
        this.$message.success('角色授权成功')
        this.setRightDialogVisible = false
        this.getRolesList()
        // console.log('selectRightsID',selectRightsID)
      },
    }
}
</script>

<style>
.el-tag {
  margin:7px;
}

.bdtop {
  border-top: 1px solid #eee;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}

.vcenter {
  display: flex;
  align-items: center;
}
</style>