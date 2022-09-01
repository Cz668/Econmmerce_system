<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom: 15px;">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    <el-breadcrumb-item >参数列表</el-breadcrumb-item>
  </el-breadcrumb>

  <!-- 卡片示图 -->
    <el-card>
      <el-alert
        title="注意:只允许第三级分类设置相关参数"
        type="warning"
        show-icon
        :closable="false">
      </el-alert>

      <!-- 选择商品分类区域 -->
      <el-row class="cat_opt">
          <span>选择商品分类：</span>
          <!-- options用来指定数据源 -->
          <!-- props用来指定配置对象 -->
          <el-cascader
            v-model="selectcascaderKeys"
            :options="cateList"
            :props="cascaderProps" 
            @change="cascaderChange"
            clearable
            >
          </el-cascader>
      </el-row>

      <!-- tab页签区域 -->
      <el-tabs @tab-click="categorieshandleClick" v-model="categoriesName"> 
        <el-tab-pane label="动态参数" name="many" >
          <!-- 添加参数按钮 -->
          <el-button type="primary" style="margin-bottom:15px;"
          :disabled="isBtnDisabled" 
          @click="addDialogVisible = true"> 添加参数 </el-button>
          <!-- 动态参数表格 -->
          <el-table :data="manyData " border stripe
          v-if="categoriesName === 'many' ">
            <!-- 展开列 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
              <el-tag 
              v-for="(item1,i1) in scope.row.attr_vals" 
              :key="i1" 
              closable
              @close="handleClose(i1,scope.row)">
                {{item1}}
              </el-tag>
              <el-input
                class="input-new-tag"
                v-if="scope.row.inputVisible"
                v-model="scope.row.inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(scope.row)"
                @blur="handleInputConfirm(scope.row)"
              >
              </el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                @click="showEditDialog(scope.row)" 
                size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
                <el-button
                @click="removeParamsById(scope.row)" 
                size="mini" type="danger" icon="el-icon-delete">删除</el-button>
              </template>       
            </el-table-column>
          </el-table>
        </el-tab-pane>
        
        <!-- 静态参数 -->
        <el-tab-pane label="静态参数" name="only" >
          <el-button type="primary" style="margin-bottom:15px;"
          :disabled="isBtnDisabled" 
          @click="addDialogVisible = true">
          添加参数
          </el-button>
          <!-- 静态参数表格 -->
          <el-table
            v-if="categoriesName === 'only' "
            :data="onlyData "
            border
            stripe
            >
            <!-- 展开列 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
              <el-tag 
              v-for="(item2,i2) in scope.row.attr_vals" 
              :key="i2" 
              closable
              @close="handleClose(i2,scope.row)">
                {{item2}}
              </el-tag>
              <el-input
                class="input-new-tag"
                v-if="scope.row.inputVisible"
                v-model="scope.row.inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(scope.row)"
                @blur="handleInputConfirm(scope.row)"
              >
              </el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index">

            </el-table-column>
            <el-table-column
              prop="attr_name"
              label="属性名称">
            </el-table-column>
              <el-table-column
                label="操作">
                <template slot-scope="scope">
                <el-button 
                @click="showEditDialog(scope.row)"
                size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
                <el-button 
                
                size="mini" type="danger" icon="el-icon-delete">删除</el-button>       
              </template>
              </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

  <!-- 添加对话框 -->
  <el-dialog
    :title="this.categoriesName === 'many' ? '添加动态属性' : '添加静态属性' "
    :visible.sync="addDialogVisible"
    width="50%">
    <el-form :model="addFrom" label-width="100px">
      <el-form-item :label="this.categoriesName === 'many' ? '动态属性' : '静态属性'">
        <el-input v-model="addFrom.attr_name"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="addDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="addGories">确 定</el-button>
    </span>
  </el-dialog>

    <!-- 编辑用户对话框 -->
    <el-dialog
    :title="this.categoriesName === 'many' ? '修改动态属性' : '修改静态属性' "
    :visible.sync="editDialogVisible"
    width="50%">
    <el-form 
      :model="editFrom"
      label-width="100px">
        <el-form-item :label="this.categoriesName === 'many' ? '动态属性' : '静态属性' " prop="attr_name" >
          <el-input v-model="editFrom.attr_name"></el-input>
        </el-form-item>
      </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="editDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="editParamsInfo(editFrom.attr_id)">确 定</el-button>
    </span>
  </el-dialog>
  </div>
</template>

