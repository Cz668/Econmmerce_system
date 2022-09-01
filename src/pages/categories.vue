<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom: 15px;">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    <el-breadcrumb-item >商品分类</el-breadcrumb-item>
  </el-breadcrumb>

    <!-- 卡片示图 -->
    <el-card>
        <el-row style="margin-bottom:15px;">
            <el-col>
                <el-button type="primary"
                @click="showCategoriesDialog">
                添加分类</el-button>
            </el-col>
        </el-row>
    <!-- 表格 -->
    <tree-table
    :data="categoriesList"
    :columns="columns"
    :expand-type="false"
    :selection-type="false"
    border
    show-index
    >
      <template slot="isEfftive" scope="scope">
          <i 
          v-if="scope.row.cat_deleted === false" 
          class="el-icon-success"
          style="color:green;"></i>
          <i v-else 
          class="el-icon-error"
          style="color:red;"></i>
      </template>

      <template slot="sort" scope="scope">
        <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="warning" v-else>三级</el-tag>
      </template>

      <!-- 用户编辑，删除商品分类按钮区 -->
      <template slot="operate" scope="scope">
            <el-button 
            @click="showEditDialog(scope.row.cat_id)"
            size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button 
            @click="removeCategoriesById(scope.row.cat_id)"
            size="mini" type="danger" icon="el-icon-delete">删除</el-button>        
      </template>
    </tree-table>
  
    <!-- 页码区 -->
      <div class="block" style="margin-top: 15px;">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[1,2,3,4,5]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
    </div>
    </el-card>

  <!-- 添加商品分类的对话框 -->
  <el-dialog
    title="添加商品分类"
    :visible.sync="addCategoriesDialog"
    width="40%"
    @close="addCategoriesDialogClosed">
    <!-- 内容主体区 -->
    <el-form
    :rules="FromRules" 
    ref="addCategoriesFromRef"
    :model="addcategoriesFrom"
    label-width="80px">
      <el-form-item label="分类名称" prop="cat_name">
        <el-input v-model="addcategoriesFrom.cat_name"></el-input>
      </el-form-item>
      <el-form-item label="父级分类">
        <!-- options用来指定数据源 -->
        <!-- props用来指定配置对象 -->
        <el-cascader
          v-model="selectCateKeys"
          :options="parentCateList"
          :props="cascaderProps" 
          @change="paraentCateChange"
          :clearable="true"
          change-on-select
          >
        </el-cascader>
      </el-form-item>
    </el-form>
    <!-- 底部区域 -->
    <span slot="footer" class="dialog-footer">
      <el-button 
      @click="addCategoriesDialog = false"
      >
      取 消
      </el-button>
      <el-button 
      type="primary" 
      @click="addCategories">
      确 定
      </el-button>
    </span>
  </el-dialog>

  <!-- 编辑商品分类的对话框 -->
  <el-dialog
    title="编辑商品分类"
    :visible.sync="editCategoriesDialog"
    width="40%"
    @close="editCategoriesDialogClosed">
    <!-- 内容主体区 -->
    <el-form 
    :rules="FromRules"
    ref="editCategoriesFromRef"
    :model="editcategoriesFrom"
    label-width="100px">
      <el-form-item label="分类名称" prop="cat_name">
        <el-input v-model="editcategoriesFrom.cat_name"></el-input>
      </el-form-item>
      <el-form-item label="是否有效" prop="cat_pid">
        <el-input v-model="editcategoriesFrom.cat_pid"></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="cat_level">
        <el-input v-model="editcategoriesFrom.cat_level"></el-input>
      </el-form-item>
    </el-form>
    <!-- 底部区域 -->
    <span slot="footer" class="dialog-footer">
      <el-button 
      @click="editCategoriesDialog = false"
      >
      取 消
      </el-button>
      <el-button 
      type="primary" 
      @click="editCategoriesInfo(editcategoriesFrom.cat_id)">
      确 定
      </el-button>
    </span>
  </el-dialog>
  </div>
</template>