<script>
export default {
    name:'ParamS',
    data(){
      return{
        // 商品分类数据列表
        cateList:[],
        // 商品参数数据列表
        categoriesList:[],
        // 选中的父级分类的Id数组
        selectCateKeys:[],
        // 用来指定级联选择器的配置对象
        cascaderProps:{
          value:'cat_id',
          label:'cat_name',
          children:'children',
          expandTrigger: 'hover'
        },
        // 被激活的页签的名称
        categoriesName:'many',
        // 级联选择框双向绑定到的数组
        selectcascaderKeys:[],
        // 动态数据列表
        manyData:[],
        // 静态数据列表
        onlyData:[],
        // 控制添加对话框的显示与隐藏
        addDialogVisible:false,
        // 绑定添加属性信息
        addFrom:{
          attr_name:'',
        },
        // 控制编辑对话框的显示与隐藏
        editDialogVisible:false,
        // 当前编辑参数的信息
        editFrom:{}
      }
    },
    created(){
      this.getcateList()
      // console.log('this1',this)
    },
    computed:{
      // 是否禁用添加按钮
      isBtnDisabled(){
        if(!this.selectcascaderKeys.length){
          return true
        }
        return  false
      }
    },
    methods:{
      // 发起get请求获取商品分类数列表
      async getcateList(){
        const {data:res} = await this.$http.get('categories')
        // console.log('res',res)
        if(res.meta.status !== 200)  return this.$message.error('获取商品分类数列表失败')
        this.cateList = res.data
      },
      // 获取商品分类ID
      cascaderChange(){
        if(this.selectcascaderKeys.length === 0){
          this.selectcascaderKeys = []
          this.manyData = []
          this.onlyData = []
        }
          // console.log('selectcascaderKeys',this.selectcascaderKeys)
          this.getcategoriesList()
          // console.log('this2',this)
      },
      // 监视切换属性
      categorieshandleClick(){
        this.getcategoriesList()
        // console.log('categoriesName',this.categoriesName)
      },
      // 
      async getcategoriesList(){
        if(!this.selectcascaderKeys.length) return
        const {data:res} = await this.$http.get(`categories/${this.selectcascaderKeys[this.selectcascaderKeys.length-1]}/attributes`,{params:{sel:this.categoriesName}})
        console.log('res2',res.data)
        if(res.meta.status !== 200)  return this.$message.error('获取商品分类数列表失败')
        this.$message.success('获取商品参数数列表成功')
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
          item.inputVisible = false
          item.inputValue = ''
        })
        if(this.categoriesName === 'many'){
          this.manyData = res.data
        }else{
          this.onlyData = res.data
        }
      },

      // 发送post请求添加(动态/静态)属性
      async addGories(){
        const {data:res} = await this.$http.post(`categories/${this.selectcascaderKeys[this.selectcascaderKeys.length-1]}/attributes`,
        {attr_name:this.addFrom.attr_name,attr_sel:this.categoriesName})
        if(res.meta.status !== 201)  return this.$message.error('添加失败')
        this.$message.success('添加成功')
        this.getcategoriesList()
        this.addDialogVisible = false
        // console.log('res',res)
      },

      // 控制参数编辑对话框的显示与隐藏
      async showEditDialog(paramsInfo){
        const {data:res} = await this.$http.get(`categories/${paramsInfo.cat_id}/attributes/`+paramsInfo.attr_id,{attr_sel:this.categoriesName})
        if(res.meta.status !== 200)  return this.$message.error('请求失败')
        // console.log('res',res)
        this.editFrom = res.data
        // console.log('paramsInfo',paramsInfo.cat_id)
        // console.log('paramsInfo',paramsInfo)
        // console.log('cat_id',paramsInfo.cat_id)
        // console.log('attr_id',paramsInfo.attr_id)
        this.editDialogVisible = true
      },

      // 发送put请求修改(动态/静态)参数
      async editParamsInfo(id){  
        const {data:res} = await this.$http.put(`categories/${this.editFrom.cat_id}/attributes/`+id,{attr_name:this.editFrom.attr_name,attr_sel:this.categoriesName})
        // console.log('this.editFrom.attr_name',this.editFrom.attr_name)
        if(res.meta.status !== 200)  return this.$message.error('修改失败')
        this.$message.success('修改成功')
        this.getcategoriesList()
        this.editDialogVisible = false
      },

      // 发送delete请求删除(动态/静态)参数
      async removeParamsById(paramsInfo){
        // console.log('id',id)
          const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        // console.log('confirmResult',confirmResult)
        if(confirmResult === 'confirm'){
          const {data : res} = await this.$http.delete(`categories/${paramsInfo.cat_id}/attributes/${paramsInfo.attr_id}`)
          // console.log('res',res)
          if(res.meta.status !== 200) return this.$message.error('删除失败')
            this.$message.success('删除参数成功')   
            this.getcategoriesList()
            return      
        }
        this.$message('已取消删除')
    },
    // 
    showInput(scope){
      scope.inputVisible = true
      this.$nextTick(_ => {
        console.log(_)
          this.$refs.saveTagInput.$refs.input.focus();
        })
    },
    // 
    async handleInputConfirm(scope){
      if(scope.inputValue.trim().length === 0){
        scope.inputVisible = false
        scope.inputValue = ''
        return
      }
      // console.log('scope',scope)
      // console.log('scope.attr_vals',scope.attr_vals.push(scope.inputValue.trim()))
      scope.attr_vals.push(scope.inputValue.trim())
      scope.inputValue = ''
      scope.inputVisible = false
      this.submitParams(scope)
    },

    // 封装一个编辑提交函数
    async submitParams(scope){
      const {data:res} = await this.$http.put(`categories/${scope.cat_id}/attributes/${scope.attr_id}`,
      {
      attr_name:scope.attr_name,
      attr_sel:scope.attr_sel,
      attr_vals:scope.attr_vals.join(' ')})
      console.log('res',res)
      // console.log('attr_vals',scope.attr_vals.join(' '))
      if(res.meta.status !== 200)  return this.$message.error('操作失败')
      this.$message.success('操作成功')
    },


    // 
    handleClose(i,scope){
      console.log('i',i)
      scope.attr_vals.splice(i,1)
      console.log('scope.attr_vals',scope.attr_vals)
      this.submitParams(scope)
    }
   

  }
    
}
</script>

<style lang="less" >
  .cat_opt {
    margin: 15px 0;
  }


  
</style>