<script>
export default {
    name:'CategoRies',
    data(){
        return {
          columns: [
          {
            label: '分类名称',
            prop: 'cat_name',
            width: '400px',
          },
          {
            label: '是否有效',
            type: 'template',
            template: 'isEfftive',
          },
          {
            label: '排序',
            type: 'template',
            template: 'sort',
          },
          {
            label: '操作',
            type: 'template',
            template: 'operate',
          },
          ],
            // 添加表单的验证规则对象
            FromRules:{
              cat_name: [
                { required: true, message: '请输入用户名', trigger: 'blur' },
                { min: 3, max: 6, message: '请输入正确的商品分类名', trigger: 'blur' }
              ],
              cat_pid: [
                { required: true, message: '请输入排序', trigger: 'blur' },
                { min: 1, max: 1, message: '请输入正确的格式', trigger: 'blur' }
              ],
              cat_level: [
                { required: true, message: '请输入商品分类等级', trigger: 'blur' },
                { min: 1, max: 1, message: '请输入正确的格式', trigger: 'blur' }
              ],
            },
            // 商品分类数据列表
            categoriesList:[],
            //商品分类数总数
            total: 0,
            queryInfo:{
                type:'',
                //当前的页数
                pagenum:1,
                //当前每页显示多少条
                pagesize:4
            },
            // 控制添加分类商品对话框显示和隐藏
            addCategoriesDialog:false,
            // 添加商品分类对话框信息
            addcategoriesFrom:{
              // 将要添加的分类名称
              cat_name:'',
              // 父级分类的Id
              cat_pid:0,
              // 分类的等级
              cat_level:0,
            },
            // 控制编辑分类商品对话框显示和隐藏
            editCategoriesDialog:false,
            // 编辑商品分类数据
            editcategoriesFrom:{},
            // 父级分类列表
            parentCateList:[],
            // 用来指定级联选择器的配置对象
            cascaderProps:{
              value:'cat_id',
              label:'cat_name',
              children:'children',
              expandTrigger: 'hover'
            },
            // 选中的父级分类的Id数组
            selectCateKeys:[],
        }
    },
    created(){
        this.getcategoriesList()
    },
    methods:{

      // 发起get请求获取商品分类数列表
      async getcategoriesList(){
        const {data:res} = await this.$http.get('categories',{ params : this.queryInfo })
        // console.log('res',res)
        if(res.meta.status !== 200)  return this.$message.error('获取商品分类数列表失败')
        this.categoriesList = res.data.result
        this.total = res.data.total
        // console.log('getcategoriesListres',res)
      }, 

      //监听页面显示条数的变化
      handleSizeChange(newSize){
        //   console.log('newSize',newSize)
          this.queryInfo.pagesize = newSize
          this.getcategoriesList()
      },

      //监听当前页面的变化
      handleCurrentChange(newPage){
        this.queryInfo.pagenum = newPage
        this.getcategoriesList()
        // console.log('newPage',newPage)
      }, 
        
      // 获取父级分类的数据列表
      async getParaentCateList(){
          const {data : res} = await this.$http.get('categories/',{params:{type:2}})
          if(res.meta.status !== 200)  return this.$message.error('获取父级分类数据失败')
          this.parentCateList = res.data
          // console.log('this.parentCateList',this.parentCateList)
      },

      // 展示添加分类对话框
      showCategoriesDialog(){
        this.getParaentCateList()
        this.addCategoriesDialog = true
      },
        // 添加商品分类
       addCategories(){
          // console.log('this.addcategoriesFrom',this.addcategoriesFrom)
          this.$refs.addCategoriesFromRef.validate(async value => {
            if(!value) return 
            const {data:res} = await this.$http.post('categories',this.addcategoriesFrom)
            // console.log('res',res)
            if(res.meta.status !== 201)  return this.$message.error('添加商品分类失败')
            this.$message.success('添加商品列表成功')
            this.addCategoriesDialog = false
            this.getcategoriesList()
          })
            
        },

        // 选中项发生变化触发这个函数(paraentCateChange(value)可携带参数，得到的值与this.selectCateKeys一样)
        paraentCateChange(){
          // console.log('this.selectCateKeys',this.selectCateKeys)
          // console.log('value',value)
          if(this.selectCateKeys.length > 0){
            this.addcategoriesFrom.cat_pid = this.selectCateKeys[this.selectCateKeys.length - 1]
            this.addcategoriesFrom.cat_level = this.selectCateKeys.length
            return
          }else{
            this.addcategoriesFrom.cat_level = 0
            this.addcategoriesFrom.cat_pid = 0
          }
        },

        // 监听添加商品分类对话框关闭事件(可要可不要)
        addCategoriesDialogClosed(){
            // 重置用户对话框的信息
            this.$refs.addCategoriesFromRef.resetFields()
            this.selectCateKeys = []
            this.addcategoriesFrom.cat_level = 0
            this.addcategoriesFrom.cat_pid = 0
        },

        // 监听编辑商品分类对话框关闭事件(可要可不要)
        editCategoriesDialogClosed(){
            // 重置用户对话框的信息
            this.$refs.editCategoriesFromRef.resetFields()
        },

        // 展示编辑商品分类对话框
        async showEditDialog(id){
          this.editCategoriesDialog = true
          const {data:res} = await this.$http.get('categories/'+id)
          // console.log('res',res)
          if(res.meta.status !== 200)  return this.$message.error('查询商品分类失败')
          this.editcategoriesFrom = res.data
        },

        // 发送put请求修改商品分类信息并提交
        async editCategoriesInfo(id){
          this.$refs.editCategoriesFromRef.validate( async valid => {
            if(!valid) return this.$message.error('格式有误')
            const {data:res} = await this.$http.put('categories/'+id,{cat_name:this.editcategoriesFrom.cat_name})
            // console.log('res',res)
            if(res.meta.status !== 200) return this.$message.error('修改商品分类失败')
            this.$message.success('修改商品分类成功')
            // 隐藏编辑用户对话框
            this.editCategoriesDialog = false
            this.getcategoriesList()
          })
      },

      // 发起delete请求删除单个用户
      async removeCategoriesById(id){
        // console.log('id',id)
          const confirmResult = await this.$confirm('此操作将永久删除该商品分类, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        // console.log('err',err)
        if(confirmResult === 'confirm'){
          const {data : res} = await this.$http.delete('categories/'+ id)
          if(res.meta.status !== 200) return this.$message.error('删除失败')
            this.$message.success('删除商品分类成功')  
            this.getcategoriesList()
            return    
        }
        this.$message.error('已取消删除')
      },

      
    }
}
</script>

<style lang="less" scoped>
  .el-cascader {
    width: 100%;
  }
  .el-cascader-menu{
    height: 200px;
  }

</style>
